# Archived: legacy TanStack Start API routes

Archived 2026-08-06. These four files were removed from `src/routes/api/` after their PHP replacements under `server/public-api/` were built, live-tested against the production Airtable base, and confirmed working, and after the frontend's fetch targets were switched over to the `.php` endpoints (`src/lib/content.ts`, `src/routes/index.tsx`).

| Archived file | Replaced by | Notes |
|---|---|---|
| `content.ts` | `server/public-api/content.php` | Was never actually called by the frontend (`src/lib/content.ts` used a TanStack server function instead) — dead code even before this migration. |
| `events.ts` | `server/public-api/events.php` | Response shape verified identical; frontend fetch switched from `/api/events` to `/api/events.php`. |
| `rsvp.ts` | `server/public-api/rsvp.php` | Response shape verified identical; live-tested with a disposable test event/RSVP record, both deleted after. Frontend fetch switched from `/api/rsvp` to `/api/rsvp.php`. |
| `inquire.ts` | `server/public-api/contact.php` | Superseded, not just ported — the PHP version writes to Airtable directly (PAT-authenticated) and sends via Brevo SMTP, rather than forwarding to an Airtable incoming-automation webhook. Frontend fetch switched from `/api/inquire` to `/api/contact.php`. |

**Known pre-existing issue in the archived `inquire.ts`:** it contains a hardcoded Airtable incoming-webhook URL directly in source — flagged during the original migration audit (2026-08-05) for credential rotation. This is historical content preserved as-is for reference; it does not reflect current practice (`contact.php` loads all credentials from `private/.env`).

These are kept for reference only — not imported or built by anything. See `.docs/CLAUDE.md`'s Migration Log for the full audit trail.
