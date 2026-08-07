# Hero Video Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero globe stack with the supplied looping video, colorized in Scribe cobalt and motion-safe.

**Architecture:** Keep `HeroOrbit` as the stable interface used by `Hero`, but replace its WebGL/SVG/PNG internals with a self-hosted `<video>`, a generated first-frame poster, and a cobalt blend layer. A small client-side reduced-motion listener pauses and resets playback while CSS exposes the poster beneath it.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Bun test runner, HTML5 video, FFmpeg-generated WebP poster.

## Global Constraints

- Source video: `/home/aetos/Downloads/upscaled-video.webm`, VP9 WebM, 1592 × 1192, 20.53 seconds.
- Playback is autoplay, muted, looping, and inline with `preload="metadata"`.
- Use the existing `--scribe-cobalt` token (`#173bff`) for the color treatment.
- Preserve the existing responsive figure footprint and `fig. 1 - publish orbit` caption.
- Do not change the surrounding hero grid, typography, spacing, or calls to action.
- Leave broader globe source art and dither assets in place.

---

### Task 1: Self-host the video and poster

**Files:**
- Create: `public/art/hero-video.webm`
- Create: `public/art/hero-video-poster.webp`

**Interfaces:**
- Consumes: `/home/aetos/Downloads/upscaled-video.webm`
- Produces: public URLs `/art/hero-video.webm` and `/art/hero-video-poster.webp`

- [ ] **Step 1: Copy the supplied video without transcoding**

Run `cp /home/aetos/Downloads/upscaled-video.webm public/art/hero-video.webm`.

Expected: `cmp` reports no difference between the source and public copy.

- [ ] **Step 2: Generate a deterministic first-frame poster**

Run:

```bash
ffmpeg -y -i /home/aetos/Downloads/upscaled-video.webm -frames:v 1 -c:v libwebp -quality 88 public/art/hero-video-poster.webp
```

Expected: FFmpeg exits 0 and creates a 1592 × 1192 WebP image.

- [ ] **Step 3: Verify both assets**

Run `cmp` on the source and copy, then `file` on both public assets. Expected: identical video bytes and recognized WebM/WebP formats.

### Task 2: Replace the globe component test-first

**Files:**
- Create: `components/landing/HeroOrbit.test.tsx`
- Modify: `components/landing/HeroOrbit.tsx`
- Modify: `app/globals.css`
- Delete: `components/landing/GlobeCanvas.tsx`

**Interfaces:**
- Consumes: `/art/hero-video.webm`, `/art/hero-video-poster.webp`, and `--scribe-cobalt`
- Produces: `HeroOrbit(): React.JSX.Element`, unchanged for the existing `Hero` consumer

- [ ] **Step 1: Write the failing markup test**

```tsx
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HeroOrbit } from "./HeroOrbit";

describe("HeroOrbit", () => {
  test("renders the decorative cobalt hero video with safe autoplay attributes", () => {
    const html = renderToStaticMarkup(<HeroOrbit />);
    expect(html).toContain("/art/hero-video.webm");
    expect(html).toContain("/art/hero-video-poster.webp");
    expect(html).toContain("autoplay");
    expect(html).toContain("muted");
    expect(html).toContain("loop");
    expect(html).toContain("playsinline");
    expect(html).toContain('preload="metadata"');
    expect(html).toContain("hero-video-cobalt-mask");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<svg");
  });
});
```

- [ ] **Step 2: Run `bun test components/landing/HeroOrbit.test.tsx`**

Expected: FAIL because the current component does not contain `/art/hero-video.webm`.

- [ ] **Step 3: Implement the video presentation**

Replace `HeroOrbit.tsx` with a client component that renders the current figure and caption around a poster-backed video. The video must use `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, `poster="/art/hero-video-poster.webp"`, `tabIndex={-1}`, and a `<source src="/art/hero-video.webm" type="video/webm" />`. Use a `useRef<HTMLVideoElement>` and `matchMedia("(prefers-reduced-motion: reduce)")` effect to pause/reset to time zero when reduced motion is active and resume with a caught `play()` promise otherwise.

Render the poster as an absolute `<img>` below the video. Place an absolute, pointer-events-none `<span className="hero-video-cobalt-mask">` above both media layers. Keep the existing `max-w-[400px] lg:max-w-[519px]` figure sizing and add an `aspect-[519/555]` clipped media frame.

- [ ] **Step 4: Add the exact color and reduced-motion CSS**

```css
.hero-video-media {
  filter: grayscale(1) contrast(1.14);
}

.hero-video-cobalt-mask {
  background: var(--scribe-cobalt);
  mix-blend-mode: color;
}

@media (prefers-reduced-motion: reduce) {
  .hero-video-motion {
    display: none;
  }
}
```

- [ ] **Step 5: Remove the obsolete canvas implementation**

Run `rg -n "GlobeCanvas" components app`; after confirming `HeroOrbit` is the only consumer, delete `components/landing/GlobeCanvas.tsx`.

- [ ] **Step 6: Re-run the focused test**

Run `bun test components/landing/HeroOrbit.test.tsx`. Expected: PASS with one test passing.

- [ ] **Step 7: Run repository verification**

Run `bun run lint` and `bun run build`. Expected: both exit 0 without errors.

### Task 3: Browser verification and localhost handoff

**Files:**
- Verify: `components/landing/HeroOrbit.tsx`
- Verify: `app/globals.css`
- Verify: `public/art/hero-video.webm`

**Interfaces:**
- Consumes: built home route and static media URLs
- Produces: working localhost preview URL

- [ ] **Step 1: Start `bun run dev`**

Expected: Next.js reports a localhost URL and remains running.

- [ ] **Step 2: Verify the route and media**

Use `curl -I` against `/` and `/art/hero-video.webm`. Expected: HTTP 200 for both and a video content type for the asset.

- [ ] **Step 3: Inspect desktop, mobile, and reduced-motion states**

Confirm the video fills the former globe footprint, has a cobalt monochrome treatment, plays muted in a loop, retains the caption, and switches to the poster when reduced motion is enabled.

- [ ] **Step 4: Review the final diff**

Run `git diff --check` and `git status --short`. Expected: no whitespace errors and no unplanned changes.

