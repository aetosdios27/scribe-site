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

  test("keeps the compact install alpha action in the header", () => {
    expect(header).toContain('<InstallCommandCopy variant="nav"');
    expect(header).toContain("sticky top-0");
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
