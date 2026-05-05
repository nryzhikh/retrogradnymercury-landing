# Deployment runbook

Stack: Next.js 16 (standalone) container behind Caddy 2, orchestrated by Docker Compose
on a single VPS. Images are built by GitHub Actions and pushed to GitHub Container
Registry (GHCR); the VPS pulls and restarts on every push to `main`.

## Files

- [`Dockerfile`](../Dockerfile) — 3-stage build, `node:22-alpine`, non-root, healthcheck.
- [`.dockerignore`](../.dockerignore) — keeps build context small.
- [`docker-compose.yml`](./docker-compose.yml) — `web` (Next) + `caddy` services.
- [`Caddyfile`](./Caddyfile) — TLS, gzip/zstd, security headers, static caching.
- [`bootstrap.sh`](./bootstrap.sh) — single local script: SSHes into the VPS as
  root (key-only) and applies the full hardening + Docker install.
- [`.env.bootstrap.example`](./.env.bootstrap.example) — template for the local
  secrets file consumed by `bootstrap.sh`.
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) — CI/CD.

> Config values (image ref, site domain, ACME email, Node defaults) are
> hardcoded directly in `docker-compose.yml` and `Caddyfile`. There is no `.env`
> file on the VPS — CI scp's the two files into `/opt/mercury/` on every deploy.

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

### 5. Set the real domain and email

The hardcoded placeholder is `mercury.example.com` (2 places in
[Caddyfile](./Caddyfile), 0 places in [docker-compose.yml](./docker-compose.yml))
and `admin@example.com` (1 place in [Caddyfile](./Caddyfile)). Replace them
before the first deploy:

```bash
sed -i '' 's/mercury\.example\.com/your-domain.tld/g' deploy/Caddyfile
sed -i '' 's/admin@example\.com/you@your-domain.tld/g' deploy/Caddyfile
```

(`sed -i ''` for macOS; on Linux drop the `''`.)

The image reference in [docker-compose.yml](./docker-compose.yml) is already
correct: `ghcr.io/nryzhikh/retrogradnymercury-landing:latest`.

### 6. Make the GHCR package public (one-time, after first CI push)

CI pushes the image privately by default, so the VPS would need a PAT to pull.
Easiest path for a public-facing landing page is to flip the package to public:

1. After the first successful CI run, open
   `https://github.com/nryzhikh/retrogradnymercury-landing/pkgs/container/retrogradnymercury-landing`.
2. Package settings → **Change package visibility** → **Public** → confirm.

The image contains only what Caddy serves to the world anyway (compiled HTML/JS/CSS
+ the Next.js server), so making it public is informationally neutral.

### 7. GitHub repo secrets

In `Settings -> Environments -> production`, add:

| Secret      | Value                                             |
|-------------|---------------------------------------------------|
| `SSH_HOST`  | VPS IP or hostname                                |
| `SSH_USER`  | `deploy`                                          |
| `SSH_KEY`   | contents of `~/.ssh/mercury_retreat` (private)    |
| `SSH_PORT`  | optional, defaults to 22                          |

The workflow uses the built-in `GITHUB_TOKEN` to push to GHCR — no PAT needed.

### 8. First deploy

Trigger CI by pushing to `main` (or click "Run workflow" on the deploy action).
CI will: build the image, push to GHCR, scp `docker-compose.yml` + `Caddyfile`
to `/opt/mercury/`, then `docker compose pull && up -d`.

Watch the cert issuance on the first hit:

```bash
ssh -i ~/.ssh/mercury_retreat deploy@<vps-ip>
docker compose -f /opt/mercury/docker-compose.yml logs -f caddy
```

Hit `https://your-domain.tld/` in a browser; Caddy fetches a Let's Encrypt cert
on the first request.

## Day-to-day

- **Deploy app code**: `git push` — CI rebuilds, repushes, redeploys.
- **Tweak Caddy or compose**: edit `deploy/Caddyfile` or `deploy/docker-compose.yml`,
  `git push`. CI scp's the files and re-applies. No ssh needed.
- **Rollback**: edit `image:` in [docker-compose.yml](./docker-compose.yml) to a
  specific `sha-<short>` tag (CI tags both `:latest` and `:sha-<short>` on every
  build), `git push`. To roll back without a commit:
  `ssh deploy@vps && cd /opt/mercury && sed -i 's|:latest|:sha-abcdef|' docker-compose.yml && docker compose up -d`.
- **Logs**: `docker compose -f /opt/mercury/docker-compose.yml logs -f web|caddy`.
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
