# lovableRule.md — Rules for Future Development

> **Scope:** These rules describe the *current, deployed* state of the F.I.R.E. platform and the constraints any future change (by Lovable, Claude Code, or a human) must respect so the system keeps running on the production VPS.
>
> **Authority:** `CLAUDE.md` (engineering rules) > this file > `DEPLOYMENT.md` (runbook) > `README.md` (narrative). This file must never contradict `CLAUDE.md`; if it does, `CLAUDE.md` wins and this file must be corrected.

---

## 1. Current Deployed State (the state to preserve)

| Layer | What is actually running |
|---|---|
| Frontend | Static React 19 + TypeScript SPA built by Vite (`vite build` → `dist/`) |
| Routing | TanStack Router (client-side only, file-based routes in `src/routes/`) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, tokens in `src/styles.css` |
| Data layer | TanStack Query, fetching same-origin `/api/*.php` |
| Backend | Plain PHP 8.1+ endpoints, Composer autoloaded (`Fire\` PSR-4) |
| Content/data store | Airtable Web API (PAT-authenticated, server-side only) |
| Mail | Brevo SMTP via PHPMailer; Google-hosted mailbox receives only |
| Hosting | One Netcup VPS — AlmaLinux 9 + DirectAdmin + Apache |
| DNS/TLS | Cloudflare |

**There is no Node.js process in production.** No SSR, no Nitro, no Netlify, no PM2, no Docker, no database.

## 2. Hard Prohibitions

1. Do **not** reintroduce TanStack Start, SSR, server functions, Nitro, Netlify adapters/Functions, or any framework that needs a running Node server. `dist/` must be servable by plain Apache.
2. Do **not** add a database, ORM, or Supabase/Lovable Cloud backend. Airtable is the store; PHP is the only server code.
3. Do **not** call Airtable, Brevo, or any credentialed service from browser code. All private integrations go through same-origin `/api/*.php`.
4. Do **not** put a secret behind a `VITE_` prefix. Anything `VITE_`-prefixed is public and ships in the bundle.
5. Do **not** commit `.env*`, `private/`, `storage/`, `vendor/`, `node_modules/`, or `dist/`.
6. Do **not** commit or upload a locally built Composer `vendor/`. It must be generated on the server with `composer install --no-dev --optimize-autoloader`; the autoloader bakes in relative paths.
7. Do **not** use PHP `mail()`. Brevo SMTP through PHPMailer only.
8. Do **not** touch payment processing without explicit approval. Donations are an embedded Zeffy iframe — no card data ever touches this codebase.
9. Do **not** invent Airtable fields, tables, routes, or env variables. The contract is fixed (sections 5 and 6).
10. Do **not** claim a build, test, or deployment succeeded unless it was actually run and its output read.

## 3. Frontend Rules

- Entry: root `index.html` → `src/main.tsx` → `src/router.tsx`. Keep it that way.
- Routes live in `src/routes/`; `src/routeTree.gen.ts` is **generated** — never hand-edit it.
- All API calls use **relative** paths ending in `.php` (`/api/content.php`, `/api/events.php`, `/api/rsvp.php`, `/api/contact.php`). Never absolute URLs, never a separate API host, never CORS.
- Every remote fetch must degrade gracefully: on non-OK or thrown error, fall back to static content (see `src/lib/content.ts` / `FALLBACK_CONTENT`). The page must never render blank because Airtable is down.
- SEO/meta tags live statically in `index.html` (there is no SSR to render dynamic head tags for crawlers). Per-route overrides may use TanStack Router's `head()`, but the crawlable defaults must stay in `index.html`.
- Colors, radii, and typography come from the design tokens in `src/styles.css`. No hardcoded `bg-[#...]`, `text-white`, etc. in components.
- Keep the established design language: editorial, Fraunces display + Inter body, generous whitespace, `rounded-full` CTAs, ~140px section rhythm.
- Preserve accessibility work already in place: skip link, `<main id="main-content">`, carousel `aria-*` + keyboard nav + reduced-motion handling, visible `focus-visible` rings.
- Required commands (npm, with `package-lock.json` — npm is the approved package manager):
  ```bash
  npm ci && npm run dev      # dev
  npm run build              # must emit dist/index.html, dist/.htaccess, dist/assets/
  npm run lint               # must pass with 0 errors
  ```
- `public/.htaccess` is copied verbatim into `dist/`. It owns SPA fallback, `api/` passthrough, cache headers, and security headers. Changing it changes production Apache behavior — review carefully.

## 4. Backend Rules

Directory contract (repo → production):

```text
server/public-api/*  →  public_html/api/     # thin entry points only
server/app/*         →  app/                 # outside the document root
server/app/vendor/   →  app/vendor/          # generated on the server
                        private/.env         # never in the repo
                        storage/             # cache, logs, locks, rate-limit
```

- `public_html` holds public files only. Business logic, credentials, Composer deps, logs, and rate-limit state must live outside it.
- Every public endpoint starts with `require_once __DIR__ . '/bootstrap-loader.php';` and nothing else path-related. The loader resolves `app/bootstrap.php` in both the repo layout and the deployed layout — do not hardcode a DirectAdmin username or a new relative path.
- New shared logic goes in `server/app/src/` under the `Fire\` namespace, autoloaded by Composer. Never `require` a loose file by relative path.
- Use the existing helpers rather than reimplementing them:
  - `Fire\Config` — env access (`get()` with default, `require()` returns null when missing)
  - `Fire\HttpResponse` — method guard, JSON success/fail envelopes
  - `Fire\Logger` — structured logging, never logs credentials or PII beyond an id
  - `Fire\Security` — `headerSafe()`, `trimmedString()`, `clientIp()` (CF-Connecting-IP only, never X-Forwarded-For)
  - `Fire\RateLimiter` — file-based per-IP fixed window, fails open on storage errors
  - `Fire\AirtableClient` — all Airtable traffic
- `health.php` is deliberately dependency-free: it must not load bootstrap, `.env`, Airtable, or Brevo, and must never leak paths, versions, or config.
- Validate every input server-side. Client-side zod validation is UX only and is bypassable. Contact enforces honeypot, minimum fill time, rate limit, and field validation on the server.
- Error responses are generic (`{"success": false, "error": "..."}`). Never surface provider status text, stack traces, file paths, or which of Airtable/Brevo failed.
- Write path semantics for contact: Airtable write and Brevo send run independently; the visitor sees success only when both succeed, and partial results are logged.

## 5. API Surface (fixed)

```text
GET  /api/content.php   → { success, heroSlides[] }
GET  /api/events.php    → active events, sorted by date
POST /api/rsvp.php      → creates linked Event RSVP record
POST /api/contact.php   → Airtable record + Brevo notification
GET  /api/health.php    → { "status": "ok" }
POST /api/assistant.php → { success, reply, offline }   # visitor AI assistant
```

Adding an endpoint means: new file in `server/public-api/`, logic in `server/app/src/`, documented here and in `DEPLOYMENT.md`, and added to the deployment mapping. Removing or renaming one is a breaking change to the deployed frontend.

## 6. Environment Contract

Exactly these 14 variables are read by the backend. Adding others has no effect; documenting phantom variables has already cost production time.

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

MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=
MAIL_TO_ADDRESS=

CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_SECONDS=900

LOVABLE_API_KEY=
```

`LOVABLE_API_KEY` powers `/api/assistant.php` (site-wide visitor assistant). It is
server-side only — never `VITE_`-prefixed. If it is absent, the endpoint still
answers from the curated keyword knowledge base in `Fire\AssistantService`.

Verify before changing this list:

```bash
grep -rhoE "Config::(get|require)\('[A-Z_]+'" server/ | grep -oE "'[A-Z_]+'" | tr -d "'" | sort -u
```

- Production file: `<domain root>/private/.env` (`private/` = `700`, `.env` = `600`). Never `chmod 777`.
- Local development: real credentials in gitignored `.private/.env`, pointed at with the backend-only `FIRE_ENV_FILE` variable before running any PHP command.
- The Events table name is hardcoded as `Events` in `events.php`; there is no site-images table variable.

## 7. Local Development Loop

```bash
npm run dev                                   # Vite on 5173 (strictPort)
php -S localhost:8080 -t server/public-api    # PHP endpoints
```

Vite proxies `^/api/.*\.php$` → `http://localhost:8080` (with the `/api` prefix rewritten off) so relative production URLs work unchanged in dev. Keep that proxy rule intact; it is dev-only and has no build/deploy effect.

## 8. Deployment Rules

1. Work on `dev`; production changes reach `main` by approved merge/PR. `dev` → `dev.freeinspiration.org`, `main` → `freeinspiration.org`.
2. `npm ci && npm run build`, then copy the **contents** of `dist/` into `public_html/` (never `public_html/dist/`).
3. Sync `server/public-api/*` → `public_html/api/`, `server/app/*` → `app/`.
4. Run `composer install --no-dev --optimize-autoloader` **on the server**, inside `app/`.
5. Never overwrite or delete `private/`, `private/.env`, or `storage/` during a deploy.
6. Verify in this order after deploy: `/api/health.php` → `/api/content.php` → homepage loads with live hero → a direct deep-link URL refresh (SPA fallback) → a real contact submission (Airtable record + inbox email) → an RSVP.
7. Purge the Cloudflare cache after a frontend deploy if `index.html` looks stale.

## 9. Definition of Done for Any Change

- [ ] `npm run build` succeeds and `dist/` contains `index.html`, `.htaccess`, `assets/`
- [ ] Typecheck and `npm run lint` pass with zero errors
- [ ] No new runtime Node dependency in production; no SSR reintroduced
- [ ] No secret in client code, no new `VITE_` private value
- [ ] Any new PHP logic lives in `server/app/src/`, entry point stays thin
- [ ] Any new env variable is actually read by code and added to section 6 **and** `DEPLOYMENT.md`
- [ ] Frontend still degrades to static fallback when the API is unavailable
- [ ] Deployment mapping in section 8 still covers every new/moved file
- [ ] Nothing under `archive/` was reactivated or treated as current source

## 10. Ambiguity Rule

Stop and report — do not guess — when a change could affect security, credentials, data integrity, billing/payments, deployment layout, or production availability.
