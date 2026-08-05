# Living Colophon Footer Design

## Goal

Replace the current utility-first footer with a full-viewport, interactive closing scene that makes Scribe feel like a living publishing instrument. The footer should be the final visual payoff of the landing page: immediate, brand-specific, and memorable without sacrificing navigation, accessibility, or performance.

## Creative Direction

The footer is a **living colophon**: the last page of a publication transformed into an active printing surface.

It uses Scribe's existing visual language rather than importing a generic agency aesthetic:

- cobalt as the dominant field;
- paper-white typography;
- TeX Gyre Heros for editorial scale;
- Geist Pixel Circle and Geist Mono for machine detail;
- existing Bayer/halftone texture as virtual ink;
- restrained engineering-grid details.

The memorable gesture is one giant `scribe` wordmark that continuously shifts between clean paper type and dithered ink under a slow horizontal press sweep. Pointer movement reveals additional texture locally, making the footer feel printed in real time.

## Scope

### In scope

- Replace the current `Footer` composition and footer-specific CSS.
- Add a small client-side interaction component for pointer position and presence.
- Reuse the existing static footer dither field or generate a replacement only if the existing asset cannot support the masks cleanly.
- Preserve the existing email, X, GitHub, privacy, terms, status, and current-year information.
- Add a compact press-status detail as atmospheric microcopy.
- Verify desktop, mobile, keyboard, and reduced-motion behavior.
- Launch a local development preview for review.

### Out of scope

- Changing the preceding `FinalCta` content or visual system beyond the seam needed for a deliberate transition.
- Adding a canvas, WebGL renderer, animation dependency, audio, custom cursor, or remote media.
- Replacing placeholder destinations with invented production URLs.
- Refactoring unrelated landing-page sections.

## Composition

The footer uses a minimum height of one viewport on desktop and a content-driven tall layout on small screens.

1. **Entry rule**
   - A fine paper-white rule and small registration marks announce the start of the colophon.
   - The transition from the paper `FinalCta` to cobalt is sharp and intentional, like turning to a saturated final page.

2. **Colophon rail**
   - Left: `the end / until you publish.` and `hello@scribe.dev`.
   - Right: X, GitHub, legal links, status, and current-year metadata.
   - Desktop uses an asymmetric editorial grid. Mobile becomes a clear stacked flow.

3. **Press field**
   - The center and lower footer hold an ambient engineering grid and tiled dither field.
   - The base remains clean cobalt. Texture appears through layered masks, not as a rectangular background panel.
   - Pointer input updates local CSS custom properties. A radial mask centered on those values exposes extra dither and a faint glow.

4. **Wordmark event**
   - Live lowercase text, not an image.
   - Scales to nearly the full viewport width and deliberately crops at the side or lower edge when needed.
   - A clean paper layer establishes legibility.
   - A dither-textured duplicate is clipped to the glyphs and revealed by a repeating press sweep.
   - Registration marks and a compact `press active` indicator reinforce the printing metaphor.

## Motion and Interaction

The animation system has one hierarchy:

1. A slow press sweep crosses the wordmark and adjacent field.
2. The dither layer follows the sweep, briefly replacing clean portions of the wordmark.
3. Pointer movement reveals a localized radial patch of field texture and subtly offsets one registration marker.
4. Links use quick, precise underline or arrow-shift responses.

Motion must feel mechanical and editorial, not liquid or ornamental. It should avoid constant high-frequency movement.

Pointer tracking is limited to the footer and scheduled through `requestAnimationFrame`. It writes only CSS custom properties on the footer root, avoiding React state updates during movement. When the pointer leaves, the local reveal fades to a neutral resting position.

Touch devices receive the ambient sweep and static composed field without requiring hover. The footer remains complete if JavaScript is unavailable.

## Component Architecture

### `Footer.tsx`

Owns semantic content and the structural composition. It keeps navigation as real links and supplies the current year. It delegates only pointer-enhancement behavior.

### `FooterPressField.tsx`

A focused client component that owns the interactive footer wrapper or enhancement layer. Its public responsibility is limited to mapping pointer coordinates to CSS custom properties and toggling pointer presence. It does not own footer copy or navigation data.

### `content.ts`

Continues to provide the legal links. Social links may remain local to `Footer.tsx` while their destinations are placeholders, avoiding an unnecessary data abstraction.

### `globals.css`

Owns the complete visual treatment: layout, grid, field masks, wordmark layers, press animation, hover states, breakpoints, and reduced-motion overrides. New custom properties remain footer-scoped.

## Accessibility

- The footer has an accessible label and semantic navigation groupings.
- The visible decorative duplicate wordmark is hidden from assistive technology; one accessible brand label remains.
- Text and interactive elements maintain strong paper-on-cobalt contrast.
- Focus styles are clearly visible on cobalt, with paper-colored outlines where the global cobalt outline would disappear.
- Pointer effects never gate content or actions.
- `prefers-reduced-motion: reduce` disables the press sweep and pointer-following transitions while retaining a polished static dither composition.
- Decorative registration marks and press indicators are hidden from assistive technology.

## Responsive Behavior

- At desktop widths, the footer fills at least the viewport and reserves the strongest scale for the wordmark.
- At tablet widths, rail content wraps without colliding with the press field.
- At mobile widths, content stacks above a large but bounded wordmark. Intentional cropping must never cause horizontal document overflow.
- Coarse pointers and touch layouts do not show hover-dependent affordances.
- CSS uses `clamp()` and container-safe widths to preserve the composition from narrow phones through large displays.

## Performance

- No runtime drawing surface or third-party motion package.
- Dither remains a small, repeatable static image.
- Pointer work is footer-local, `requestAnimationFrame`-throttled, and limited to CSS variable writes.
- Animated properties are masks, opacity, and transforms; layout-affecting properties do not animate.
- The client component is progressively enhancing: server-rendered content and artwork remain intact before hydration.

## Verification

### Automated

- Footer renders the accessible label, email, social links, legal links, status, year, and wordmark layers.
- Decorative artwork is excluded from the accessibility tree.
- Existing project lint and build commands pass.

### Browser

- Desktop screenshot at a representative 1440px viewport.
- Mobile screenshot at a representative 390px viewport.
- No horizontal overflow at either viewport.
- Pointer reveal tracks smoothly and stays contained within the footer.
- Keyboard focus is visible on every link.
- Reduced-motion emulation produces a stable, complete composition.
- The `FinalCta` → footer transition reads as deliberate.

## Success Criteria

- The footer creates an unmistakable final visual event rather than feeling like a link list.
- The printing interaction is immediately understandable as texture and motion, even without explanation.
- The result could only belong to Scribe: publishing, code, cobalt, and halftone are fused into one system.
- Content stays readable and operable across pointer, touch, keyboard, reduced-motion, and no-JavaScript conditions.
- The page remains performant and introduces no new production dependency.
