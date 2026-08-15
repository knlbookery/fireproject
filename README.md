# F.I.R.E. Platform

The F.I.R.E. Platform is the public digital presence for **Free Inspiration Reach Everyone (F.I.R.E.)**. The website is designed to communicate the organization's mission, programs, leadership, events, impact, and opportunities for participation through a fast, resilient, and maintainable web experience.

The platform combines a React-based user interface with Airtable-managed content so approved website updates can be made without rewriting core application code. The current migration replaces the former Netlify/TanStack server architecture with a static React/Vite frontend and a lightweight PHP backend hosted on F.I.R.E.'s existing Netcup VPS.

> `README.md` explains the project's purpose, history, scope, and expected outcome. Exact implementation, security, and deployment rules are defined in [`CLAUDE.md`](./CLAUDE.md).

---

## Project Purpose

The website serves as F.I.R.E.'s central public platform. Its purpose is to:

- Present the organization's mission and public identity clearly.
- Highlight programs, events, leadership, sponsors, and measurable impact.
- Make frequently updated content manageable through Airtable.
- Provide reliable contact, RSVP, registration, and approved donation pathways.
- Preserve a professional experience even when an external content service is temporarily unavailable.
- Give future developers a maintainable codebase with clear security and deployment boundaries.

## Expected Outcome

The completed platform should provide:

- A polished, responsive, and accessible public website.
- A static frontend that is fast and straightforward to deploy.
- Secure server-side handling of Airtable and email credentials.
- Dynamic content updates without exposing private tokens to browsers.
- Stable local fallbacks and cached content when Airtable is unavailable.
- A clear separation between public files, backend application code, credentials, and runtime storage.
- A deployment model fully controlled through F.I.R.E.'s existing DirectAdmin VPS.

---

## Key Features

### Dynamic Hero Content Engine

Retrieves approved hero slides and layout content from Airtable, including:

- Eyebrow text
- Headline/title
- Subtitle
- Image
- Display order
- CTA label
- CTA destination

Local fallback content must remain available when remote content cannot be retrieved.

### Airtable-Integrated Contact System

Captures user inquiries and stores approved submission data in Airtable. The PHP backend also sends a contact notification through Brevo SMTP to the Google-hosted destination mailbox.

### Events and RSVP Framework

Supports upcoming-event presentation and the existing approved RSVP or registration behavior backed by Airtable records. Future developers must preserve current mappings and may not invent new tables or workflows without approval.

### Resilient Asset Architecture (`siteImages`)

Merges Airtable-managed media with local asset mappings under `src/images/*`. Stable slot identifiers and local fallbacks prevent broken resource areas and preserve the layout when remote media is missing.

### Donation Integration

Donation-related interface components and Zeffy integration may exist as supporting systems. Payment processing must not be activated, replaced, or materially changed without explicit approval and a separate security review.

---

## Architecture Evolution

Understanding the progression matters because the repository may still contain code and configuration from earlier stages.

### 1. React/Vite Foundation

The project began as a React and Vite application focused on a modern, high-performance frontend with local fallback content and Airtable-backed dynamic sections.

### 2. TanStack Start and Netlify

The application evolved into a TanStack Start implementation using SSR, hydration, React Query, server functions, and Netlify deployment. Airtable operations were intended to run through server-only functions while Netlify supplied the hosting and runtime layer.

### 3. Netlify Security and Deployment Constraints

The team encountered recurring deployment issues, framework-generated Netlify runtime behavior, contributor/build-hook limitations, and plan restrictions around environment-variable scope isolation. The project could have remained on Netlify, but doing so would either broaden secret access during builds, require an upgrade, or add a separate VPS API layer.

### 4. Hybrid Architecture Evaluation

A hybrid option was considered in which Netlify would continue serving the static frontend while the Netcup VPS handled PHP APIs and secrets. Because the PHP backend and VPS administration were required either way, retaining Netlify would have added another production layer without removing the primary backend work.

### 5. Current Direction: Full VPS Deployment

The approved target is now:

```text
Cloudflare
  → freeinspiration.org
  → Netcup VPS / AlmaLinux 9 / DirectAdmin
      ├── Static React/TypeScript/Vite frontend
      └── PHP-FPM backend
           ├── Airtable Web API
           └── Brevo SMTP
```

Netlify and TanStack Start remain relevant as migration history and may still be present in the current code, but they are not part of the completed production architecture.

---

## Current Technology and Supporting Systems

| System | Current responsibility |
|---|---|
| React + TypeScript + Vite | Public frontend and static production build |
| PHP-FPM | Server-side API and integration layer |
| Airtable | Dynamic public content and contact-form records |
| Brevo SMTP | Authenticated outbound contact notifications |
| Google-hosted email | Destination mailbox for received notifications |
| Cloudflare | DNS, browser-facing SSL, proxying, and edge protection |
| Netcup VPS | Production infrastructure |
| DirectAdmin | Domain, web, PHP, SSL, and hosting management |
| Zeffy | Approved ancillary donation functionality |

No local application database or database schema is required for the current scope.

---

## Current Data and Interaction Flows

### Public Content

```text
Airtable
  → protected PHP synchronization
  → approved-field validation and sanitization
  → local cache and stable media copies where required
  → /api/content.php
  → React interface
```

The public site should not query Airtable separately for every visitor. The last valid cache and local fallback content should remain available during temporary Airtable failures.

### Contact Form

```text
React contact form
  → POST /api/contact.php
      ├── validate and rate-limit the request
      ├── store approved message data in Airtable
      └── send the notification through Brevo SMTP
            → Google-hosted destination mailbox
```

Private Airtable and Brevo credentials are loaded by PHP only. The browser must never receive them.

### Media and Airtable Attachments

Airtable attachment URLs are temporary. When attachment fields supply public website media, the synchronization process should create stable website-controlled copies instead of permanently exposing Airtable's temporary download URLs.

---

## Production Layout Overview

The exact deployment contract is defined in `CLAUDE.md`, but the intended separation is:

```text
/home/DA_USERNAME/domains/freeinspiration.org/
├── private/      # production .env and private credentials
├── app/          # private PHP application code and Composer dependencies
├── storage/      # cache, logs, locks, rate limits, synchronized media
└── public_html/  # static frontend and thin public PHP endpoints
```

The Vite production build generates `dist/`. The **contents** of `dist/` are deployed directly into `public_html/`; `dist/` itself is not nested inside the document root.

---

## Environment and Security Overview

Production credentials are stored outside the public document root at:

```text
/home/DA_USERNAME/domains/freeinspiration.org/private/.env
```

No env file — placeholder or otherwise — is committed to the repository. The full variable contract is documented as prose in `CLAUDE.md`.

Server-side configuration includes the Airtable PAT and table identifiers, Brevo SMTP credentials, fixed sender and recipient settings, and contact rate-limit settings. No real credential may use the `VITE_` prefix or be bundled into browser JavaScript.

The authoritative variable names, permissions, PHP loading rules, and prohibited patterns are maintained in `CLAUDE.md`.

---

## Installation and Local Development

### Prerequisites

- Node.js compatible with the repository's approved Vite version
- npm
- PHP supported by the DirectAdmin production environment
- Composer
- Required PHP extensions documented during the backend audit

### Frontend

```bash
npm ci
npm run dev
```

Create a production build with:

```bash
npm run build
```

Validate the generated build locally with:

```bash
npm run preview
```

A successful production build should generate:

```text
dist/index.html
dist/.htaccess
dist/assets/
```

### PHP Backend

Install PHP dependencies from the backend Composer project using:

```bash
composer install
```

Real local backend credentials must remain outside the repository. Local PHP development may point to an external environment file through the backend-only `FIRE_ENV_FILE` override described in `CLAUDE.md`.

---

## Airtable Schema Maps

These tables describe the known public-content contract. Before renaming fields or changing parsing behavior, review all reads, writes, types, fallbacks, and UI consumers.

### `Hero Slides`

| Field Name | Type | Description |
|---|---|---|
| **Eyebrow** | Single line text | Section tag descriptor, such as “Education” or “Sports” |
| **Title** | Single line text | Main slide headline |
| **Subtitle** | Long text | Supporting copy |
| **Image** | Attachment | Hero media; local fallback used when unavailable |
| **Order** | Number | Ascending display order |
| **CTA Label** | Single line text | Action button text |
| **CTA Href** | Single line text | Action destination |

### `Site Images`

| Field Name | Type | Description |
|---|---|---|
| **Slot** | Single line text | Stable layout key, such as `volunteers` or `progSports` |
| **Image** | Attachment | Remote replacement for a local fallback asset |

The existing contact, events, and RSVP mappings must be discovered from the current code or approved documentation. Do not invent missing field names.

---

## Repository and Branch Model

| Branch | Purpose | Target |
|---|---|---|
| `dev` | Active development, migration, QA, and staging | Local development and `dev.freeinspiration.org` on DirectAdmin when configured |
| `main` | Approved production code | `freeinspiration.org` on DirectAdmin |

Development work begins and returns to `dev`. Production code reaches `main` through an approved merge or pull request.

---

## Current Migration Scope

The current refactor is expected to:

1. Audit the existing TanStack Start, SSR, Netlify, Airtable, form, email, and asset behavior.
2. Preserve approved public features and fallbacks.
3. Convert the frontend into a conventional static React/Vite SPA.
4. Move Airtable and Brevo operations into same-origin PHP endpoints.
5. Load private values from `private/.env` outside `public_html`.
6. Replace Netlify and SSR runtime dependencies only after their behavior has been accounted for.
7. Generate a deployable `dist/` build and DirectAdmin deployment documentation.
8. Verify that no private credential appears in source, Git-tracked files, generated frontend assets, public responses, or logs.

---

## Documentation Responsibilities

- **`README.md`**: Project purpose, history, feature scope, architecture evolution, supporting systems, expected outcome, and high-level developer orientation.
- **`CLAUDE.md`**: Authoritative implementation instructions, security rules, environment contract, directory mappings, prohibited patterns, validation requirements, and definition of done.
- **`deployment/DEPLOYMENT.md`**: Operational server setup, file permissions, build deployment, cron jobs, testing, rollback, and credential rotation.

When documents conflict, follow the instruction priority defined in `CLAUDE.md` and report the inconsistency instead of guessing.
