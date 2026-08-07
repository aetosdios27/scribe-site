import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const OUT = join(import.meta.dir, "..", "test-results", "screenshots");
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();
const report = [];

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(800);

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  const overflowOk = metrics.scrollWidth === metrics.clientWidth;
  report.push({ viewport: vp.name, ...metrics, overflow: overflowOk ? "OK" : "OVERFLOW" });

  const ribbonMetrics = await page.evaluate(() => {
    const setup = document.querySelector(".problem-setup");
    const copy = document.querySelector(".problem-setup-copy");
    const r = (n) => {
      const b = n?.getBoundingClientRect();
      return b ? Math.round(b.height) : null;
    };
    const lines = [...(copy?.querySelectorAll(".mask-reveal-line") ?? [])].map((s) => {
      const b = s.getBoundingClientRect();
      return { text: s.textContent, h: Math.round(b.height) };
    });
    return {
      setupHeight: r(setup),
      copyHeight: r(copy),
      fontPx: copy ? getComputedStyle(copy).fontSize : null,
      lines,
    };
  });
  report.push({ viewport: `${vp.name}-ribbon`, ...ribbonMetrics });

  await page.screenshot({ path: join(OUT, `${vp.name}-full.png`), fullPage: true });

  if (vp.name === "mobile-390") {
    await page.screenshot({
      path: join(OUT, "mobile-390-header.png"),
      clip: { x: 0, y: 0, width: 390, height: 200 },
    });
    await page.screenshot({
      path: join(OUT, "mobile-390-hero.png"),
      clip: { x: 0, y: 0, width: 390, height: 1200 },
    });
    await page.screenshot({
      path: join(OUT, "mobile-390-final-cta.png"),
      clip: { x: 0, y: 0, width: 390, height: 1200 },
    });

    const headerMetrics = await page.evaluate(() => {
      const header = document.querySelector("header");
      const heroActions = document.querySelector(".hero-install-actions");
      const rect = header?.getBoundingClientRect();
      return {
        headerHeight: rect?.height ?? null,
        headerWidth: rect?.width ?? null,
        installButtonWidth: (() => {
          const btn = document.querySelector(".install-copy-button--nav");
          const r = btn?.getBoundingClientRect();
          return r ? Math.round(r.width) : null;
        })(),
        heroCommandWidth: (() => {
          const field = document.querySelector(".hero-install-actions .install-copy-field");
          const r = field?.getBoundingClientRect();
          return r ? Math.round(r.width) : null;
        })(),
        hasHeroActions: Boolean(heroActions),
      };
    });
    report.push({ viewport: "mobile-390-header-metrics", ...headerMetrics });
  }

  await context.close();
}

console.log(JSON.stringify(report, null, 2));
await browser.close();
