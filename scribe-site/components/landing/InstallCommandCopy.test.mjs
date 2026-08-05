import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "../..");
const source = (path) => readFileSync(join(root, path), "utf8");
const command =
  "bun add @scribe-sdk/react@alpha @scribe-sdk/styles@alpha @scribe-sdk/mdx@alpha && bun add --dev @scribe-sdk/cli@alpha";

describe("Scribe install command CTAs", () => {
  test("stores the exact public-alpha command once in production source", () => {
    const constantPath = "components/landing/install-command.ts";
    expect(existsSync(join(root, constantPath))).toBe(true);
    if (!existsSync(join(root, constantPath))) return;

    expect(source(constantPath)).toContain(command);
    const productionPaths = [
      "components/landing/install-command.ts",
      "components/landing/InstallCommandCopy.tsx",
      "components/smoothui/button-copy/index.tsx",
      "components/landing/Header.tsx",
      "components/landing/Hero.tsx",
      "components/landing/FinalCta.tsx",
    ].filter((path) => existsSync(join(root, path)));
    const occurrences = productionPaths.reduce(
      (total, path) => total + source(path).split(command).length - 1,
      0,
    );
    expect(occurrences).toBe(1);
  });

  test("uses one accessible Scribe-owned copy primitive in all three locations", () => {
    const componentPath = "components/landing/InstallCommandCopy.tsx";
    expect(existsSync(join(root, componentPath))).toBe(true);
    if (!existsSync(join(root, componentPath))) return;

    const component = source(componentPath);
    expect(component).toContain("ButtonCopy");
    expect(component).toContain("SCRIBE_INSTALL_COMMAND");
    expect(component).toContain('variant: "nav" | "full"');

    const header = source("components/landing/Header.tsx");
    const hero = source("components/landing/Hero.tsx");
    const finalCta = source("components/landing/FinalCta.tsx");
    expect(header).toContain('<InstallCommandCopy variant="nav"');
    expect(hero).toContain('<InstallCommandCopy variant="full"');
    expect(finalCta).toContain('<InstallCommandCopy variant="full"');
    expect(hero).toContain("public alpha is live");

    for (const content of [header, hero, finalCta]) {
      expect(content.toLowerCase()).not.toContain("join beta");
      expect(content.toLowerCase()).not.toContain("join the beta");
      expect(content.toLowerCase()).not.toContain("request access");
      expect(content.toLowerCase()).not.toContain("early access");
      expect(content.toLowerCase()).not.toContain("waitlist");
    }
  });

  test("adapts Button Copy with honest idle, success, and failure states", () => {
    const buttonPath = "components/smoothui/button-copy/index.tsx";
    expect(existsSync(join(root, buttonPath))).toBe(true);
    if (!existsSync(join(root, buttonPath))) return;

    const button = source(buttonPath);
    expect(button).toContain("navigator.clipboard.writeText");
    expect(button).toContain("try {");
    expect(button).toContain("catch");
    expect(button).toContain('aria-label="Copy Scribe alpha install command"');
    expect(button).toContain('aria-live="polite"');
    expect(button).toContain('"copy"');
    expect(button).toContain('"copied"');
    expect(button).toContain('"copy failed"');
    expect(button).toContain("<button");
    expect(button).not.toContain("execCommand");
  });

  test("reports clipboard success and failure without changing the command", async () => {
    const buttonPath = "components/smoothui/button-copy/index.tsx";
    expect(existsSync(join(root, buttonPath))).toBe(true);
    if (!existsSync(join(root, buttonPath))) return;

    const { copyToClipboard } = await import("../smoothui/button-copy/index.tsx");
    expect(typeof copyToClipboard).toBe("function");

    let written = "";
    const success = await copyToClipboard(command, async (value) => {
      written = value;
    });
    expect(success).toBe("copied");
    expect(written).toBe(command);

    const failure = await copyToClipboard(command, async () => {
      throw new Error("permission denied");
    });
    expect(failure).toBe("failed");
  });
});
