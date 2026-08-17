import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

describe("Header navigation accessibility", () => {
  const header = readFileSync(
    new URL("./Header.tsx", import.meta.url),
    "utf8",
  );
  const publicNavLinkUrl = new URL("./PublicNavLink.tsx", import.meta.url);
  const publicNavLink = existsSync(publicNavLinkUrl)
    ? readFileSync(publicNavLinkUrl, "utf8")
    : "";

  test("uses a native details/summary disclosure for the narrow menu", () => {
    expect(header).toContain("<details");
    expect(header).toContain("<summary");
    expect(header).toContain('aria-label="open navigation menu"');
    expect(header).toContain('aria-label="mobile"');
    expect(header).toContain('aria-label="primary"');
    expect(header).toContain("md:hidden");
  });

  test("keeps the compact install beta action in the header", () => {
    expect(header).toContain('<InstallCommandCopy variant="nav"');
    expect(header).toContain("sticky top-0");
  });

  test("hides on scroll down via the vendored hide-on-scroll hook", () => {
    expect(header).toContain("useHideOnScroll");
    expect(header).toContain("animate={{ y: hidden ? \"-100%\" : 0 }}");
    const hook = readFileSync(
      new URL("../interior/hide-on-scroll.ts", import.meta.url),
      "utf8",
    );
    expect(hook).toContain("useHideOnScroll");
    expect(hook).toContain("requestAnimationFrame");
  });

  test("ships a star-on-github action beside the install button", () => {
    expect(header).toContain("star scribe on github");
    expect(header).toContain("github.com/aetosdios27/scribe");
    expect(header).toContain('target="_blank"');
    expect(header).toContain('rel="noreferrer"');
    expect(header).toContain('name="star"');
  });

  test("carries no beta or waitlist language", () => {
    const lower = header.toLowerCase();
    expect(lower).not.toContain("join beta");
    expect(lower).not.toContain("waitlist");
    expect(lower).not.toContain("request access");
  });

  test("marks the current internal destination in cobalt with white text", () => {
    expect(header).toContain("<PublicNavLink");
    expect(publicNavLink).toContain("usePathname");
    expect(publicNavLink).toContain('aria-current={isCurrent ? "page" : undefined}');
    expect(publicNavLink).toContain("bg-scribe-cobalt");
    expect(publicNavLink).toContain("text-scribe-white");
  });
});