import { GeistMono } from "geist/font/mono";
import { GeistPixelCircle } from "geist/font/pixel";
import localFont from "next/font/local";

/* scribe type system:
   - TeX Gyre Heros (400/700, local CTAN/GUST files) — publishing voice
   - Geist Mono (variable, official geist package) — infrastructure voice
   - Geist Pixel Circle (official geist package) — dot-matrix interruption
   no Geist Sans, no other pixel variants, no remote fonts. */

export const texGyreHeros = localFont({
  src: [
    {
      path: "./fonts/tex-gyre-heros/texgyreheros-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/tex-gyre-heros/texgyreheros-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tex-gyre-heros",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export { GeistMono, GeistPixelCircle };
