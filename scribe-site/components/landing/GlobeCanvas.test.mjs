import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("GlobeCanvas animation lifecycle", () => {
  test("marks the loop stopped when the tab becomes hidden", () => {
    const source = readFileSync(
      new URL("./GlobeCanvas.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toMatch(
      /const onVis = \(\) => \{[\s\S]*?if \(document\.hidden\) \{[\s\S]*?running = false;[\s\S]*?cancelAnimationFrame\(raf\);/,
    );
  });
});
