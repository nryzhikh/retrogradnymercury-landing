#!/usr/bin/env bash
# One-shot VPS bootstrap. Runs locally on your laptop.
#
# Prereq (do this ONCE, manually, in the provider's web console / VPS panel):
#   add the public key you want to use as `root`'s authorized key.
#   For Beget: VPS panel -> "SSH-keys" -> paste the contents of <key>.pub.
#
# Then on your laptop:
#   cp deploy/.env.bootstrap.example deploy/.env.bootstrap
#   chmod 600 deploy/.env.bootstrap
#   $EDITOR deploy/.env.bootstrap
#   bash deploy/bootstrap.sh           # asks before connecting
#   bash deploy/bootstrap.sh --yes     # skip confirmation
#
# What happens (all over a single SSH session as root):
#   apt update; install ufw fail2ban unattended-upgrades sudo;
#   create the deploy user (key-only) with NOPASSWD sudo;
#   authorize your public key for the deploy user;
#   sshd hardening (no root SSH, no password auth);
#   UFW (22/80/443 tcp + 443 udp);
#   fail2ban with your operator IP added to ignoreip (no self-ban);
#   unattended-upgrades; Docker Engine + Compose; /opt/<APP_NAME>;
#   2 GiB swap if RAM < 2 GiB; UTC timezone;
#   VERIFY sshd is listening AND deploy can sudo passwordless;
#   only THEN lock the root password.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${BOOTSTRAP_ENV_FILE:-${SCRIPT_DIR}/.env.bootstrap}"

log() { printf '\033[1;32m[bootstrap]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[bootstrap]\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31m[bootstrap]\033[0m %s\n' "$*" >&2; exit 1; }

CONFIRM=1
for arg in "$@"; do
  case "$arg" in
    -y|--yes) CONFIRM=0 ;;
    -h|--help) sed -n '2,24p' "$0"; exit 0 ;;
    *) die "unknown arg: $arg" ;;
  esac
done

[[ -f "$ENV_FILE" ]] || die "missing $ENV_FILE (copy .env.bootstrap.example and edit)"

perm=$(stat -f '%Lp' "$ENV_FILE" 2>/dev/null || stat -c '%a' "$ENV_FILE" 2>/dev/null || echo "")
if [[ -n "$perm" && "$perm" != "600" && "$perm" != "400" ]]; then
  warn "$ENV_FILE has perms $perm; recommend: chmod 600 $ENV_FILE"
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

VPS_HOST="${VPS_HOST:?VPS_HOST not set in $ENV_FILE}"
VPS_PORT="${VPS_PORT:-22}"
INITIAL_SSH_USER="${INITIAL_SSH_USER:-root}"

SSH_KEY="${INITIAL_SSH_KEY:?INITIAL_SSH_KEY not set in $ENV_FILE (path to private key already authorized for root@VPS)}"
SSH_KEY="${SSH_KEY/#\~/$HOME}"
[[ -r "$SSH_KEY" ]] || die "INITIAL_SSH_KEY not readable: $SSH_KEY"

DEPLOY_USER="${DEPLOY_USER:-deploy}"
APP_NAME="${APP_NAME:-mercury}"
LOCK_ROOT_PASSWORD="${LOCK_ROOT_PASSWORD:-1}"

PUBKEY_FILE="${DEPLOY_SSH_PUBKEY_FILE:-${SSH_KEY}.pub}"
PUBKEY_FILE="${PUBKEY_FILE/#\~/$HOME}"
[[ -r "$PUBKEY_FILE" ]] || die "deploy public key not readable: $PUBKEY_FILE"
DEPLOY_PUBKEY="$(cat "$PUBKEY_FILE")"

cat <<SUMMARY
[bootstrap] About to harden:
  target:           ${INITIAL_SSH_USER}@${VPS_HOST}:${VPS_PORT}
  ssh key:          ${SSH_KEY}
  deploy user:      ${DEPLOY_USER}  (NOPASSWD sudo, key-only login)
  deploy authkey:   ${PUBKEY_FILE}
  app dir:          /opt/${APP_NAME}
  lock root pwd:    ${LOCK_ROOT_PASSWORD}  (only if final verification passes)
SUMMARY

if [[ "$CONFIRM" -eq 1 ]]; then
  read -r -p "Proceed? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || die "aborted"
fi

SSH_OPTS=(
  -p "$VPS_PORT"
  -i "$SSH_KEY"
  -o IdentitiesOnly=yes
  -o StrictHostKeyChecking=accept-new
  -o ConnectTimeout=15
  -o ServerAliveInterval=30
)

log "connecting to ${INITIAL_SSH_USER}@${VPS_HOST}:${VPS_PORT}"

# The remote payload is two parts piped to `bash -s`:
#   1) shell-quoted exports of the values this run needs
#   2) a literal hardening script (single-quoted heredoc, no expansion)
{
  printf 'export DEPLOY_USER=%q\n' "$DEPLOY_USER"
  printf 'export APP_NAME=%q\n' "$APP_NAME"
  printf 'export SSH_PORT=%q\n' "$VPS_PORT"
  printf 'export LOCK_ROOT_PASSWORD=%q\n' "$LOCK_ROOT_PASSWORD"
  printf 'export DEPLOY_SSH_PUBKEY=%q\n' "$DEPLOY_PUBKEY"
  cat <<'REMOTE'
set -euo pipefail
[[ $EUID -eq 0 ]] || { echo "[remote] must be run as root" >&2; exit 1; }
[[ -r /etc/os-release ]] || { echo "[remote] /etc/os-release missing" >&2; exit 1; }
# shellcheck disable=SC1091
. /etc/os-release
case "${ID_LIKE:-$ID}" in
  *debian*|*ubuntu*) ;;
  *) echo "[remote] unsupported OS: $PRETTY_NAME" >&2; exit 1 ;;
esac

rlog() { printf '\033[1;36m[remote]\033[0m %s\n' "$*"; }

DEPLOY_USER="${DEPLOY_USER:?}"
APP_NAME="${APP_NAME:?}"
SSH_PORT="${SSH_PORT:-22}"
LOCK_ROOT_PASSWORD="${LOCK_ROOT_PASSWORD:-1}"
DEPLOY_SSH_PUBKEY="${DEPLOY_SSH_PUBKEY:?}"

OPERATOR_IP=""
if [[ -n "${SSH_CONNECTION:-}" ]]; then
  OPERATOR_IP=$(awk '{print $1}' <<<"$SSH_CONNECTION")
fi

rlog "apt update + base packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y --no-install-recommends \
  ca-certificates curl gnupg lsb-release \
  ufw fail2ban unattended-upgrades sudo tzdata

rlog "creating user ${DEPLOY_USER}"
if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
usermod -aG sudo "$DEPLOY_USER"

rlog "NOPASSWD sudo for ${DEPLOY_USER}"
sudo_file="/etc/sudoers.d/90-${DEPLOY_USER}"
printf '%s ALL=(ALL) NOPASSWD:ALL\n' "$DEPLOY_USER" > "$sudo_file"
chmod 0440 "$sudo_file"
visudo -c -f "$sudo_file" >/dev/null

rlog "authorizing pubkey for ${DEPLOY_USER}"
home="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$home/.ssh"
auth="$home/.ssh/authorized_keys"
touch "$auth"; chmod 600 "$auth"; chown "$DEPLOY_USER:$DEPLOY_USER" "$auth"
grep -qxF "$DEPLOY_SSH_PUBKEY" "$auth" || printf '%s\n' "$DEPLOY_SSH_PUBKEY" >> "$auth"

rlog "writing /etc/ssh/sshd_config.d/99-hardening.conf"
cat > /etc/ssh/sshd_config.d/99-hardening.conf <<EOF
# Managed by deploy/bootstrap.sh
Port ${SSH_PORT}
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
UsePAM yes
PubkeyAuthentication yes
X11Forwarding no
AllowAgentForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 30
MaxAuthTries 5
EOF
sshd -t
systemctl reload ssh 2>/dev/null || systemctl reload sshd

rlog "configuring UFW"
ufw --force reset >/dev/null
ufw default deny incoming
ufw default allow outgoing
ufw allow "${SSH_PORT}/tcp" comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP/3'
ufw --force enable >/dev/null

rlog "configuring fail2ban (ignoreip operator: ${OPERATOR_IP:-none})"
ignoreip="127.0.0.1/8 ::1${OPERATOR_IP:+ ${OPERATOR_IP}}"
cat > /etc/fail2ban/jail.d/sshd.local <<EOF
[DEFAULT]
ignoreip = ${ignoreip}

[sshd]
enabled  = true
port     = ${SSH_PORT}
backend  = systemd
maxretry = 5
findtime = 10m
bantime  = 1h
EOF
systemctl enable --now fail2ban
systemctl restart fail2ban

rlog "enabling unattended-upgrades"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
systemctl enable --now unattended-upgrades

if ! command -v docker >/dev/null 2>&1; then
  rlog "installing Docker Engine"
  install -m 0755 -d /etc/apt/keyrings
  arch="$(dpkg --print-architecture)"
  curl -fsSL "https://download.docker.com/linux/${ID}/gpg" \
    | gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=${arch} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${ID} ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y --no-install-recommends \
    docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
else
  rlog "docker already installed: $(docker --version)"
fi
usermod -aG docker "$DEPLOY_USER"

rlog "ensuring /opt/${APP_NAME} owned by ${DEPLOY_USER}"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/opt/${APP_NAME}"

mem_kb=$(awk '/^MemTotal:/ {print $2}' /proc/meminfo)
total_swap=$(awk '/^SwapTotal:/ {print $2}' /proc/meminfo)
if (( mem_kb < 2*1024*1024 )) && (( total_swap == 0 )); then
  rlog "creating /swapfile (2 GiB)"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10 >/dev/null
  grep -q '^vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi

timedatectl set-timezone UTC || true

rlog "verifying sshd is listening on port ${SSH_PORT}"
ss -tlnp 2>/dev/null | awk '{print $4}' | grep -Eq "[:.]${SSH_PORT}\$" \
  || { echo "[remote] sshd not listening on ${SSH_PORT}; root NOT locked" >&2; exit 1; }

rlog "verifying ${DEPLOY_USER} can sudo without a password"
sudo -n -u "$DEPLOY_USER" sudo -n true 2>/dev/null \
  || { echo "[remote] ${DEPLOY_USER} cannot run NOPASSWD sudo; root NOT locked" >&2; exit 1; }

[[ -s "$auth" ]] || { echo "[remote] empty authorized_keys; root NOT locked" >&2; exit 1; }

if [[ "$LOCK_ROOT_PASSWORD" == "1" ]]; then
  rlog "locking root password"
  passwd -l root >/dev/null
fi

rlog "done"
REMOTE
} | ssh "${SSH_OPTS[@]}" "${INITIAL_SSH_USER}@${VPS_HOST}" bash -s

cat <<DONE

[bootstrap] success.

Verify (from your laptop, NOT the existing root session):
  ssh -p ${VPS_PORT} -i ${SSH_KEY} ${DEPLOY_USER}@${VPS_HOST}
  sudo whoami        # should print: root  (no password prompt)

Then on the VPS as ${DEPLOY_USER}:
  echo "\$GHCR_READ_PAT" | docker login ghcr.io -u <github-user> --password-stdin
  cd /opt/${APP_NAME}      # drop docker-compose.yml, Caddyfile, .env here
  docker compose up -d
DONE
