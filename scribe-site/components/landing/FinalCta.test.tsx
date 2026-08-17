import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FinalCta } from "./FinalCta";

describe("FinalCta", () => {
  test("closes with the approved statement and public-beta install action", () => {
    const html = renderToStaticMarkup(<FinalCta />);

    expect(html).toContain("final-cta-inner");
    expect(html).toContain("final-cta-action");
    expect(html).toContain("stop fighting your frontend.");
    expect(html).toContain("start publishing what matters.");
    expect(html).toContain("install the public beta");
    expect(html).toContain("Copy Scribe beta bootstrap command");
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("no credit card");
    expect(html).not.toContain("lg:items-end");
    expect(html).not.toContain("final-mark");
  });
});
