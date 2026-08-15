# Archived: TanStack Start SSR / Netlify / Bun infrastructure

Archived 2026-08-06 as part of converting the frontend to a conventional static Vite SPA (CLAUDE.md target architecture — no SSR, no Netlify, no permanent Node process). `package.json.orig` and `vite.config.ts.orig` are full snapshots of those files as they stood immediately before this conversion, in case anything here needs to be referenced or restored.

| Archived file | Why removed |
|---|---|
| `server.ts` | TanStack Start's Nitro/Cloudflare server entry point — no server runtime in the target architecture. |
| `start.ts` | TanStack Start's `createStart`/middleware setup — SSR-only. |
| `lib/error-capture.ts` | Existed solely to let `server.ts` recover stack traces h3 had swallowed into a generic 500 — no h3/server runtime left to swallow anything. |
| `lib/error-page.ts` | Raw-HTML-string error page renderer, used only by `server.ts`/`start.ts` as a `Response` body — the client-side `ErrorComponent` in `__root.tsx` already has its own inline JSX error UI and never called this. |
| `lib/airtable.server.ts` | A second, entirely unused `getLandingContent` (duplicate of the one that used to live in `content.functions.ts`) — never imported anywhere, dead code even before this pass. |
| `sitemap[.]xml.ts` | A dynamic TanStack Start server route generating sitemap XML at request time. Replaced with a static `public/sitemap.xml` — the site only has 2 URLs in it, so no server logic is needed. |
| `netlify.toml` | Netlify build/redirect config — Netlify is no longer part of the deployment target (DirectAdmin/Apache instead). |
| `bunfig.toml`, `bun.lock` | Bun was the package manager Netlify's build used (`bun run build`). Standardized on npm/`package-lock.json` per CLAUDE.md section 8. |
| `package.json.orig` | Full pre-conversion snapshot for reference/diff. |
| `vite.config.ts.orig` | Full pre-conversion snapshot — used `@lovable.dev/vite-tanstack-config`, which bundled the TanStack Start plugin, Nitro (Cloudflare preset), and several Lovable-preview-only plugins. |

Also removed from `content.functions.ts` in this same pass: the `createServerFn`-based `getLandingContent` export and its `@tanstack/react-start` import — it had already become dead code once `src/lib/content.ts` was switched to fetch `/api/content.php` directly (see the bridge-phase migration log entry in `.docs/CLAUDE.md`), and `@tanstack/react-start` is no longer a dependency at all after this conversion, so the import would not resolve.

These are kept for reference only — not imported or built by anything. See `.docs/CLAUDE.md`'s Migration Log for the full audit trail.
