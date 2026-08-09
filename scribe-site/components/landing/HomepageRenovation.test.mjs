import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "../..");
const source = (path) => readFileSync(join(root, path), "utf8");

describe("homepage renovation", () => {
  test("renders exactly the approved seven homepage layers in order", () => {
    const page = source("app/page.tsx");
    const expected = [
      "<Header />",
      "<Hero />",
      "<ProblemStatement />",
      "<ProductFilm />",
      "<TechnicalProof />",
      "<FinalCta />",
      "<Footer />",
    ];

    for (const component of expected) expect(page).toContain(component);
    for (let index = 1; index < expected.length; index += 1) {
      expect(page.indexOf(expected[index - 1])).toBeLessThan(
        page.indexOf(expected[index]),
      );
    }

    expect(page).not.toContain("ProblemSection");
    expect(page).not.toContain("StudioShowcase");
    expect(page).not.toContain("ValueStrip");
    expect(page).not.toContain("PricingSection");
    expect(page).not.toContain("CompatibilityStrip");
  });

  test("orders setup, pain ribbon, recognition, and punchline exactly", () => {
    const path = "components/landing/ProblemStatement.tsx";
    expect(existsSync(join(root, path))).toBe(true);
    if (!existsSync(join(root, path))) return;

    const problem = source(path);
    const beats = [
      "problem-setup",
      "problem-pain-ribbon",
      "problem-recognition",
      "problem-punchline-ribbon",
    ];

    for (const beat of beats) expect(problem).toContain(beat);
    for (let index = 1; index < beats.length; index += 1) {
      expect(problem.indexOf(beats[index - 1])).toBeLessThan(
        problem.indexOf(beats[index]),
      );
    }

    expect(problem).toContain("MaskRevealUp");
    expect(problem).toContain("InfiniteSlider");
    expect(problem).toContain("you wanted");
    expect(problem).toContain("to write blogs");
    expect(problem).toContain("so why don’t you?");
    expect(problem).toContain("oh right...");
    expect(problem).toContain("yeah we feel the same");
    expect(problem).toContain("fuck frontend.");

    for (const message of [
      "i just wanted to write bro",
      "why am i debugging mdx at 2am",
      "how is markdown never just markdown",
      "why am i touching css for an article",
      "one plugin update and it all exploded",
      "spent longer styling code than writing",
      "this did not need a build pipeline",
      "can i please just publish",
      "why is the blog fighting back",
      "frontend tax is insane",
      "just let me ship the post",
      "authoring should not feel like devops",
    ]) {
      expect(problem).toContain(message);
    }

    expect(problem).not.toContain("PainCard");
    expect(problem).not.toContain("speech");
    expect(problem).not.toContain("illustration");
    expect(problem.match(/gap=\{40\}/g) ?? []).toHaveLength(2);
    expect(problem).not.toContain("gap={38}");
    expect(problem).not.toContain("gap={46}");
  });

  test("keeps the problem ribbons compact and applies the pixel verdict contract", () => {
    const css = source("app/globals.css");
    const start = css.indexOf("editorial problem");
    const end = css.indexOf("product film", start);
    const problemCss = css.slice(start, end);

    expect(problemCss).toContain(".problem-pain-ribbon");
    expect(problemCss).toContain(".problem-recognition");
    expect(problemCss).toContain(".problem-punchline-ribbon");
    expect(problemCss).not.toMatch(/min-height:[^;]*(?:vh|svh|dvh)/);
    expect(problemCss).not.toContain("align-items: center");
    expect(problemCss).toMatch(
      /\.problem-punchline-ribbon\s*\{[\s\S]*?background:\s*var\(--scribe-cobalt\)/,
    );
    expect(problemCss).toMatch(
      /\.problem-punchline-copy\s*\{[\s\S]*?font-family:\s*var\(--font-pixel\)[\s\S]*?color:\s*var\(--scribe-paper\)/,
    );
    expect(problemCss).toContain(".problem-pain-static");
    expect(problemCss).toContain(".pain-bubble::after");
    expect(problemCss).not.toMatch(
      /\.pain-bubble:nth-child\([^)]*\)\s*\{[\s\S]*?transform:\s*rotate/,
    );
  });

  test("makes one factual ownership pipeline instead of another card grid", () => {
    const path = "components/landing/TechnicalProof.tsx";
    expect(existsSync(join(root, path))).toBe(true);
    if (!existsSync(join(root, path))) return;

    const proof = source(path);
    for (const fact of [
      "YOUR CONTENT",
      "SCRIBE",
      "YOUR WEBSITE",
      "Markdown / MDX",
      "local files",
      "your repository",
      "source remains authoritative",
      "your components",
      "Next.js / Vite",
      "your deployment",
      "no hosted CMS",
      "compile-time output",
      "no runtime lock-in",
    ]) {
      expect(proof).toContain(fact);
    }
    expect(proof).not.toContain("Card");
    expect(proof).not.toContain("grid-cols-3");
  });

  test("keeps only working product, roadmap, and GitHub navigation destinations", () => {
    const content = source("components/landing/content.ts");
    expect(content).toContain('{ label: "product", href: "/#product" }');
    expect(content).toContain('{ label: "roadmap", href: "/roadmap" }');
    expect(content).toContain(
      '{ label: "github", href: "https://github.com/aetosdios27/scribe" }',
    );
    expect(content).not.toContain('{ label: "pricing"');
    expect(content).not.toContain('{ label: "studio"');
    expect(content).not.toContain('{ label: "cli"');
    expect(content).not.toContain('{ label: "blog"');
  });

  test("renders a static curated pain ribbon for mobile with the exact messages", () => {
    const problem = source("components/landing/ProblemStatement.tsx");
    expect(problem).toContain("const mobileMessages = [0, 1, 3, 5, 6, 8, 7]");

    const css = source("app/globals.css");
    const mobileStart = css.indexOf("@media (max-width: 767px)");
    const mobileBlock = css.slice(mobileStart);

    expect(mobileBlock).toContain(".problem-pain-ribbon {");
    expect(mobileBlock).toContain("height: auto");
    expect(mobileBlock).toContain(
      ".problem-pain-static .pain-bubble-list",
    );
    expect(mobileBlock).toContain("align-content: flex-start");
    expect(mobileBlock).not.toContain("align-content: space-between");

    expect(mobileBlock).toContain(".technical-proof-stage {");
    expect(mobileBlock).toContain("min-height: 0");
    expect(mobileBlock).not.toContain("min-height: 24rem");
  });

  test("hides decorative marquee clones and keeps one assistive list", () => {
    const problem = source("components/landing/ProblemStatement.tsx");

    const srOnlyList = problem.indexOf('className="sr-only"');
    const moving = problem.indexOf('aria-hidden="true" className="problem-pain-moving"');
    const staticRibbon = problem.indexOf(
      'aria-hidden="true" className="shell problem-pain-static"',
    );

    expect(srOnlyList).toBeGreaterThan(-1);
    expect(moving).toBeGreaterThan(srOnlyList);
    expect(staticRibbon).toBeGreaterThan(moving);
  });
});
