import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
};

describe("public roadmap", () => {
  const page = read("../../app/roadmap/page.tsx");
  const content = read("./content.ts");
  const footer = read("./Footer.tsx");
  const styles = read("../../app/globals.css");
  const ditherField = read("./DitherField.tsx");

  test("publishes the three evidence-gated roadmap phases", () => {
    expect(page.length).toBeGreaterThan(0);
    expect(page).toContain("Make real integrations boringly reliable");
    expect(page).toContain("Let established sites integrate deeply without surrendering their architecture");
    expect(page).toContain("Make Scribe stable enough to depend on");
    expect(page).toContain("direction, not a promise of ship dates");
    expect(page).toMatch(/real integration\s+evidence can change the order/);
  });

  test("keeps roadmap and contribution links in the sparse public navigation", () => {
    expect(content).toContain('{ label: "roadmap", href: "/roadmap" }');
    expect(footer).toContain('href="/roadmap"');
    expect(footer).toContain('href="https://github.com/aetosdios27/scribe/blob/main/CONTRIBUTING.md"');
  });

  test("closes with a quiet repository nudge instead of action buttons", () => {
    expect(page).toContain("roadmap-github-nudge");
    expect(page).not.toContain("send the patch");
    expect(page).not.toContain("roadmap-actions");
    expect(styles).not.toContain(".roadmap-title-grid h1::after");
    expect(styles).not.toContain(".roadmap-action");
  });

  test("gives the intro one roadmap-specific smoke field behind the copy", () => {
    expect(page).toContain('className="roadmap-intro-dither"');
    expect(page).toContain('variant="roadmap"');
    expect(page).toContain('geometry="smoke"');
    expect(ditherField).toContain("smoke:");
    expect(ditherField).toContain('variant: "paper" | "cobalt" | "roadmap"');
    expect(ditherField).toContain(
      "const ROADMAP_LAVENDER = [0.69, 0.72, 0.96]",
    );
    expect(ditherField).toMatch(/smoke:\s*\{[\s\S]*?waveSpeed: 0\.014,/);
    expect(ditherField).toMatch(/smoke:\s*\{[\s\S]*?pixelSize: 2,/);
    expect(ditherField).toMatch(
      /variant === "cobalt"[\s\S]*?\? PAPER[\s\S]*?: COBALT/,
    );
    expect(styles).toContain(".roadmap-intro-dither");
    expect(styles).toContain("padding-top: clamp(2.25rem, 4vw, 3.75rem)");
    expect(styles).toContain("line-height: 1.02");
    expect(styles).toMatch(
      /\.roadmap-title-grid\s*\{[\s\S]*?align-items: start;/,
    );
    expect(styles).toMatch(
      /\.roadmap-intro-copy p\s*\{[\s\S]*?font-size: clamp\(1\.125rem, 1\.35vw, 1\.25rem\);/,
    );
    expect(styles).toMatch(
      /\.roadmap-intro-copy\s*\{[\s\S]*?padding-top: 1rem;/,
    );
    expect(styles).toMatch(
      /\.roadmap-kicker \.font-mono[\s\S]*?font-size: 0\.875rem;/,
    );
    expect(styles).toMatch(
      /\.roadmap-edition\s*\{[\s\S]*?font-size: 0\.875rem;/,
    );
  });

  test("uses existing text motion without animating every paragraph", () => {
    expect(page).toContain('import ShimmerSweep from "@/components/smoothui/shimmer-sweep"');
    expect(page).toContain('import { TextReveal } from "@/components/interior/text-reveal"');
    expect(page.match(/<ShimmerSweep/g)?.length).toBe(1);
    expect(page.match(/<TextReveal/g)?.length).toBe(1);
    expect(page).toContain("triggerOnView");
  });
});
