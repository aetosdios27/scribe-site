import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "../..");
const source = (path) => readFileSync(join(root, path), "utf8");

describe("site motion layer", () => {
  test("wires ClickSpark at document level so sparks follow any click", () => {
    const layout = source("app/layout.tsx");
    expect(layout).toContain("<ClickSpark");

    const clickSpark = source("components/reactbits/click-spark/index.tsx");
    expect(clickSpark).toContain('"use client"');
    expect(clickSpark).toContain("click-spark-canvas");
    expect(clickSpark).toMatch(/addEventListener\(["']pointerdown/);
    expect(clickSpark).toMatch(/prefers-reduced-motion/);

    const css = source("app/globals.css");
    expect(css).toMatch(/\.click-spark-canvas\s*\{[\s\S]*?position:\s*fixed/);
    expect(css).toMatch(/\.click-spark-canvas\s*\{[\s\S]*?pointer-events:\s*none/);
  });

  test("glitches the punchline with a contained LetterGlitch layer", () => {
    const problem = source("components/landing/ProblemStatement.tsx");
    expect(problem).toContain("LetterGlitch");
    expect(problem).toContain("fuck frontend.");
    expect(problem).toContain("problem-punchline-glitch");
  });

  test("slides the recognition copy in line by line", () => {
    const problem = source("components/landing/ProblemStatement.tsx");
    expect(problem).toContain("LineByLineSlide");
    expect(problem).toContain("oh right...");
    expect(problem).toContain("yeah we feel the same");
  });

  test("sweeps the final CTA heading with a shimmer sweep", () => {
    const cta = source("components/landing/FinalCta.tsx");
    expect(cta).toContain("ShimmerSweep");
    expect(cta).toContain("stop fighting your frontend.");
    expect(cta).toContain("start publishing what matters.");
  });

  test("adds framed dither fields to the technical proof cards", () => {
    const proof = source("components/landing/TechnicalProof.tsx");
    expect(proof).toContain("DitherField");
    expect(proof).toContain("technical-proof-dither");

    const field = source("components/landing/DitherField.tsx");
    expect(field).toContain('"use client"');
    expect(field).toContain("<Dither");
    expect(field).toContain("backgroundColor");
    expect(field).toContain("frameloop");

    const dither = source("components/reactbits/dither/index.tsx");
    expect(dither).toContain("@react-three/fiber");
    expect(dither).toContain("EffectComposer");
    expect(dither).toContain("backgroundColor");
    expect(dither).toContain("frameloop");

    const film = source("components/landing/ProductFilm.tsx");
    expect(film).not.toContain("Dither");
  });

  test("keeps every new effect inert under prefers-reduced-motion", () => {
    const css = source("app/globals.css");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.problem-punchline-glitch[\s\S]*?display:\s*none/,
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.technical-proof-dither[\s\S]*?display:\s*none/,
    );

    const clickSpark = source("components/reactbits/click-spark/index.tsx");
    expect(clickSpark).toMatch(/prefers-reduced-motion/);
  });
});
