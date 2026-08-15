# F.I.R.E. Platform

The F.I.R.E. Platform runs on a single Netcup VPS running AlmaLinux 9 and DirectAdmin. The application is a static React/TypeScript/Vite frontend plus a lightweight PHP backend, with Airtable for managed content and contact records, Brevo SMTP for outbound contact notifications, and Cloudflare for DNS and browser-facing SSL.

**Frontend and backend are both implemented and locally validated as of 2026-08-06** (static SPA build confirmed, all five PHP endpoints live-tested against the real Airtable base — see CLAUDE.md's Migration Log for the full history). Netlify and TanStack Start server rendering have been fully removed from the codebase, not just deprioritized — see `archive/legacy-tanstack-start-ssr/` for the removed files. What remains is the actual DirectAdmin deployment (this document) and two deferred, non-blocking improvements: the Airtable content-caching layer (§ Airtable Content Strategy below) and a known Team-carousel UI bug (see CLAUDE.md's Migration Log).

## Project Goals

- Generate a conventional static Vite build in `dist/`.
- Serve the frontend from DirectAdmin `public_html`.
- Move all Airtable and Brevo work into PHP.
- Store production credentials in `private/.env` outside `public_html` and Git.
- Preserve approved design, routes, fallback content, and existing features.
- Use no local database and no permanent Node.js production process.
- Remove active Netlify runtime, Functions, redirects, and environment-variable dependencies.

## Target Architecture

```text
Visitor
  → Cloudflare
  → freeinspiration.org
  → DirectAdmin web server
      ├── Static React/Vite frontend
      └── PHP API
           ├── Airtable Web API
           └── Brevo SMTP
```

Browser endpoints (all implemented in `server/public-api/`):

```text
GET  /api/content.php
GET  /api/events.php
POST /api/rsvp.php
POST /api/contact.php
GET  /api/health.php
```

The browser must never call Airtable or Brevo directly.

## Core Features

- **Dynamic hero content:** Airtable-managed eyebrow, title, subtitle, image, order, and CTA fields.
- **Events and RSVP:** Preserve the existing approved behavior without inventing new tables or workflows.
- **Site images:** Stable Airtable slots combined with local fallback images.
- **Contact form:** PHP stores approved submission data in Airtable and sends notification mail through Brevo SMTP.
- **Donation UI:** Scaffolding may remain, but payment processing must not be activated without approval and a separate security review.

Contact flow:

```text
React form
  → /api/contact.php
  → validate and rate-limit
  → Airtable record
  → Brevo SMTP
  → fireorg@gmail.com
```

The visitor’s validated email is used only as `Reply-To`. Brevo sends the message; Google hosts the destination mailbox.

## Technology Stack

**Frontend:** React, TypeScript, Vite, and approved existing frontend libraries.  
**Backend:** PHP-FPM, Composer, `vlucas/phpdotenv`, PHPMailer, PHP cURL.  
**Infrastructure:** Netcup VPS, AlmaLinux 9, DirectAdmin, Cloudflare, Airtable, Brevo SMTP.

## Production Directory Structure

```text
/home/DA_USERNAME/domains/freeinspiration.org/
├── private/
│   └── .env
├── app/
│   ├── bootstrap.php
│   ├── composer.json
│   ├── composer.lock
│   ├── vendor/
│   ├── src/
│   └── cli/
├── storage/
│   ├── cache/
│   ├── logs/
│   ├── locks/
│   ├── rate-limit/
│   └── media/
└── public_html/
    ├── index.html
    ├── .htaccess
    ├── assets/
    ├── images/
    ├── fonts/
    └── api/
        ├── bootstrap-loader.php
        ├── content.php
        ├── events.php
        ├── rsvp.php
        ├── contact.php
        └── health.php
```

No Airtable outbound-webhook endpoint exists or is planned — the audited implementation uses only the Airtable Web API (PAT-authenticated reads/writes), not Airtable's outbound Webhooks API. See CLAUDE.md section 12 for the distinction.

Only `public_html` is web-accessible. `private`, `app`, and `storage` remain private.

### Creating the directory structure

Run once, on the VPS, as the DirectAdmin domain user (not root):

```bash
DAUSER="DA_USERNAME"       # replace with the real DirectAdmin username
DOMAIN="freeinspiration.org"
DOMAINROOT="/home/$DAUSER/domains/$DOMAIN"

mkdir -p "$DOMAINROOT/private"
mkdir -p "$DOMAINROOT/app/src"
mkdir -p "$DOMAINROOT/app/cli"
mkdir -p "$DOMAINROOT/storage/cache"
mkdir -p "$DOMAINROOT/storage/logs"
mkdir -p "$DOMAINROOT/storage/locks"
mkdir -p "$DOMAINROOT/storage/rate-limit"
mkdir -p "$DOMAINROOT/public_html/api"

chmod 700 "$DOMAINROOT/private"
# Create private/.env itself (see "Environment Configuration" above), then:
chmod 600 "$DOMAINROOT/private/.env"

chmod -R 750 "$DOMAINROOT/app"
chmod -R 770 "$DOMAINROOT/storage"
```

`storage/` must be writable by whichever user/group DirectAdmin's PHP-FPM pool actually runs as for this domain — check the domain's PHP-FPM settings in DirectAdmin rather than assuming; the `770` above assumes the PHP-FPM user shares a group with the DirectAdmin domain user, which is DirectAdmin's typical default but not guaranteed on every install. Never use `chmod 777`. `storage/media/` is not created here — only add it if the deferred attachment-mirroring work (see "Airtable Content Strategy" above) is actually implemented.

## Repository Structure After Refactor

```text
/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── src/
├── public/
│   └── .htaccess
├── server/
│   ├── app/
│   │   ├── bootstrap.php
│   │   ├── composer.json
│   │   ├── composer.lock
│   │   ├── vendor/        # generated, not committed
│   │   └── src/
│   ├── public-api/
│   └── cli/
└── dist/                 # generated, not committed
```

`server/app/composer.json`'s autoload mapping (`"Fire\\": "src/"`) is relative to `composer.json`'s own directory. It deploys straight across to `app/composer.json` in production — same relative depth to `src/` in both places (`server/app/composer.json` → `server/app/src/`; `app/composer.json` → `app/src/`), so the generated autoloader is portable between environments. `composer.json` previously lived at `server/composer.json` (one level up from `src/` locally but two levels up from `src/` in production once deployed to `app/composer.json`) — that depth mismatch made the generated classmap resolve to a nonexistent `app/app/src/` in production, a fatal error before any of the application's own error handling could run. See Migration Log for the live-diagnosis details.

## Environment Configuration

The real production environment file must be created at:

```text
/home/DA_USERNAME/domains/freeinspiration.org/private/.env
```

No env file is committed to the repository. Use this variable contract directly when creating the real `private/.env`.

**These 14 variables are the complete set the backend reads — verified against the source, not assumed.** Every one is consumed via `Config::get()` or `Config::require()`; adding anything else has no effect:

```env
AIRTABLE_PAT=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_HERO=
AIRTABLE_TABLE_CONTACTS=

BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=2525
BREVO_SMTP_ENCRYPTION=tls
BREVO_SMTP_USERNAME=
BREVO_SMTP_PASSWORD=

MAIL_FROM_ADDRESS=website@freeinspiration.org
MAIL_FROM_NAME=F.I.R.E. Website
MAIL_TO_ADDRESS=fireorg@gmail.com

CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_SECONDS=900
```

**Removed from this contract on 2026-08-12 — previously listed here but read by nothing:** `APP_ENV`, `APP_DEBUG`, `APP_URL`, `AIRTABLE_TABLE_EVENTS`, `AIRTABLE_TABLE_SITE_IMAGES`. The events table name is hardcoded as `'Events'` in `events.php`, and no code path reads a site-images table. This mattered in practice: during the production cutover the operator was told to add `APP_ENV`/`APP_URL` on this document's authority, correctly pointed out they were absent from the working staging file, and a source check confirmed nothing consumes them. Documenting a variable that no code reads invites exactly the false-dependency confusion that also cost time on the webhook URL (see CLAUDE.md's 2026-08-07 entry). Verify against the source before adding anything here:

```bash
grep -rhoE "Config::(get|require)\('[A-Z_]+'" server/ | grep -oE "'[A-Z_]+'" | tr -d "'" | sort -u
```

Security rules:

- Use an Airtable Personal Access Token limited to the required base and scopes.
- Use a Brevo SMTP key as `BREVO_SMTP_PASSWORD`.
- `MAIL_FROM_ADDRESS` must be verified for Brevo sending.
- No private value may use the `VITE_` prefix.
- `private` should use permission `700`; `.env` should use `600`.
- Never use `chmod 777`.

Optional Airtable webhook variables should be added only when the audited implementation actually uses that mechanism.

### Local PHP Environment

Real local credentials go in `.private/.env` (gitignored, never committed — see CLAUDE.md section 10 for the variable list). Point the backend at it with the backend-only `FIRE_ENV_FILE` variable before running any PHP command or dev server:

PowerShell example (adjust the path to your actual repo location):

```powershell
$env:FIRE_ENV_FILE = "D:\path\to\repo\.private\.env"
```

Never expose `FIRE_ENV_FILE` or private values through Vite.

## Installation and Local Development

### Prerequisites

- Node.js supported by the repository
- npm
- PHP supported by DirectAdmin
- Composer
- PHP extensions such as `curl`, `json`, `mbstring`, `openssl`, and `fileinfo`

### Frontend

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The production build must generate:

```text
dist/index.html
dist/.htaccess
dist/assets/
```

`npm run preview` is for local validation only.

### Backend

```bash
cd server/app
composer install
composer validate
php -l path/to/file.php
```

A Vite `/api` proxy may be used during local development, but production frontend calls must remain relative `/api/*.php` paths.

## Build and Asset Rules

- A root `index.html` is required for the final static Vite SPA.
- The React entry may remain `index.tsx` when valid or be normalized to `src/main.tsx`.
- Import assets stored in `src`.
- Use root-relative URLs for assets stored in `public`.
- Do not render `/src/...` asset URLs.
- Preserve exact filename capitalization for Linux.
- Do not rely on Netlify, Lovable, preview-domain, GitHub raw, or Windows-local asset URLs.
- Do not commit `dist/`.

## API Behavior

### `GET /api/content.php`

Returns Hero Slides. **Currently queries Airtable live on every request** — the atomic local-cache layer described under "Airtable Content Strategy" below is designed but not yet implemented (deferred, non-blocking; see CLAUDE.md's Migration Log). Falls back gracefully to a 500/502 JSON error (never a PHP error page) if Airtable is unreachable or misconfigured; the frontend has its own static fallback content for this case.

### `GET /api/events.php`

Returns active Events (`Status='Active'`), same live-fetch-and-fall-back behavior as `content.php`.

### `POST /api/rsvp.php`

Validates and writes an RSVP record to the `Event RSVPs` table, linked to the given event.

### `POST /api/contact.php`

Validates JSON, field lengths, email, a server-side honeypot check, and a server-side minimum-fill-time check; then independently writes to the `Contact Form` Airtable table (PAT-authenticated Web API) and sends a Brevo SMTP notification. Per CLAUDE.md sections 8 and 14, the visitor is told the submission succeeded only if **both** operations succeed — a single-side success is logged (redacted) and reported to the visitor as a generic temporary-processing error. File-based, per-IP rate limiting under `storage/rate-limit/` (Cloudflare's `CF-Connecting-IP` header is trusted when present; `X-Forwarded-For` is never trusted).

### `GET /api/health.php`

Returns only a minimal response such as:

```json
{"status":"ok"}
```

It must not expose paths, environment values, provider IDs, email settings, or package versions.

## Airtable Content Strategy (planned, not yet implemented)

```text
Airtable
  → CLI sync through DirectAdmin cron and/or approved webhook
  → public-field allowlist and sanitization
  → atomic cache under storage/cache
  → /api/content.php
  → React
```

**Current state (2026-08-06): `content.php`/`events.php` query Airtable live on every request** — no `storage/cache/` layer, no `app/cli/sync-airtable.php`, no cron job exist yet. This works today (both endpoints are live-tested against the real base) but does not match the cached-and-synced design above; deferred in favor of getting the site deployed. Revisit before traffic volume makes live-per-visitor Airtable calls a real concern (Airtable's API rate limit is 5 req/s per base).

Airtable attachment URLs are temporary. Public attachment fields (Hero images, Event photos) currently link directly to Airtable's attachment URLs rather than synchronized, stable website-owned copies — same deferred status as the cache layer above.

## Airtable Data Contract

### `Hero Slides`

| Field | Type |
|---|---|
| `Eyebrow` | Single line text |
| `Title` | Single line text |
| `Subtitle` | Long text |
| `Image` | Attachment |
| `Order` | Number |
| `CTA Label` | Single line text |
| `CTA Href` | Single line text |

### `Site Images`

| Field | Type |
|---|---|
| `Slot` | Single line text |
| `Image` | Attachment |

### `Events`

Read by `server/public-api/events.php`; table name currently hardcoded, not read from `AIRTABLE_TABLE_EVENTS` (matches the original TanStack behavior it replaced — see `archive/legacy-tanstack-api-routes/events.ts` for that history).

| Field | Type |
|---|---|
| `Event name/title` | Single line text |
| `Event date(s)` | Single line text |
| `Event time` | Single line text |
| `Event location` | Single line text |
| `Event description` | Long text |
| `Event Photo` | Attachment |
| `Status` | Single select (filtered on `Status='Active'`) |

### `Event RSVPs`

Written by `server/public-api/rsvp.php`; table name currently hardcoded, no corresponding env var exists yet (matches the original TanStack behavior it replaced — see `archive/legacy-tanstack-api-routes/rsvp.ts` for that history). Live-write-tested 2026-08-06 with a disposable test event/RSVP pair, both deleted afterward.

| Field | Type |
|---|---|
| `Full Name` | Single line text |
| `Email Address` | Email |
| `Phone Number` | Phone number |
| `Event` | Link to `Events` record |

Discovered during the 2026-08-05 architecture audit. Preserve these tables and fields as-is.

### `Contact Form`

Written by `server/public-api/contact.php` via `ContactService`; confirmed against the live Airtable base 2026-08-06. Supersedes the original TS `inquire.ts` webhook-forward behavior entirely.

| Field | Type |
|---|---|
| `Submission ID` | Single line text (server-generated) |
| `Full Name` | Single line text |
| `Email` | Email |
| `Organization` | Single line text |
| `Message` | Long text |
| `Submitted At` | Single line text (ISO 8601, server-generated) |
| `Source` | Single line text (fixed value) |
| `Email Status` | Single select ("Sent" / "Failed") |

`AIRTABLE_TABLE_CONTACTS` defaults to `Contact Form` when unset. A separate `Contact Submissions` table (Follow-Up Status, Assigned To, Message Summary) exists as a CRM/triage view, apparently populated from `Contact Form` via a separate Airtable automation — the PHP backend does not write to it directly.

## Deployment Summary

Build the frontend:

```bash
npm ci
npm run build
```

Copy the contents of `dist/` directly into:

```text
/home/DA_USERNAME/domains/freeinspiration.org/public_html/
```

Correct:

```text
public_html/index.html
public_html/assets/
public_html/.htaccess
```

Incorrect:

```text
public_html/dist/index.html
```

Backend mapping:

```text
server/public-api/* → public_html/api/
server/app/*        → app/
server/cli/*        → app/cli/   # not yet built — see "Airtable Content Strategy" above
Composer vendor     → app/vendor/
```

Install backend dependencies on the server (do not commit or SFTP-upload a local `vendor/`):

```bash
cd app
composer install --no-dev --optimize-autoloader
```

`vendor/` must always be generated in place on the server, never transferred from local. This is not just about the (pure-PHP, no compiled extensions) packages themselves — Composer's generated autoloader bakes in fixed relative-path traversals computed from `vendor/composer/`'s own location back to each PSR-4 base directory at generation time. A `vendor/` folder built locally and copied over carries traversals computed for the local relative depth, which silently breaks if the deployed depth differs by even one directory level (this happened during the first real deployment — see Migration Log).

Never overwrite or delete `private/`, `private/.env`, or `storage/` during deployment. Detailed permissions and directory-creation commands are under "Production Directory Structure" above.

## Production Promotion Runbook (staging → production)

Written 2026-08-10; **exercised successfully on 2026-08-12** for the `freeinspiration.org` cutover. The steps below held up in practice, with three deviations worth knowing before the next run:

1. **Emptying `public_html` first makes Step 6 unnecessary.** Clearing the directory removes the temp site's `index.php` outright, so the DirectoryIndex collision cannot occur. It does mean the domain serves nothing until upload completes — so **upload `dist/` before the backend**. The SPA is fully static and ships fallback content, so it renders correctly with no `app/` or API present, turning a hard outage into a working page in minutes.
2. **The `.env` copies verbatim from staging** — production and staging share the same Airtable base and Brevo sender, so no value is environment-specific. Copy server-to-server so credentials never enter a clipboard.
3. **`composer install` is still required.** Copying `vendor/` server-to-server would technically work (both domains place it at identical relative depth, and Composer's autoloader computes paths from `__DIR__` at runtime), but installing in place removes any need to reason about depth — which is what broke the first deployment.

**Also purge the Cloudflare cache, and treat that as mandatory rather than optional.** During this cutover a single image kept serving its old version even after the file was deleted from `public_html` — Cloudflare was serving cached bytes at the edge without reaching the origin at all. It affected only that one file because its URL was unchanged; every other image had moved from `.png` to `.jpg` and so had a URL Cloudflare had never seen. Any deploy reusing a filename — `index.html` most of all — needs a purge, or visitors continue to receive the previous version.

**Every command in this runbook is run by a human operator with SSH/SFTP access to the VPS.** There is no automated deployment: no CI/CD, no Git hook, no auto-pull on the server. Merging `dev` → `main` is a repository operation only and moves nothing onto the VPS — file transfer is a separate, manual SFTP step. Any AI assistant working on this project has no server access and cannot execute, verify, or observe any of these steps; it can only supply the commands and interpret output that the operator pastes back.

### Pre-flight facts

- **`freeinspiration.org` is already live**, serving a temporary single-page `index.php` site with a working Airtable-backed contact form and a "new website coming soon" notice. Promotion **replaces a functioning public site** — this is not a deployment to empty space.
- **DNS and SSL are already working** for the apex domain (the temp site serves over HTTPS through Cloudflare), so no DNS cutover or certificate issuance is required.
- **Decisions locked in** (user, 2026-08-10): production uses the **same Airtable base** as staging, and the **same Brevo sender address** already verified and working on staging. So no new Airtable base, no new Brevo sender verification.

### Step 0 — Back up the live site first

```bash
DOMAINROOT="/home/DA_USERNAME/domains/freeinspiration.org"
tar -czf ~/freeinspiration-prod-backup-$(date +%Y%m%d-%H%M).tar.gz -C "$DOMAINROOT" public_html
```

This archive is the rollback path. Verify it is non-trivial in size before proceeding. Do not skip — the temp site is not in Git.

### Step 1 — Merge `dev` → `main` (authorization gate)

Production deploys from `main`. Merging requires explicit approval per "Git Safety" below; do not merge as a side effect of deployment work.

### Step 2 — Create the private directory structure

Run as the DirectAdmin domain user, not root (see "Creating the directory structure" above for the full command block and the reasoning). `public_html` already exists; `private/`, `app/`, and `storage/` do not.

### Step 3 — Create `private/.env`

Copy staging's working `private/.env` **verbatim — edit nothing**:

```bash
cp /home/DA_USERNAME/domains/dev.freeinspiration.org/private/.env \
   /home/DA_USERNAME/domains/freeinspiration.org/private/.env
chmod 600 /home/DA_USERNAME/domains/freeinspiration.org/private/.env
```

Production and staging share the same Airtable base and Brevo sender, so no value is environment-specific. Copying server-to-server also keeps credentials out of any clipboard.

*This step previously instructed setting `APP_ENV=production` and `APP_URL=https://freeinspiration.org`. Neither is read by any code — see "Environment Configuration" above. The instruction was followed during the 2026-08-12 cutover and the operator correctly caught that those variables were absent from the working staging file.*

Confirm the file is owned by the domain user, **not root**. A root-owned `.env` is unreadable by the PHP-FPM pool and produces a 500 with `{"success":false,"error":"Server configuration error."}` — this exact failure cost real debugging time on staging.

**Verify the file is complete on the server, not in the SFTP client's view of it.** Count the variables server-side:

```bash
grep -cE '^[A-Z_]+=' "$DOMAINROOT/private/.env"
```

Compare against the expected count for the variable contract above. A partial or truncated upload is a known hazard on this project (see CLAUDE.md's 2026-08-07 entry): because the endpoints need different subsets of the file, a truncated `.env` fails *asymmetrically* and is easy to misdiagnose. Airtable variables resolving while Brevo variables come back null breaks the contact form only, leaving `content.php`, `events.php`, and `rsvp.php` working normally — which looks like a contact-specific bug rather than a config-transfer problem. Distinguish from the other `.env` failure mode: `phpdotenv` rejects the whole file on a malformed line, taking down every endpoint at once. Partial outage → truncated file; total outage → malformed line.

### Step 4 — Upload the backend and install dependencies

```text
server/app/*        → app/
server/public-api/* → public_html/api/
```

Then, **as the domain user, from `app/`**:

```bash
cd app
composer install --no-dev --optimize-autoloader
```

Never SFTP a local `vendor/` — see the explanation under "Deployment Summary" above. Verify the autoloader resolved correctly before moving on:

```bash
grep -n "Logger" app/vendor/composer/autoload_static.php
```

Must show `/src/Logger.php`. If it shows `/app/src/Logger.php`, `composer.json` is at the wrong depth and every endpoint will fatal.

### Step 5 — Build and upload the frontend

```bash
npm ci
npm run build
```

Copy `dist/` **contents** into `public_html/` (not a nested `dist/` folder).

### Step 6 — Remove the temporary site's `index.php` ⚠️

```bash
rm "$DOMAINROOT/public_html/index.php"
```

**This step is mandatory and easy to forget.** Apache's `DirectoryIndex` lists `index.php` ahead of `index.html` on virtually every DirectAdmin install, so leaving the old file in place means the temp site keeps being served and the new SPA appears not to have deployed at all — a confusing symptom with a non-obvious cause. Also remove any other stray files from the temp site (its own assets, includes, or `.htaccess` if it differs from the SPA's).

### Step 7 — Verify, in this order

1. `https://freeinspiration.org/api/health.php` → `{"status":"ok"}` (no bootstrap dependency; isolates infrastructure from app config)
2. `https://freeinspiration.org/api/content.php` and `/api/events.php` → real Airtable data, `success:true`
3. Homepage loads the new SPA (not the temp page), styling intact
4. A direct nested route (e.g. `/privacy-policy`) loads rather than 404ing — confirms `.htaccess` SPA fallback
5. Submit a real contact form and a real RSVP through the browser; confirm the Airtable records and the Brevo email
6. Purge the Cloudflare cache if the old page persists

### Rollback

```bash
cd "$DOMAINROOT"
rm -rf public_html
tar -xzf ~/freeinspiration-prod-backup-TIMESTAMP.tar.gz
```

Restores the temp site exactly. `private/`, `app/`, and `storage/` can be left in place — they are not web-accessible and do not affect the temp site.

### Known open items before promotion

None blocking as of 2026-08-10. The previously-flagged webhook `.env` question was resolved — it was a file-transfer artifact, not a code dependency (see CLAUDE.md's Migration Log). Its lasting output is the `.env` completeness check added to Step 3 above.

Staging and production share the same Airtable base and Brevo sender, so staging's `.env` copies across **verbatim** — there is nothing environment-specific to change. Copy it server-to-server rather than retyping, so credentials never pass through a clipboard:

```bash
cp /home/DA_USERNAME/domains/dev.freeinspiration.org/private/.env \
   /home/DA_USERNAME/domains/freeinspiration.org/private/.env
chmod 600 /home/DA_USERNAME/domains/freeinspiration.org/private/.env
```

The complete consumed set is the 14 variables listed under "Environment Configuration" above. Anything beyond those is vestigial and only creates the impression of a dependency that does not exist.

## Git Safety

Required ignore rules:

```gitignore
node_modules/
dist/
.env
.env.*
private/
**/private/
storage/
**/storage/
server/vendor/
server/app/vendor/
*.log
```

Commit `package-lock.json`, `composer.lock`, source code, `public/.htaccess`, and deployment documentation. No env file — placeholder or otherwise — is ever committed. Never commit Airtable or Brevo credentials. Rotate any credential that previously entered Git history.

## Current Migration Status

- Development branch: `dev`
- Production branch: `main`
- Staging target: `dev.freeinspiration.org` on DirectAdmin — deployed and verified
- Production target: `freeinspiration.org` on DirectAdmin — **LIVE as of 2026-08-12**, fully verified including contact and RSVP write paths
- Frontend target: Static React/TypeScript/Vite SPA — **implemented and locally validated 2026-08-06** (`npm run build` produces `dist/index.html`, `dist/.htaccess`, hashed `dist/assets/*`; no server bundle; `npm run dev`/`preview` tested for homepage, direct nested-route hits, and unknown routes)
- Backend target: PHP-FPM — implemented and **fully live-verified 2026-08-07** on `dev.freeinspiration.org` (PHP 8.3.30) against the real Airtable base: `content.php`, `events.php`, `rsvp.php`, `contact.php`, and `health.php` all confirmed working end-to-end (the latter two via real browser submission, not just curl). `server/app/composer.json` requires `php >=8.1`, `ext-curl`, `ext-json`, `ext-mbstring`, `ext-openssl`, `ext-fileinfo`. Two real deployment bugs found and fixed during the first live deployment — see 2026-08-07 Migration Log entry.
- Data store: Airtable
- Outbound mail: Brevo SMTP on port 2525 — **live-verified 2026-08-07.** Real contact form submission through the browser produced a real Airtable record and a real Brevo-sent notification email, both confirmed accurate against the submitted data.
- Destination mailbox: `fireorg@gmail.com`
- Secrets path: `/home/DA_USERNAME/domains/freeinspiration.org/private/.env`
- Build target: `npm run build` → `dist/`

**Staging (`dev.freeinspiration.org`) is fully deployed and live-verified — deployment-blocking work is done.** **Deferred, non-blocking:** the Airtable content-cache/CLI-sync layer and attachment mirroring (see "Airtable Content Strategy" above); a known Team-carousel UI bug (see CLAUDE.md's Migration Log — needs a rewrite on `embla-carousel-react`, not another patch). **Not yet done:** promotion from staging to production (`freeinspiration.org`) — requires separate explicit authorization, not to be done as a side effect of staging work.

### Migration Log

**2026-08-12 — PRODUCTION LIVE.** `freeinspiration.org` cut over from the temporary `index.php` landing page to the migrated SPA + PHP backend. Verified from the public internet: `health.php` → `{"status":"ok"}`, `content.php` → 5 hero slides, `events.php` → 3 real events, `/privacy-policy` serving the SPA shell (confirming the `.htaccess` history fallback), and the contact and RSVP write paths confirmed through the live UI. `app/vendor/` sits outside `public_html` and is not reachable over HTTP. The runbook above has been updated with the three ways the real cutover deviated from it. The variable contract in "Environment Configuration" was also corrected: five variables it listed (`APP_ENV`, `APP_DEBUG`, `APP_URL`, `AIRTABLE_TABLE_EVENTS`, `AIRTABLE_TABLE_SITE_IMAGES`) are read by no code, and following this document's own instructions nearly added two of them to the production `.env` during the cutover.

**2026-08-05 — Phase 1 (documentation audit, no application code changed):** Standardized on `private/.env`; documented the `Events` and `Event RSVPs` Airtable tables discovered in code; flagged a hardcoded Airtable webhook URL and a historically-committed `.env` file for credential rotation (in progress); hardened root `.gitignore`. Frontend/backend implementation had not started.

**2026-08-06 — Frontend and backend both implemented; deployment prep underway.** Full PHP backend built (`server/`) and live-tested against the real Airtable base; frontend converted to a conventional static Vite SPA (TanStack Start/Nitro/Netlify/Bun fully removed, archived to `archive/legacy-tanstack-start-ssr/`); frontend switched to consume the PHP endpoints exclusively; old TanStack routes archived and removed. `health.php` added. This document reconciled with the actual implementation (was previously written pre-implementation and had drifted — missing `events.php`/`rsvp.php`, an `airtable-webhook.php` entry that was never built, and a content-cache description that doesn't match the current live-fetch behavior). See CLAUDE.md's Migration Log for the complete, detailed history — this file stays intentionally operational/summary-level.

**2026-08-07 — Root cause found and fixed for the empty-body 500s on `content.php`/`events.php` during the first real staging deployment.** `server/composer.json` (root-level) declared its PSR-4 autoload mapping as `"Fire\\": "app/src/"`, correct only for the local repo's directory depth (`server/composer.json` → `server/app/src/`). Production deploys `composer.json` to `app/composer.json` — one directory shallower relative to `src/` — so the *same* mapping string resolved to a nonexistent `app/app/src/`, and the `vendor/` folder (built locally, then SFTP-transferred) carried that wrong traversal baked into its generated classmap. The failure was an uncaught PHP fatal (`include(...app/app/src/Logger.php): Failed to open stream`) thrown from inside Composer's own `ClassLoader`, before any of the application's own error handling could run — hence the completely empty response body, and why `health.php` (which loads no Composer classes) was unaffected. PHP version (8.3.30, confirmed via DirectAdmin) and the `ext-curl` extension (confirmed enabled) were both ruled out first. Fix: relocated `composer.json`/`composer.lock` from `server/` to `server/app/` (now a direct sibling of `src/` in the repo, exactly mirroring `app/composer.json` + `app/src/` in production — same relative depth in both places), and corrected the mapping to `"Fire\\": "src/"`. `vendor/` must now always be generated in place via `composer install` run on the server itself, never SFTP-transferred (see "Repository Structure After Refactor" above for the technical reason).

**Remediated and live-verified same day.** After the fix was applied on the server, `content.php` still 500'd but with a real JSON body this time (`{"success":false,"error":"Server configuration error."}`) — a second, unrelated bug: `private/.env` had been created while in a root SSH shell earlier in the deployment process, leaving it unreadable by the `minda3sm` PHP-FPM user. Fixed with `chown`/`chmod` back to the ownership this document already specifies. `content.php` and `events.php` are now confirmed live against the real Airtable base (`success:true`, real records returned). `rsvp.php`/`contact.php` (real writes/sends) remain untested live pending explicit go-ahead. See CLAUDE.md's Migration Log for the full diagnosis.
