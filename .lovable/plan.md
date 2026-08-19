# F.I.R.E. Site Redesign — Editorial Magazine System

A full visual rebuild across the homepage and every inner page, moving away from the
current "one landing-page layout repeated everywhere" feel. Reference language:
Givara Foundation (floating pill nav, full-bleed portrait hero), Harbour, Careon,
Vive Church, Blocksy Landscape.

## Locked design decisions

- Palette: Editorial Ink & Sky — ink `#0d1117`, paper `#f4f6f8`, accent blue `#2f6fed`, soft blue `#cfe0ff`, white.
- Typography: Outfit (headings) + Figtree (body). Headlines are large, light-weight, tight tracking — not bold.
- Structure: editorial magazine — a featured lead block per page, then asymmetric grids, pull quotes, and full-bleed photo bands.

## Navigation

Replace the current single white pill bar with the reference pattern:

```text
[ logo ]        [  About   Events   Programs   Press  ]        [ Donate Now ]
                     white floating pill, centered              outlined pill
```

- Transparent over the hero photo; logo and Donate outline render white on dark imagery.
- On scroll past the hero it condenses: solid paper background, ink text, subtle border, no shadow bloom.
- Dropdowns become a lightweight panel (no heavy card shadow).
- Mobile: logo left, hamburger right, full-height overlay sheet with large type and Donate pinned at the bottom.

## Homepage

1. Full-bleed portrait hero — single photograph, dark gradient scrim on the left, small
   eyebrow pill ("Community in action" with a dot), three-line light headline, one-sentence
   sub-line, two CTAs. Static image with slow ken-burns rather than the current 5-slide carousel.
2. Impact strip — four numbers on the paper background, hairline dividers, no cards.
3. Mission lead — magazine two-column: oversized statement left, body + link right.
4. Programs — editorial grid: one large featured programme tile with a full-bleed image and
   three smaller ones; funding progress kept.
5. Where we work — Ghana / U.S. split band, image on one side, ink block on the other.
6. Stories — pull-quote band over a photograph.
7. Events — three upcoming, list-style rows with date on the left, not cards.
8. Partners — quiet logo row on paper.
9. Donate / Volunteer closing band — full-bleed ink block.

## Inner pages — distinct layouts

Each page gets its own skeleton so nothing reads like a repeat of the homepage.

- About / Mission / Impact: editorial article layout — big lead statement, narrow measure body, inset full-bleed images, sidebar facts.
- Programs: index grid with a sticky category rail; detail donate dialog unchanged.
- Ghana / U.S. initiatives: place-led layout — map-ish hero band, numbered project list, photo essay strip.
- Events: date-first list with the existing search/filter, plus a featured next event lead block.
- Press index/detail: magazine index (featured story + compact list), article page with narrow measure and related articles.
- Leadership index/detail: portrait grid on paper; detail page as an interview layout with a large pull quote.
- Partners / Sponsors: tiered editorial sections with logo blocks and a "become a partner" ink band.
- Contact / Volunteer / Donate: split layout — ink panel with details on one side, form or Zeffy embed on the other.
- Legal pages: simple narrow measure with a table of contents.

## Imagery

Swap the current mixed stock set for a coherent set: single-subject portraits, warm skin
tones against cool blue-grey environments, consistent grade. New hero and section images
generated to match the palette; existing programme photos re-cropped to consistent ratios
(3:4 portrait for people, 16:9 for place). Existing files stay in `public/images` where the
grade already fits.

## Technical notes

- Update `src/styles.css` tokens (background/foreground/primary/accent, new soft-blue token) and switch `--font-display` to Outfit, `--font-sans` to Figtree; load both from Google Fonts in `index.html`. Remove the Montserrat `!important` overrides at the bottom of the file.
- Rewrite `src/components/site/Header.tsx` for the centered-pill + scroll-condense behaviour; keep the existing `NAV` data and a11y attributes.
- Add reusable layout primitives in `src/components/site/ui.tsx`: `LeadBlock`, `FullBleedBand`, `PullQuote`, `EditorialGrid`, `ListRow` — pages compose these instead of repeating section markup.
- `SiteLayout` keeps the assistant, narrator, scroll progress, and skip link; header becomes overlay-capable via a `variant` prop (transparent over hero vs. solid).
- Motion stays on the existing `motion.tsx` primitives; reduce animation intensity to match the editorial register.
- No backend, Airtable, PHP, donation, assistant, or narrator logic changes — presentation only.

## Sequence

1. Tokens, fonts, layout primitives.
2. Header + footer.
3. Homepage.
4. Inner pages in batches (about cluster → programs/initiatives → events/press → people/partners → forms/legal).
5. Imagery pass and responsive/a11y check at 390px, 768px, 1440px.
