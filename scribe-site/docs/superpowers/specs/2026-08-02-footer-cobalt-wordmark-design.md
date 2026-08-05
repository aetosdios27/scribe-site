# Footer Cobalt Wordmark Design

## Goal

Replace the landing-page footer’s multi-column paper layout with a slim legal close and a giant TeX Gyre “scribe” wordmark on continuous cobalt, using a solid→dither field ramp (not a discrete stamp).

## Scope

In:

- Rewrite `components/landing/Footer.tsx`
- Add a footer dither field asset via the existing offline pipeline
- Add CSS for the tiled field + vertical density mask
- Keep `FinalCta` and Footer as one continuous cobalt plane (no separating border)

Out:

- Rebuilding footer link columns or sitemap IA
- Runtime canvas/WebGL dither
- Changing `FinalCta` copy or layout beyond seam continuity
- Deleting unused `FOOTER_COLUMNS` data unless nothing else imports it

## Composition

Top → bottom inside `<footer>`:

1. **Slim legal row** on solid cobalt  
   - Left: `© {year} scribe, inc.`  
   - Right: `privacy` · `terms` · `status` (placeholder `#` hrefs for now)  
   - Geist Mono, small, muted paper on cobalt
2. **Wordmark close**  
   - Live text lowercase `scribe`  
   - TeX Gyre Heros bold (`font-sans`, weight 700)  
   - Paper (`--scribe-paper`) on cobalt  
   - Edge-to-edge, oversized, baseline flush to the bottom of the page  
   - Slight negative tracking  
   - Decorative: `aria-hidden` on the visible wordmark; footer provides an accessible name

Removed from the current footer for this pass: logo image, tagline, five link columns, pixel tagline, and the old utility strip.

## Visual Treatment — Field Ramp

- Continuous solid cobalt from `FinalCta` into the footer (shared `--scribe-cobalt`).
- Behind the wordmark zone only: a tiled offline dither field that densifies downward.
- Mask: transparent at the top of the close → full density at the bottom, so legal sits on clean solid blue and the wordmark sits in the ramp.
- Solid paper type stays fully opaque; only the ground ramps into dither.
- No separate “stamp” band, card chrome, or paper strip between CTA and footer.

## Asset Pipeline

- Add `footer-field.png` to the dither script’s `FIELDS` list in `scripts/dither/index.ts`.
- Preset: `hover` (white-on-cobalt Bayer). Tune only `tile` / `lum` in the field entry if the ramp reads too sparse or busy; do not add a runtime renderer.
- Generate with `bun run dither` into `public/art/dither/footer-field.png`.
- Expose via a CSS class (e.g. `.dither-footer-field`) mirroring `.dither-card-field` / `.dither-pricing-field`, plus a linear mask for the ramp.
- Legal links may be a small `FOOTER_LEGAL` list in `content.ts` (or inline); stop importing `FOOTER_COLUMNS` / `FOOTER_UTILITY` from Footer.

## Component Notes

- Footer root: `bg-scribe-cobalt text-scribe-paper` (or equivalent tokens), no top border that would split the CTA plane.
- Legal row uses existing mono styles; links use a muted paper opacity with a clear hover state.
- Wordmark is text, not the PNG wordmark asset.
- Prefer shell/horizontal padding consistent with the landing shell for the legal row; the wordmark itself may break full-bleed to the viewport edges.

## Verification

- Desktop and mobile: legal readable; wordmark remains flush and does not clip awkwardly or overflow the viewport width unexpectedly.
- Visual: solid cobalt under legal → dither densifies under/around `scribe`; no hard stamp edge.
- Seamless with `FinalCta` (one blue plane).
- `prefers-reduced-motion`: no motion dependency (static field is fine).
- Dither dots stay crisp (background-image tile, not `next/image` re-encode).
