/* ordered threshold maps for the dither pipeline. all deterministic. */

export type ThresholdMap = {
  /** tile period in px; IGN is effectively aperiodic (reports 1) */
  n: number;
  /** threshold in [0,1) for a source pixel coordinate */
  at: (x: number, y: number) => number;
};

function fromMatrix(m: number[][]): ThresholdMap {
  const n = m.length;
  const max = n * n;
  return { n, at: (x, y) => m[y % n][x % n] / max };
}

/* classic bayer 4x4 - structured, predictable, tiles at any multiple of 4 */
const BAYER4 = fromMatrix([
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]);

/* classic bayer 8x8 - finer structured grain */
const BAYER8 = fromMatrix([
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]);

/* clustered-dot 4x4 - dots grow from a centre, halftone-adjacent look */
const CLUSTER4 = fromMatrix([
  [12, 5, 6, 13],
  [4, 0, 1, 7],
  [11, 3, 2, 8],
  [15, 10, 9, 14],
]);

/* interleaved gradient noise (jorge jimenez) - blue-noise-style,
   no visible repetition, ideal for flagship illustrations */
const IGN: ThresholdMap = {
  n: 1,
  at: (x, y) => {
    const v =
      52.9829189 * ((0.06711056 * x + 0.00583715 * y) % 1);
    return v - Math.floor(v);
  },
};

export type ThresholdName = "bayer4" | "bayer8" | "cluster4" | "ign";

export const THRESHOLDS: Record<ThresholdName, ThresholdMap> = {
  bayer4: BAYER4,
  bayer8: BAYER8,
  cluster4: CLUSTER4,
  ign: IGN,
};
