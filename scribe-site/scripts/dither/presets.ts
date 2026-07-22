import type { PaletteName } from "./palette";
import type { ThresholdName } from "./matrices";

/* named scribe dither presets - tune here, never inside the pipeline. */

export type DitherPreset = {
  palette: PaletteName;
  threshold: ThresholdName;
  /** luminance contrast around the midpoint pivot */
  contrast: number;
  /** luminance pivot in [0,1] - biases the tonal curve */
  midpoint: number;
  /** each dither dot becomes pixelScale x pixelScale output px */
  pixelScale: number;
};

export const scribeDitherPresets = {
  /** flagship hero object - blue-noise style, no repetition */
  hero: {
    palette: "cobalt-on-transparent",
    threshold: "ign",
    contrast: 1.15,
    midpoint: 0.5,
    pixelScale: 3,
  },

  /** human figure - clustered halftone, strong silhouettes */
  figure: {
    palette: "cobalt-on-transparent",
    threshold: "cluster4",
    contrast: 1.25,
    midpoint: 0.52,
    pixelScale: 3,
  },

  /** pricing object - structured bayer, moderate tonal detail */
  pricing: {
    palette: "cobalt-on-transparent",
    threshold: "bayer8",
    contrast: 1.2,
    midpoint: 0.5,
    pixelScale: 3,
  },

  /** final cta mark - paper dots on the cobalt band */
  mark: {
    palette: "paper-on-transparent",
    threshold: "cluster4",
    contrast: 1.2,
    midpoint: 0.5,
    pixelScale: 3,
  },

  /** marketing card hover field - sparse white dots on cobalt */
  hover: {
    palette: "white-on-cobalt",
    threshold: "bayer4",
    contrast: 1,
    midpoint: 0.5,
    pixelScale: 2,
  },

  /** pro pricing hover field - denser, finer grain */
  hoverPro: {
    palette: "white-on-cobalt",
    threshold: "bayer8",
    contrast: 1,
    midpoint: 0.5,
    pixelScale: 1,
  },
} satisfies Record<string, DitherPreset>;

export type PresetName = keyof typeof scribeDitherPresets;
