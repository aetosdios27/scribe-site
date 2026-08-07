# Footer Cobalt Wordmark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the paper multi-column footer with a slim cobalt legal row and a flush TeX Gyre “scribe” wordmark over a solid→dither field ramp.

**Architecture:** Keep `Footer` as the landing page’s closing component. Slim legal copy lives in `content.ts`. The wordmark zone stacks a masked offline dither tile (CSS only) under solid paper type. `FinalCta` and `Footer` share solid `--scribe-cobalt` with no border between them so they read as one plane.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, existing Bun dither pipeline (`sharp`), Bun test runner (`bun:test` + `renderToStaticMarkup`).

## Global Constraints

- Slim legal only: `© {year} scribe, inc.` plus `privacy` · `terms` · `status`.
- Giant live-text `scribe` in TeX Gyre Heros bold (`font-sans`, weight 700), paper on cobalt, baseline flush to the bottom.
- Field ramp: offline tiled dither densifies downward behind the wordmark; type stays solid. Not a discrete stamp band.
- Continuous cobalt with `FinalCta` — no separating border or paper strip.
- No runtime canvas/WebGL dither.
- Do not rebuild footer sitemap columns in this pass.
- Dither asset via existing pipeline into `public/art/dither/footer-field.png`; crisp tiles, not `next/image`.

## File Map

| File | Responsibility |
|------|----------------|
| `scripts/dither/index.ts` | Register `footer-field.png` in `FIELDS` |
| `public/art/dither/footer-field.png` | Generated white-on-cobalt Bayer tile |
| `app/globals.css` | `.dither-footer-field` tile + vertical mask; optional wordmark utility |
| `components/landing/content.ts` | Add `FOOTER_LEGAL`; remove unused `FOOTER_COLUMNS` / `FOOTER_UTILITY` |
| `components/landing/Footer.tsx` | Slim legal + wordmark close |
| `components/landing/Footer.test.tsx` | Markup contract for legal + wordmark + dither class |

---

### Task 1: Generate the footer dither field

**Files:**
- Modify: `scripts/dither/index.ts` (`FIELDS` array)
- Create: `public/art/dither/footer-field.png`

**Interfaces:**
- Consumes: `scribeDitherPresets.hover` (`white-on-cobalt`, `bayer4`, `pixelScale: 2`)
- Produces: `/art/dither/footer-field.png` (tileable PNG)

- [ ] **Step 1: Register the field job**

In `scripts/dither/index.ts`, extend `FIELDS`:

```ts
const FIELDS = [
  { file: "card-field.png", tile: 96, lum: 0.78, presetName: "hover" as const },
  { file: "pricing-field.png", tile: 128, lum: 0.66, presetName: "hoverPro" as const },
  { file: "footer-field.png", tile: 96, lum: 0.72, presetName: "hover" as const },
];
```

- [ ] **Step 2: Generate assets**

Run from `scribe-site/`:

```bash
bun run dither
```

Expected: exit 0 and a log line containing `footer-field.png` at `96x96`.

- [ ] **Step 3: Confirm the file exists**

```bash
file public/art/dither/footer-field.png
```

Expected: PNG image data, ~96×96.

- [ ] **Step 4: Commit**

```bash
git add scripts/dither/index.ts public/art/dither/footer-field.png
git commit -m "asset: add footer dither field tile"
```

---

### Task 2: CSS for the field ramp

**Files:**
- Modify: `app/globals.css` (after the existing `.dither-pricing-field` block)

**Interfaces:**
- Consumes: `/art/dither/footer-field.png`, `--scribe-cobalt`
- Produces: class `.dither-footer-field` for the wordmark zone background layer

- [ ] **Step 1: Add the footer field class**

Immediately after `.dither-pricing-field { ... }`, add:

```css
/* footer wordmark close - tiled dither densifies downward (mask), solid cobalt above */
.dither-footer-field {
  background-color: var(--scribe-cobalt);
  background-image: url("/art/dither/footer-field.png");
  background-repeat: repeat;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 18%,
    rgba(0, 0, 0, 0.45) 55%,
    black 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 18%,
    rgba(0, 0, 0, 0.45) 55%,
    black 100%
  );
}
```

- [ ] **Step 2: Spot-check cascade**

Open `app/globals.css` and confirm `.dither-card-field`, `.dither-pricing-field`, and `.dither-footer-field` sit together under the phase-3 dither comment.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add footer dither field ramp mask"
```

---

### Task 3: Rewrite Footer + slim legal content (test-first)

**Files:**
- Create: `components/landing/Footer.test.tsx`
- Modify: `components/landing/Footer.tsx`
- Modify: `components/landing/content.ts` (footer exports at bottom)

**Interfaces:**
- Consumes: existing `NavItem` type, `.dither-footer-field`, `font-sans`, cobalt/paper tokens
- Produces: `FOOTER_LEGAL: NavItem[]`, `Footer(): React.JSX.Element` used by `app/page.tsx`
- Removes: `FooterColumn`, `FOOTER_COLUMNS`, `FOOTER_UTILITY` (Footer-only; nothing else imports them)

- [ ] **Step 1: Write the failing markup test**

Create `components/landing/Footer.test.tsx`:

```tsx
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "./Footer";

describe("Footer", () => {
  test("renders slim legal links and a decorative cobalt wordmark close", () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain("scribe, inc.");
    expect(html).toContain("privacy");
    expect(html).toContain("terms");
    expect(html).toContain("status");
    expect(html).not.toContain("help centre");
    expect(html).not.toContain("write markdown. own everything.");
    expect(html).toContain("dither-footer-field");
    expect(html).toMatch(/aria-hidden[^>]*>scribe</);
    expect(html).toContain('aria-label="scribe"');
  });
});
```

- [ ] **Step 2: Run the test — expect FAIL**

```bash
bun test components/landing/Footer.test.tsx
```

Expected: FAIL (old footer lacks `dither-footer-field` / still has multi-column copy).

- [ ] **Step 3: Replace footer content exports**

In `components/landing/content.ts`, remove `FooterColumn`, `FOOTER_COLUMNS`, and `FOOTER_UTILITY`. Add:

```ts
export const FOOTER_LEGAL: NavItem[] = [
  { label: "privacy", href: "#" },
  { label: "terms", href: "#" },
  { label: "status", href: "#" },
];
```

Confirm nothing else imported the old symbols:

```bash
rg "FOOTER_COLUMNS|FOOTER_UTILITY|FooterColumn" components app
```

Expected: only `Footer.tsx` (about to be replaced).

- [ ] **Step 4: Implement Footer**

Replace `components/landing/Footer.tsx` with:

```tsx
import Link from "next/link";
import { FOOTER_LEGAL } from "./content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="scribe"
      className="bg-scribe-cobalt text-scribe-paper"
    >
      <div className="shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
        <p className="font-mono text-[13px] text-scribe-paper/70 lg:text-xs">
          © {year} scribe, inc.
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[13px] text-scribe-paper/70 lg:text-xs">
          {FOOTER_LEGAL.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition-colors hover:text-scribe-paper"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="dither-footer-field pointer-events-none absolute inset-0"
        />
        <p
          aria-hidden="true"
          className="relative px-2 font-sans text-[clamp(4.5rem,22vw,14rem)] font-bold leading-[0.76] tracking-[-0.045em] text-scribe-paper lowercase sm:px-3"
        >
          scribe
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run the test — expect PASS**

```bash
bun test components/landing/Footer.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/landing/Footer.tsx components/landing/Footer.test.tsx components/landing/content.ts
git commit -m "feat: replace footer with cobalt wordmark close"
```

---

### Task 4: Visual verification

**Files:**
- None expected (tune mask stops in `app/globals.css` or `lum` in the field job only if the ramp reads wrong)

**Interfaces:**
- Consumes: running `next dev`, Tasks 1–3 output
- Produces: confirmed continuous CTA→footer cobalt plane with field ramp

- [ ] **Step 1: Start the app**

```bash
bun run dev
```

- [ ] **Step 2: Check desktop and a narrow viewport**

Open `/`, scroll past Final CTA into the footer.

Confirm:

- No paper strip or hairline border between CTA and footer
- Legal row readable on solid cobalt
- `scribe` is huge, flush to the bottom, paper-colored TeX Gyre
- Dither densifies downward behind the word; no hard stamp edge
- No leftover columns / pixel tagline

- [ ] **Step 3: Tune only if needed**

If the ramp is too early/late, adjust the `mask-image` stops in `.dither-footer-field` (keep type solid). If dots feel wrong density, change `lum` for `footer-field.png` and re-run `bun run dither`.

- [ ] **Step 4: Commit any tuning**

```bash
git add app/globals.css public/art/dither/footer-field.png scripts/dither/index.ts
git commit -m "tune: refine footer dither ramp"
```

(Skip this commit if no tuning was required.)

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| Slim legal row | 3 |
| Giant TeX Gyre `scribe` flush bottom | 3 |
| Field ramp (solid→dither), not stamp | 1, 2, 3 |
| Continuous cobalt with FinalCta | 3, 4 |
| Offline dither pipeline asset | 1 |
| No runtime canvas | (none added) |
| Drop multi-column / old utility | 3 |
| Crisp dots (CSS background tile) | 2, 3 |
| Desktop + mobile check | 4 |
