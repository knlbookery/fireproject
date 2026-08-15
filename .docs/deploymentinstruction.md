# F.I.R.E. Platform — VPS Deployment Instruction

Authoritative, step-by-step instruction for refactoring the current codebase into a
deploy-ready state and shipping it to the Netcup VPS (AlmaLinux 9 + DirectAdmin,
Cloudflare DNS/SSL, Airtable content store, Brevo SMTP, Zeffy donations, Lovable AI
Gateway for the assistant and page narrator).

Priority order when anything conflicts: user request → `CLAUDE.md` → `INSTRUCTIONS.txt`
→ `DEPLOYMENT.md` → this file → `README.md`.

---

## 0. Non-negotiables (verify before every deploy)

1. No Node.js runtime in production. The frontend is a static Vite SPA; all server work is PHP.
2. No secret may carry the `VITE_` prefix. The browser never calls Airtable, Brevo, Zeffy admin APIs, or the AI gateway directly.
3. All private integrations run through same-origin PHP endpoints under `/api/*.php`.
4. `private/`, `app/`, and `storage/` live **outside** `public_html`.
5. `vendor/` is generated on the target with `composer install` — never committed, never SFTP-copied from a local build.
6. Never commit `.env*`, `private/`, `storage/`, `node_modules/`, `vendor/`, or `dist/`.
7. Payment processing changes (Zeffy webhook secret, ledger writes) require explicit approval + security review.

---

## 1. Pre-deployment refactor checklist (repo side)

Complete all items before touching the VPS.

### 1.1 Frontend

- [ ] `npm ci` succeeds from a clean checkout using `package-lock.json` (npm is the approved package manager; `bun.lock` is legacy and must not be regenerated).
- [ ] `npm run build` produces `dist/index.html`, `dist/assets/`, and copies `public/` (including `.htaccess`, `robots.txt`, `sitemap.xml`, `llms.txt`, `images/`).
- [ ] `npm run preview` renders every route with no console errors: `/`, `/about`, `/mission`, `/impact`, `/programs`, `/leadership`, `/leadership/:slug`, `/partners`, `/initiatives/*`, `/events`, `/press`, `/press/:slug`, `/sponsors`, `/donate`, `/volunteer`, `/contact`.
- [ ] All API calls are relative (`/api/*.php`) — no absolute hosts, no Netlify function paths.
  - Verify: `rg -n "netlify|localhost:8080|http://127" src/` returns nothing outside comments.
- [ ] No secret-looking `VITE_` variables: `rg -n "import.meta.env.VITE_" src/`.
- [ ] SEO: canonical URLs, `sitemap.xml`, and `robots.txt` all point at `https://freeinspiration.org`.
- [ ] Deep-link refresh works via the SPA fallback in `public/.htaccess`.

### 1.2 Backend

- [ ] `server/app/composer.json` + `composer.lock` are committed and PSR-4 maps `Fire\` → `src/`.
- [ ] Every file in `server/public-api/` is a thin entry point that only requires `bootstrap-loader.php` and delegates to `server/app/src/`.
- [ ] Endpoints present and accounted for: `content.php`, `events.php`, `press.php`, `page-content.php`, `contact.php`, `rsvp.php`, `assistant.php`, `page-summary.php`, `donations.php`, `zeffy-webhook.php`, `health.php`.
- [ ] `php -l` passes on every PHP file:
  ```bash
  find server -name '*.php' -not -path '*/vendor/*' -print0 | xargs -0 -n1 php -l
  ```
- [ ] No hardcoded credentials or absolute `/home/USERNAME/...` paths:
  ```bash
  rg -n "/home/|pat[A-Za-z0-9]{14,}|xkeysib-" server/ src/
  ```
- [ ] Domain root is always resolved as `dirname(__DIR__, 2)` from a public endpoint, never a hardcoded username.
- [ ] Rate limiting is enabled on `contact.php`, `rsvp.php`, `assistant.php`, and `page-summary.php`.
- [ ] `zeffy-webhook.php` verifies `ZEFFY_WEBHOOK_SECRET` and rejects unsigned requests.
- [ ] PHP `mail()` is not used anywhere; all outbound mail goes through PHPMailer + Brevo SMTP.

### 1.3 Local end-to-end smoke test

```bash
# terminal 1 — PHP API
FIRE_ENV_FILE="$PWD/.private/.env" php -S localhost:8080 -t server/public-api
# terminal 2 — frontend (proxies /api/*.php to :8080)
npm run dev
```

Confirm: hero slides load from Airtable, events + RSVP submit, contact form stores a record
and sends mail, assistant replies, page narrator returns a summary, donations progress renders.

---

## 2. Server prerequisites (one time)

On the VPS as root:

- AlmaLinux 9 with DirectAdmin installed and the domain `freeinspiration.org` created.
- PHP 8.2+ (PHP-FPM) selected for the domain in DirectAdmin, with extensions: `curl`, `json`, `mbstring`, `openssl`, `fileinfo`, `zip`.
- Composer 2 available (`/usr/local/bin/composer`).
- Outbound TCP 587 open to `smtp-relay.brevo.com` and outbound 443 open to `api.airtable.com` and the AI gateway host.
- `.htaccess` overrides allowed (`AllowOverride All`) for the domain.
- Cloudflare DNS `A` record → VPS IP, SSL mode **Full (strict)**, with a valid Let's Encrypt certificate issued in DirectAdmin.

---

## 3. Production directory contract

```text
/home/DA_USERNAME/domains/freeinspiration.org/
├── private/
│   └── .env                 # 0600, owned by the DA user
├── app/
│   ├── bootstrap.php
│   ├── composer.json
│   ├── composer.lock
│   ├── vendor/              # generated on the server
│   └── src/
├── storage/
│   ├── logs/
│   ├── rate-limit/
│   ├── assistant/
│   ├── donations/
│   └── page-summaries/
└── public_html/
    ├── index.html
    ├── .htaccess
    ├── assets/
    ├── images/
    ├── robots.txt
    ├── sitemap.xml
    ├── llms.txt
    └── api/
        ├── bootstrap-loader.php
        ├── content.php
        ├── events.php
        ├── press.php
        ├── page-content.php
        ├── contact.php
        ├── rsvp.php
        ├── assistant.php
        ├── page-summary.php
        ├── donations.php
        ├── zeffy-webhook.php
        └── health.php
```

Mapping from repo → server:

| Repo path | Server path |
|---|---|
| `dist/*` | `public_html/` |
| `public/.htaccess` | `public_html/.htaccess` (shipped inside `dist/`) |
| `server/app/*` | `app/` |
| `server/public-api/*` | `public_html/api/` |
| (created on server) | `private/.env`, `storage/*` |

---

## 4. Environment file

Create `/home/DA_USERNAME/domains/freeinspiration.org/private/.env` (never in Git):

```ini
APP_ENV=production
APP_URL=https://freeinspiration.org

# Airtable
AIRTABLE_PAT=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_HERO=Hero Slides
AIRTABLE_TABLE_CONTACTS=Contact Form
AIRTABLE_TABLE_PRESS=Press Articles
AIRTABLE_TABLE_PAGE_CONTENT=Page Content
AIRTABLE_TABLE_DONATIONS=Donations

# Brevo SMTP (transport only — Google hosts the destination mailbox)
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_ENCRYPTION=tls
BREVO_SMTP_USERNAME=
BREVO_SMTP_PASSWORD=

# Mail routing
MAIL_FROM_ADDRESS=no-reply@freeinspiration.org
MAIL_FROM_NAME=F.I.R.E.
MAIL_TO_ADDRESS=fireorg@gmail.com

# Abuse control
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_SECONDS=900

# AI assistant + page narrator
LOVABLE_API_KEY=

# Donations
ZEFFY_WEBHOOK_SECRET=
```

Permissions:

```bash
chmod 700 private
chmod 600 private/.env
```

Missing or empty required keys cause endpoints to fail closed with a generic 500 —
check `storage/logs/` rather than exposing details to the browser.

---

## 5. Deployment procedure

Run from a clean checkout of the branch being released (`main` for production,
`dev` for `dev.freeinspiration.org`).

### 5.1 Build locally

```bash
npm ci
npm run build
```

### 5.2 Upload

```bash
DA_USER=DA_USERNAME
DOMAIN_ROOT=/home/$DA_USER/domains/freeinspiration.org

# backend code (no vendor/)
rsync -av --delete --exclude vendor/ server/app/ $DA_USER@SERVER:$DOMAIN_ROOT/app/

# public API entry points
rsync -av --delete server/public-api/ $DA_USER@SERVER:$DOMAIN_ROOT/public_html/api/

# static frontend — keep api/ intact
rsync -av --delete --exclude api/ dist/ $DA_USER@SERVER:$DOMAIN_ROOT/public_html/
```

### 5.3 Install dependencies on the server

```bash
cd $DOMAIN_ROOT/app
composer install --no-dev --optimize-autoloader --no-interaction
```

### 5.4 Create runtime directories

```bash
cd $DOMAIN_ROOT
mkdir -p private storage/{logs,rate-limit,assistant,donations,page-summaries}
chmod 700 private
chmod 750 storage storage/*
chown -R $DA_USER:$DA_USER app storage private public_html
```

### 5.5 Verify document root isolation

```bash
curl -I https://freeinspiration.org/../private/.env      # must not resolve
curl -s  https://freeinspiration.org/api/../../app/bootstrap.php   # must 403/404
```

---

## 6. Post-deployment verification

```bash
BASE=https://freeinspiration.org

curl -s  $BASE/api/health.php                       # {"success":true,...}
curl -s  $BASE/api/content.php   | head -c 300      # live Airtable hero slides
curl -s  $BASE/api/events.php    | head -c 300
curl -s  $BASE/api/press.php     | head -c 300
curl -s  $BASE/api/donations.php | head -c 300
curl -sI $BASE/press/some-article | head -20        # 200 via SPA fallback, not 404
```

Manual checks in a browser:

- [ ] Home hero slider auto-plays with Airtable images.
- [ ] Contact form: success modal, Airtable record created, Brevo email received at `MAIL_TO_ADDRESS`, honeypot submission silently rejected.
- [ ] Event RSVP: confirmation email received.
- [ ] AI assistant answers a site-specific question (Airtable knowledge is being injected).
- [ ] Page narrator returns a summary and speaks it, on at least three routes.
- [ ] Zeffy donate iframe loads on `/donate` and from a programme card dialog; funding progress bars render.
- [ ] Mobile (≤430px): floating pill nav, assistant widget, narrator widget all open and close.
- [ ] Deep-link refresh works on `/programs`, `/press/:slug`, `/leadership/:slug`.
- [ ] No mixed-content or CSP errors in the console.

Log locations: `storage/logs/` (application) and DirectAdmin's domain error log (PHP/Apache).

---

## 7. Security hardening

- `public_html/.htaccess`: deny access to dotfiles, `composer.*`, `*.md`, `*.log`; force HTTPS; set `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and a CSP that allows the Zeffy iframe and analytics host only.
- API responses must never echo raw exception text; generic messages only.
- Keep rate-limit files under `storage/rate-limit/` and prune with a weekly cron.
- Rotate `AIRTABLE_PAT`, `BREVO_SMTP_PASSWORD`, `LOVABLE_API_KEY`, and `ZEFFY_WEBHOOK_SECRET` on any suspected exposure; rotating requires only editing `private/.env`.
- Cloudflare: enable "Always Use HTTPS", Bot Fight Mode, and a rate-limit rule on `/api/contact.php` and `/api/rsvp.php`.

---

## 8. Rollback

1. Keep the previous release: `cp -a public_html public_html.bak-$(date +%F)` and `cp -a app app.bak-$(date +%F)` before uploading.
2. To roll back: restore both directories and re-run `composer install --no-dev` if `composer.lock` changed.
3. `private/.env` and `storage/` are never overwritten by a deploy, so no data restore is needed.

---

## 9. Maintenance

- Weekly: check `storage/logs/` size, prune `storage/page-summaries/` and `storage/rate-limit/`.
- Monthly: `npm audit`, `composer audit`, verify certificate renewal.
- After any Airtable schema change: confirm field names still match `server/app/src/AirtableClient.php` consumers, then clear caches under `storage/assistant/` and `storage/page-summaries/`.

---

## 10. Definition of done

A deploy is complete only when: the build was generated from the released commit, all
endpoints in § 6 return the expected payloads against production credentials, the contact
and RSVP mail flows were confirmed by an actually received email, no secret is reachable
from the web root, and rollback copies exist on the server.
