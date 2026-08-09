import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "./Footer";

describe("Footer", () => {
  test("renders the restrained public-alpha footer contract", () => {
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain('aria-label="scribe footer"');
    expect(html).toContain("footer-simple");
    expect(html).toContain("footer-brand-wordmark");
    expect(html).toContain("developer-native publishing for your own site.");
    expect(html).toContain("aetosdios27@gmail.com");
    expect(html).toContain('href="/roadmap"');
    expect(html).toContain(
      'href="https://github.com/aetosdios27/scribe/blob/main/CONTRIBUTING.md"',
    );
    expect(html).toContain(">Roadmap<");
    expect(html).toContain(">Contributing<");
    expect(html).toContain(
      'href="https://github.com/aetosdios27/scribe"',
    );
    expect(html).toContain(">GitHub<");
    expect(html).toContain("© ");
    expect(html).toContain(" Scribe");

    expect(html).not.toContain('href="#"');
    expect(html).not.toContain(">X<");
    expect(html).not.toContain("Scribe, Inc.");
    expect(html).not.toContain('href="/privacy"');
    expect(html).not.toContain('href="/terms"');

    expect(html).not.toContain("press active");
    expect(html).not.toContain("status");
    expect(html).not.toContain("footer-wordmark-ink");
    expect(html).not.toContain("footer-field-layer");
    expect(html).not.toContain("join the beta");
  });
});
