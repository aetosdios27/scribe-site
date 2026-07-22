/* scribe palette for dither remapping. dots = fg, field = bg (or transparent). */

export type RGB = [number, number, number];

export const SCRIBE = {
  paper: [247, 246, 241] as RGB,
  paperRaised: [251, 250, 247] as RGB,
  ink: [10, 10, 10] as RGB,
  cobalt: [23, 59, 255] as RGB,
  cobaltDark: [15, 46, 214] as RGB,
  white: [255, 255, 255] as RGB,
};

export type PaletteName =
  | "cobalt-on-paper"
  | "ink-on-paper"
  | "paper-on-cobalt"
  | "white-on-cobalt"
  | "cobalt-on-transparent"
  | "ink-on-transparent"
  | "paper-on-transparent"
  | "white-on-transparent";

export const PALETTES: Record<PaletteName, { fg: RGB; bg: RGB | null }> = {
  "cobalt-on-paper": { fg: SCRIBE.cobalt, bg: SCRIBE.paper },
  "ink-on-paper": { fg: SCRIBE.ink, bg: SCRIBE.paper },
  "paper-on-cobalt": { fg: SCRIBE.paper, bg: SCRIBE.cobalt },
  "white-on-cobalt": { fg: SCRIBE.white, bg: SCRIBE.cobalt },
  "cobalt-on-transparent": { fg: SCRIBE.cobalt, bg: null },
  "ink-on-transparent": { fg: SCRIBE.ink, bg: null },
  "paper-on-transparent": { fg: SCRIBE.paper, bg: null },
  "white-on-transparent": { fg: SCRIBE.white, bg: null },
};
