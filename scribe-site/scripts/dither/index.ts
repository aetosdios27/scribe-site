import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { THRESHOLDS } from "./matrices";
import { PALETTES } from "./palette";
import { scribeDitherPresets, type DitherPreset, type PresetName } from "./presets";

/* ---------------------------------------------------------------------------
   scribe dither pipeline - deterministic, offline, repository-owned.

   bun run dither

   sources in art/source/** are rasterised, converted to ink coverage,
   quantised with an ordered threshold map, remapped into the scribe palette,
   and exported as lossless PNGs in public/art/dither/. the browser only ever
   receives ordinary static images - no runtime processing, no canvas.
--------------------------------------------------------------------------- */

const ROOT = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const OUT_DIR = path.join(ROOT, "public/art/dither");

type DitherJob = {
  /** rasterise at this luminance grid width (output px / pixelScale) */
  outWidth: number;
  preset: DitherPreset;
};

function luminanceToInk(
  data: Buffer,
  width: number,
  height: number,
  preset: DitherPreset,
): { ink: Float32Array; alpha: Uint8Array } {
  const ink = new Float32Array(width * height);
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const r = data[o] / 255;
    const g = data[o + 1] / 255;
    const b = data[o + 2] / 255;
    const a = data[o + 3];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // contrast around the midpoint pivot
    const adjusted = Math.min(
      1,
      Math.max(0, (luma - preset.midpoint) * preset.contrast + preset.midpoint),
    );
    // ink coverage: darker source => denser dots
    ink[i] = (1 - adjusted) * (a / 255);
    alpha[i] = a;
  }
  return { ink, alpha };
}

async function render(job: DitherJob, source: Buffer): Promise<Buffer> {
  const { preset } = job;
  const threshold = THRESHOLDS[preset.threshold];
  const palette = PALETTES[preset.palette];

  const gridW = Math.max(1, Math.floor(job.outWidth / preset.pixelScale));

  // rasterise the source straight onto the dither grid (smooth tones in)
  const { data, info } = await sharp(source, { density: 384 })
    .resize({ width: gridW, kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const gridH = info.height;
  const { ink, alpha } = luminanceToInk(data, gridW, gridH, preset);

  // expand each quantised cell into a pixelScale x pixelScale hard-edged block
  const outW = gridW * preset.pixelScale;
  const outH = gridH * preset.pixelScale;
  const out = Buffer.alloc(outW * outH * 4);

  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const i = y * gridW + x;
      const visible = alpha[i] >= 128;
      const on = visible && ink[i] > threshold.at(x, y);
      const px = on
        ? palette.fg
        : visible && palette.bg
          ? palette.bg
          : null;

      for (let dy = 0; dy < preset.pixelScale; dy++) {
        for (let dx = 0; dx < preset.pixelScale; dx++) {
          const o = ((y * preset.pixelScale + dy) * outW + x * preset.pixelScale + dx) * 4;
          if (px) {
            out[o] = px[0];
            out[o + 1] = px[1];
            out[o + 2] = px[2];
            out[o + 3] = 255;
          } else {
            out[o + 3] = 0;
          }
        }
      }
    }
  }

  return sharp(out, { raw: { width: outW, height: outH, channels: 4 } })
    .png({ palette: true, colors: 4, dither: 0, compressionLevel: 9 })
    .toBuffer();
}

async function makeField(
  tileSize: number,
  lum: number,
  preset: DitherPreset,
): Promise<Buffer> {
  // synthetic uniform field (for hover textures) - no source artwork needed
  const gridW = Math.max(1, Math.floor(tileSize / preset.pixelScale));
  const gray = Math.round(lum * 255);
  const solid = await sharp({
    create: {
      width: gridW,
      height: gridW,
      channels: 4,
      background: { r: gray, g: gray, b: gray, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  return render({ outWidth: gridW * preset.pixelScale, preset }, solid);
}

type AssetJob = {
  source: string;
  presetName: PresetName;
  outputs: { file: string; width: number }[];
};

const ASSETS: AssetJob[] = [
  {
    source: "art/source/hero-sphere.svg",
    presetName: "hero",
    outputs: [
      { file: "hero-sphere-1x.png", width: 520 },
      { file: "hero-sphere-2x.png", width: 1040 },
    ],
  },
  {
    source: "art/source/problem-person.svg",
    presetName: "figure",
    outputs: [
      { file: "problem-person-1x.png", width: 300 },
      { file: "problem-person-2x.png", width: 600 },
    ],
  },
  {
    source: "art/source/pricing-pig.svg",
    presetName: "pricing",
    outputs: [
      { file: "pricing-pig-1x.png", width: 340 },
      { file: "pricing-pig-2x.png", width: 680 },
    ],
  },
  {
    source: "art/source/final-mark.svg",
    presetName: "mark",
    outputs: [
      { file: "final-mark-1x.png", width: 180 },
      { file: "final-mark-2x.png", width: 360 },
    ],
  },
];

const FIELDS = [
  { file: "card-field.png", tile: 96, lum: 0.78, presetName: "hover" as const },
  { file: "pricing-field.png", tile: 128, lum: 0.66, presetName: "hoverPro" as const },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const job of ASSETS) {
    const source = await readFile(path.join(ROOT, job.source));
    const preset = scribeDitherPresets[job.presetName];
    for (const out of job.outputs) {
      const png = await render({ outWidth: out.width, preset }, source);
      const file = path.join(OUT_DIR, out.file);
      await sharp(png).toFile(file);
      const meta = await sharp(png).metadata();
      console.log(
        `${out.file.padEnd(24)} ${meta.width}x${meta.height}  ${(png.length / 1024).toFixed(1)} KB  [${job.presetName}]`,
      );
    }
  }

  for (const field of FIELDS) {
    const png = await makeField(field.tile, field.lum, scribeDitherPresets[field.presetName]);
    const file = path.join(OUT_DIR, field.file);
    await sharp(png).toFile(file);
    console.log(
      `${field.file.padEnd(24)} ${field.tile}x${field.tile}  ${(png.length / 1024).toFixed(1)} KB  [${field.presetName}]`,
    );
  }
}

await main();
