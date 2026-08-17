import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => {
  const url = new URL(path, import.meta.url);
  return existsSync(url) ? readFileSync(url, "utf8") : "";
};

describe("faq section", () => {
  const faq = read("./Faq.tsx");
  const accordion = read("../interior/accordion.tsx");
  const content = read("./content.ts");
  const page = read("../../app/page.tsx");
  const styles = read("../../app/globals.css");

  test("mounts between the technical proof and the final cta", () => {
    expect(page).toContain('<TechnicalProof />');
    expect(page).toContain('<Faq />');
    expect(page).toContain('<FinalCta />');
    expect(page.indexOf("<TechnicalProof />")).toBeLessThan(
      page.indexOf("<Faq />"),
    );
    expect(page.indexOf("<Faq />")).toBeLessThan(page.indexOf("<FinalCta />"));
  });

  test("uses the vendored single-open accordion with all-closed defaults", () => {
    expect(faq).toContain("Accordion");
    expect(faq).toContain('type="single"');
    expect(faq).not.toContain('defaultOpen=');
    expect(accordion).toContain("useAccordion");
    expect(accordion).toContain('aria-expanded');
    expect(accordion).toContain('aria-controls');
    expect(accordion).toContain("ArrowDown");
    expect(accordion).toContain("inert");
    expect(accordion).toContain("useReducedMotion");
  });

  test("answers the objections a dev hits before installing", () => {
    expect(content).toContain("is scribe free?");
    expect(content).toContain("what happens to my content?");
    expect(content).toContain("do i need a frontend?");
    expect(content).toContain("which frameworks does it support?");
    expect(content).toContain("is it ready for production?");
    expect(content).toContain("how do i contribute?");
  });

  test("follows the section anatomy with mono marker and display heading", () => {
    expect(faq).toContain("SectionLabel");
    expect(faq).toContain("faq-dark");
    expect(faq).toContain("faq-dark-grid");
    expect(faq).toContain('aria-labelledby="faq-heading"');
    expect(styles).toContain(".faq-dark");
    expect(styles).toContain(".faq-dark-grid");
    expect(styles).toContain(".faq-dark-copy");
  });
});