# Plan: Complete Fire_WS_Revision Document Requirements

Implement the four remaining Lovable-stage items from the revision document. All work is in `src/routes/index.tsx` (plus one small asset).

## 1. Header / Logo behavior

**Center → left animation on scroll**
- On hero (scroll = 0): logo positioned **centered** in the header, nav links hidden or faded.
- As user scrolls (0 → 80px): logo smoothly translates to the **left** slot, nav links fade in on the right.
- Use a single scroll-progress value (already wired) to interpolate `translateX` via inline `transform` style for a smooth animation.
- Keep the existing transparent → blurred white background transition.

**Mobile-optimized logo**
- On screens `< md` (768px), swap the full wordmark logo for a compact **flame-icon-only** version (crop of the existing logo or the standalone mark).
- Implementation: render two `<img>` tags, toggle with `hidden md:block` / `block md:hidden`. If a separate icon asset isn't available, use the existing logo with `max-h` reduced and `object-cover object-left` to show just the mark portion — note this in the plan as a fallback until a dedicated icon is uploaded.

## 2. Contact form — anti-spam

- **Honeypot field**: add a hidden `<input name="website">` wrapped in a `sr-only` + `aria-hidden` container positioned off-screen. On submit, if it has any value, silently abort (pretend success to fool bots).
- **Minimum message length**: extend the existing zod schema — `message: z.string().trim().min(20, "Please provide at least 20 characters")`.
- **Submit-time delay check** (optional bot signal): record `mountTime` on component mount; reject submissions that arrive in under 2 seconds.

## 3. Contact form — success/error modals

Replace the current inline success message with a proper **modal dialog**.
- Use the existing shadcn `Dialog` component (`@/components/ui/dialog`).
- Two states driven by a single `modalState: 'success' | 'error' | null` value:
  - **Success modal**: green check icon, "Message sent" headline, short confirmation body, "Close" button.
  - **Error modal**: red alert icon, "Something went wrong" headline, error detail, "Try again" button that closes the modal and re-focuses the form.
- Trigger error modal on validation throw or any submission exception.
- Keep inline field-level validation errors as they are (zod inline errors stay).

## 4. Out of scope (deferred — needs credentials or stack change)

- Donation backend wiring → needs payment provider decision (Stripe/Paddle).
- Airtable sync + email notifications → needs Airtable API key + email provider.
- Astro/VPS migration → different framework; not applicable in Lovable.

## Technical details

- Files touched: `src/routes/index.tsx` only.
- Dependencies: none new. `zod`, `Dialog`, and the logo asset already exist.
- Existing scroll-progress state in `Header` is reused for the logo position transform — no new listeners.
- Honeypot field uses `position: absolute; left: -9999px` plus `tabIndex={-1}` and `autoComplete="off"` so real users never see or tab into it.
- Modal is unmounted when `modalState === null` to keep DOM clean.

## Verification

- Reload, watch the logo animate from center to left as you scroll past the hero.
- Resize to mobile width: confirm compact logo appears.
- Submit contact form with <20 char message → inline error.
- Submit valid form → success modal appears; close it; form resets.
- Fill honeypot via devtools → submission silently "succeeds" without hitting the handler logic.
