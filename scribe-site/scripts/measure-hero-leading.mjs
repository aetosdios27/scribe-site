import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "test-results/hero-leading");
await mkdir(OUT, { recursive: true });

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.waitForSelector("h1.hero-heading");

  const metrics = await page.evaluate(() => {
    const h1 = document.querySelector("h1.hero-heading");
    const lines = [...h1.children];
    const cs = getComputedStyle(h1);
    const fontSize = parseFloat(cs.fontSize);
    const lineHeightPx = parseFloat(cs.lineHeight);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const yM = ctx.measureText("y");
    const iM = ctx.measureText("i");
    const gM = ctx.measureText("g");

    const yDescent = yM.actualBoundingBoxDescent;
    const iAscent = iM.actualBoundingBoxAscent;
    const gDescent = gM.actualBoundingBoxDescent;

    const pixel = h1.querySelector(".hero-pixel-word");
    const pcs = pixel ? getComputedStyle(pixel) : null;
    let pixelAscent = null;
    if (pcs) {
      ctx.font = `${pcs.fontWeight} ${pcs.fontSize} ${pcs.fontFamily}`;
      pixelAscent = ctx.measureText("w").actualBoundingBoxAscent;
    }

    const boxes = lines.map((el) => {
      const b = el.getBoundingClientRect();
      return {
        top: b.top,
        bottom: b.bottom,
        height: b.height,
        text: el.textContent.trim().slice(0, 20),
      };
    });

    return {
      fontSize,
      lineHeightPx,
      lhRatio: lineHeightPx / fontSize,
      yDescent,
      iAscent,
      gDescent,
      pixelAscent,
      predictedGap_y_i: lineHeightPx - yDescent - iAscent,
      predictedGap_g_iAscent: lineHeightPx - gDescent - iAscent,
      predictedGap_g_pixel:
        pixelAscent != null ? lineHeightPx - gDescent - pixelAscent : null,
      boxes,
      boxGap12: boxes[1].top - boxes[0].bottom,
      boxGap23: boxes[2].top - boxes[1].bottom,
      h1: (() => {
        const b = h1.getBoundingClientRect();
        return { x: b.x, y: b.y, width: b.width, height: b.height };
      })(),
    };
  });

  const clip = {
    x: Math.max(0, Math.floor(metrics.h1.x)),
    y: Math.max(0, Math.floor(metrics.h1.y)),
    width: Math.ceil(metrics.h1.width),
    height: Math.ceil(metrics.h1.height),
  };
  const pngPath = path.join(OUT, `${vp.name}.png`);
  await page.screenshot({ path: pngPath, clip });

  const { data, info } = await sharp(pngPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const rowHas = new Array(h).fill(false);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      const luma =
        0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
      if (luma < 140 && data[o + 3] > 128) {
        rowHas[y] = true;
        break;
      }
    }
  }
  const runs = [];
  let start = null;
  for (let y = 0; y < h; y++) {
    if (rowHas[y] && start == null) start = y;
    else if (!rowHas[y] && start != null) {
      runs.push([start, y - 1]);
      start = null;
    }
  }
  if (start != null) runs.push([start, h - 1]);

  function closestGap(runA, runB) {
    let best = Infinity;
    let atX = -1;
    for (let x = 0; x < w; x++) {
      let bottom = -1;
      let top = -1;
      for (let y = runA[1]; y >= runA[0]; y--) {
        const o = (y * w + x) * 4;
        const luma =
          0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
        if (luma < 140 && data[o + 3] > 128) {
          bottom = y;
          break;
        }
      }
      for (let y = runB[0]; y <= runB[1]; y++) {
        const o = (y * w + x) * 4;
        const luma =
          0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
        if (luma < 140 && data[o + 3] > 128) {
          top = y;
          break;
        }
      }
      if (bottom >= 0 && top >= 0) {
        const g = top - bottom - 1;
        if (g < best) {
          best = g;
          atX = x;
        }
      }
    }
    return { gap: best === Infinity ? null : best, atX };
  }

  const row = {
    viewport: vp.name,
    width: vp.width,
    fontSizePx: +metrics.fontSize.toFixed(2),
    lineHeightPx: +metrics.lineHeightPx.toFixed(2),
    lhRatio: +metrics.lhRatio.toFixed(4),
    boxGap12: metrics.boxGap12,
    boxGap23: metrics.boxGap23,
    predicted_y_i: +metrics.predictedGap_y_i.toFixed(2),
    predicted_g_iAscent: +metrics.predictedGap_g_nextAscent.toFixed(2),
    predicted_g_pixel:
      metrics.predictedGap_g_pixel != null
        ? +metrics.predictedGap_g_pixel.toFixed(2)
        : null,
    inkClosest12: runs.length >= 2 ? closestGap(runs[0], runs[1]).gap : null,
    inkClosest23: runs.length >= 3 ? closestGap(runs[1], runs[2]).gap : null,
    inkBBox12: runs.length >= 2 ? runs[1][0] - runs[0][1] - 1 : null,
    inkBBox23: runs.length >= 3 ? runs[2][0] - runs[1][1] - 1 : null,
    runCount: runs.length,
    yDescent: +metrics.yDescent.toFixed(2),
    iAscent: +metrics.iAscent.toFixed(2),
    gDescent: +metrics.gDescent.toFixed(2),
    pixelAscent:
      metrics.pixelAscent != null ? +metrics.pixelAscent.toFixed(2) : null,
  };
  results.push(row);
  console.log(JSON.stringify(row));
  await page.close();
}

await browser.close();
await writeFile(path.join(OUT, "gaps.json"), JSON.stringify(results, null, 2));
console.log("\n=== SUMMARY (CSS px, deviceScaleFactor=1) ===");
for (const r of results) {
  const delta =
    r.inkClosest12 != null && r.inkClosest23 != null
      ? r.inkClosest23 - r.inkClosest12
      : "n/a";
  console.log(
    `${r.viewport.padEnd(8)} ${String(r.width).padStart(4)}  fs=${String(r.fontSizePx).padStart(6)}  lh=${String(r.lineHeightPx).padStart(7)}  ink1→2=${String(r.inkClosest12).padStart(3)}  ink2→3=${String(r.inkClosest23).padStart(3)}  Δ=${delta}`,
  );
}
