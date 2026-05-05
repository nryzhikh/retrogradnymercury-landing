# Deployment runbook

Stack: Next.js 16 (standalone) container behind Caddy 2, orchestrated by Docker Compose
on a single VPS. Images are built by GitHub Actions and pushed to GitHub Container
Registry (GHCR); the VPS pulls and restarts on every push to `main`.

## Files

- [`Dockerfile`](../Dockerfile) — 3-stage build, `node:22-alpine`, non-root, healthcheck.
- [`.dockerignore`](../.dockerignore) — keeps build context small.
- [`docker-compose.yml`](./docker-compose.yml) — `web` (Next) + `caddy` services.
- [`Caddyfile`](./Caddyfile) — TLS, gzip/zstd, security headers, static caching.
- [`.env.example`](./.env.example) — template for the production `.env` on the VPS.
- [`bootstrap.sh`](./bootstrap.sh) — single local script: SSHes into the VPS as
  root (key-only) and applies the full hardening + Docker install.
- [`.env.bootstrap.example`](./.env.bootstrap.example) — template for the local
  secrets file consumed by `bootstrap.sh`.
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) — CI/CD.

## One-time VPS bootstrap

Replace `mercury.example.com`, `OWNER`, and SSH user as appropriate.

### 1. DNS

Create an `A` record `mercury.example.com -> <VPS IP>` and wait for propagation
(`dig +short mercury.example.com` should return the VPS IP).

### 2. Generate a key and authorize it for root on the VPS

Use a fresh ed25519 key dedicated to this server (do not reuse a personal key):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/mercury_retreat -C "mercury-vps"
cat ~/.ssh/mercury_retreat.pub
```

Paste that public key into the VPS provider's panel as the authorized key for
`root`. On Beget that's `VPS -> SSH-keys -> Add`. Reboot the VPS once afterward
if the panel says it only takes effect on reboot.

Verify before continuing:

```bash
ssh -i ~/.ssh/mercury_retreat root@<vps-ip> hostname
```

### 3. Run the bootstrap from your laptop

[`bootstrap.sh`](./bootstrap.sh) is a single local script. It loads
[`.env.bootstrap`](./.env.bootstrap.example) (gitignored), opens one SSH session
as root, and runs the entire hardening + Docker install inline. Idempotent.

```bash
cp deploy/.env.bootstrap.example deploy/.env.bootstrap
chmod 600 deploy/.env.bootstrap
$EDITOR deploy/.env.bootstrap       # fill in VPS_HOST and INITIAL_SSH_KEY

bash deploy/bootstrap.sh            # shows summary, asks to confirm
# or non-interactively:
bash deploy/bootstrap.sh --yes
```

After it finishes, log in as `deploy` from a second terminal **before** closing
the original session:

```bash
ssh -i ~/.ssh/mercury_retreat deploy@<vps-ip>
sudo whoami    # must print: root  (no password prompt)
```

Required `.env.bootstrap` keys: `VPS_HOST`, `INITIAL_SSH_KEY`. Optional with
sane defaults: `VPS_PORT`, `INITIAL_SSH_USER`, `DEPLOY_USER`, `APP_NAME`,
`DEPLOY_SSH_PUBKEY_FILE` (defaults to `${INITIAL_SSH_KEY}.pub`),
`LOCK_ROOT_PASSWORD`.

### 4. What the bootstrap does on the VPS

In a single SSH session as root:

- `apt update && upgrade`, installs `ufw`, `fail2ban`, `unattended-upgrades`, `sudo`
- creates the `deploy` user (key-only, no password) and adds to `sudo` group
- drops `/etc/sudoers.d/90-deploy` granting **NOPASSWD** sudo (validated with `visudo -c`)
- authorizes your public key in `~deploy/.ssh/authorized_keys`
- writes `/etc/ssh/sshd_config.d/99-hardening.conf`: `PermitRootLogin no`,
  `PasswordAuthentication no`, `MaxAuthTries 5`, etc.; `sshd -t` + reload
- `ufw` allowing `22/tcp`, `80/tcp`, `443/tcp`, `443/udp`
- enables `fail2ban` sshd jail with **operator IP added to `ignoreip`** (no self-ban)
- enables `unattended-upgrades`
- installs Docker Engine + Compose plugin from the official Docker apt repo;
  adds `deploy` to the `docker` group
- creates `/opt/mercury` owned by `deploy`
- enables a 2 GiB swapfile if memory < 2 GiB and no swap exists
- sets timezone to UTC
- **verifies** sshd is listening AND `deploy` can sudo passwordless AND the
  authorized\_keys file is non-empty
- only **then** locks the root password (the original root SSH session stays
  alive; if any verification fails, root is left unlocked so you can recover)

### 5. Project layout on the VPS

```bash
sudo mkdir -p /opt/mercury && sudo chown deploy:deploy /opt/mercury
cd /opt/mercury
# copy these from the repo's deploy/ folder (scp or git clone):
#   docker-compose.yml
#   Caddyfile
#   .env   (start from .env.example, fill in values)
```

Edit `.env` and set:

```
SITE_DOMAIN=mercury.example.com
ACME_EMAIL=admin@example.com
IMAGE=ghcr.io/OWNER/mercury:latest
```

### 6. GHCR auth on the VPS

GHCR packages default to private. Create a classic PAT (or fine-grained token) with
`read:packages` scope on your GitHub account, then on the VPS:

```bash
echo "$GHCR_READ_PAT" | docker login ghcr.io -u <github-user> --password-stdin
```

This persists credentials in `~/.docker/config.json` so `docker compose pull` works.

### 7. GitHub repo secrets and environment

In `Settings -> Environments -> production`, add:

| Secret      | Value                                                  |
|-------------|--------------------------------------------------------|
| `SSH_HOST`  | VPS IP or hostname                                     |
| `SSH_USER`  | `deploy`                                               |
| `SSH_KEY`   | contents of `~/.ssh/mercury_deploy` (private key)      |
| `SSH_PORT`  | optional, defaults to 22                               |

The workflow uses the built-in `GITHUB_TOKEN` to push to GHCR — no PAT needed for CI.

### 8. First deploy

```bash
cd /opt/mercury
docker compose pull
docker compose up -d
docker compose ps          # both services should become healthy
docker compose logs -f caddy   # watch ACME issue the cert on first request
```

Hit `https://mercury.example.com/` in a browser; Caddy will fetch a Let's Encrypt
certificate on the first hit.

## Day-to-day

- **Deploy**: push to `main`. CI builds, pushes `ghcr.io/OWNER/mercury:sha-<short>` and
  `:latest`, then SSHes in and runs `docker compose pull && docker compose up -d`.
- **Rollback**: `IMAGE=ghcr.io/OWNER/mercury:sha-<known-good> docker compose up -d`.
  The deploy workflow rewrites `IMAGE` in `/opt/mercury/.env` on every run, so to pin
  manually edit that line and run `docker compose up -d`.
- **Logs**: `docker compose logs -f web` / `docker compose logs -f caddy`.
- **Update Caddy/Compose config**: edit on VPS and `docker compose up -d` (Caddy reloads).
- **Disk**: `docker image prune -f` runs automatically after each deploy.

## Sanity checks after deploy

```bash
curl -I https://mercury.example.com/                       # 200 + HSTS header, HTTP/2
curl -fsS -X POST https://mercury.example.com/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"email":"test@example.com"}'                        # {"ok":true}
docker compose ps                                          # healthy x2
```

External: run [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=mercury.example.com)
once after first issuance — target grade A or A+.
