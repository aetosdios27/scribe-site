# Hero Video Replacement Design

## Goal

Replace the landing-page hero's generated globe presentation with the supplied WebM while preserving the hero's current responsive composition and matching Scribe's cobalt visual system.

## Source Asset

- Input: `/home/aetos/Downloads/upscaled-video.webm`
- Format: VP9 WebM
- Dimensions: 1592 × 1192
- Duration: 20.53 seconds
- Playback: autoplay, muted, looping, and inline

The video will be copied into the app's public assets so it is served as a stable same-origin URL in development and production.

## Visual Treatment

The media will occupy the existing globe figure footprint and use `object-fit: cover` to avoid layout shifts. The source will be desaturated and slightly contrast-enhanced, then colorized with the existing `--scribe-cobalt` token (`#173bff`) to create a consistent cobalt duotone rather than a translucent wash that leaves unrelated source colors visible.

The current figure caption, `fig. 1 - publish orbit`, remains in place. The surrounding hero grid, typography, spacing, and calls to action remain unchanged.

## Component Changes

`HeroOrbit` remains the public component consumed by `Hero`, but its internal WebGL canvas, SVG orbit, and static dither image stack will be replaced by a semantic video presentation. Keeping the component boundary limits the change to the media implementation and avoids unrelated hero refactoring.

The video element will use:

- `autoPlay`, `muted`, `loop`, and `playsInline`
- `preload="metadata"`
- no controls, because it is decorative ambient media
- an empty accessible description via an `aria-hidden` figure media wrapper

The existing cobalt background will remain visible behind the media as a graceful fallback if the asset cannot decode. Users who prefer reduced motion will see a static first-frame presentation rather than continuous playback.

## Asset and Legacy Code Handling

The source WebM will be copied to `public/art/hero-video.webm`. The no-longer-used `GlobeCanvas` component will be removed only after confirming it has no other consumers. Existing generated globe source art and dither assets will be left in place because deleting broader art-source files is outside this focused change.

## Verification

- Run lint and a production build.
- Confirm the video request succeeds and the home page renders at desktop and mobile widths.
- Confirm autoplay/loop attributes and the cobalt treatment in a browser.
- Confirm reduced-motion styling suppresses continuous playback behavior where supported.
- Start the development server and provide the localhost URL for review.

