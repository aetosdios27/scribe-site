import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "../..");
const source = (path) => readFileSync(join(root, path), "utf8");

const BOOTSTRAP_COMMAND = "bunx @scribe-sdk/cli@beta integrate";
const DRY_RUN_COMMAND = "bunx @scribe-sdk/cli@beta integrate --dry-run";

const productionPaths = [
  "components/landing/install-command.ts",
  "components/landing/InstallCommandCopy.tsx",
  "components/landing/Header.tsx",
  "components/landing/Hero.tsx",
  "components/landing/FinalCta.tsx",
  "app/page.tsx",
].filter((path) => existsSync(join(root, path)));

describe("Scribe install command CTAs", () => {
  test("stores the exact bootstrap command once as the source of truth", () => {
    const constantPath = "components/landing/install-command.ts";
    expect(existsSync(join(root, constantPath))).toBe(true);
    if (!existsSync(join(root, constantPath))) return;

    const constant = source(constantPath);
    expect(constant).toContain(`"${BOOTSTRAP_COMMAND}"`);
    expect(constant).toContain(`"${DRY_RUN_COMMAND}"`);
    expect(constant).toContain(
      `"bun add --global @scribe-sdk/cli@beta"`,
    );

    const occurrences = productionPaths.reduce(
      (total, path) =>
        total +
        source(path).split(`"${BOOTSTRAP_COMMAND}"`).length -
        1,
      0,
    );
    expect(occurrences).toBe(1);
  });

  test("uses one Scribe-owned copy primitive in all three locations", () => {
    const componentPath = "components/landing/InstallCommandCopy.tsx";
    expect(existsSync(join(root, componentPath))).toBe(true);
    if (!existsSync(join(root, componentPath))) return;

    const component = source(componentPath);
    expect(component).toContain('variant: "nav" | "full"');
    expect(component).toContain("SCRIBE_BOOTSTRAP_COMMAND");
    expect(component).toContain('"install beta"');
    expect(component).toContain("Copy Scribe beta bootstrap command");

    const header = source("components/landing/Header.tsx");
    const hero = source("components/landing/Hero.tsx");
    const finalCta = source("components/landing/FinalCta.tsx");
    expect(header).toContain('<InstallCommandCopy variant="nav"');
    expect(hero).toContain('<InstallCommandCopy variant="full"');
    expect(finalCta).toContain('<InstallCommandCopy variant="full"');
    expect(hero).toContain("public beta");
  });

  test("adapts clipboard behavior with honest idle, success, and failure states", () => {
    const componentPath = "components/landing/InstallCommandCopy.tsx";
    expect(existsSync(join(root, componentPath))).toBe(true);
    if (!existsSync(join(root, componentPath))) return;

    const component = source(componentPath);
    expect(component).toContain("navigator.clipboard.writeText");
    expect(component).toContain("try {");
    expect(component).toContain("catch");
    expect(component).toContain('copiedAnnounce="Scribe install command copied"');
    expect(component).toContain('errorAnnounce="Copy failed.');
    expect(component).toContain('"copied"');
    expect(component).toContain('"copy failed"');
    expect(component).toContain("<CopyButton");
    expect(component).not.toContain('variant: "nav" | "full" | "compact"');

    const vendored = source("components/interior/copy-button.tsx");
    expect(vendored).toContain("useCopyToClipboard");
    expect(vendored).toContain("execCommand");
    expect(vendored).toContain('aria-live="polite"');
    expect(vendored).toContain('role="status"');
    expect(vendored).toContain('data-copy-state');
  });

  test("reports clipboard success and failure without changing the command", async () => {
    const { copyToClipboard } = await import(
      "./InstallCommandCopy.tsx"
    );
    expect(typeof copyToClipboard).toBe("function");

    let written = "";
    const success = await copyToClipboard(BOOTSTRAP_COMMAND, async (value) => {
      written = value;
    });
    expect(success).toBe("copied");
    expect(written).toBe(BOOTSTRAP_COMMAND);

    const failure = await copyToClipboard(BOOTSTRAP_COMMAND, async () => {
      throw new Error("permission denied");
    });
    expect(failure).toBe("failed");
  });

  test("keeps beta and waitlist language out of every CTA", () => {
    for (const path of productionPaths) {
      const content = source(path).toLowerCase();
      expect(content).not.toContain("join beta");
      expect(content).not.toContain("join the beta");
      expect(content).not.toContain("waitlist");
      expect(content).not.toContain("request access");
      expect(content).not.toContain("early access");
    }
  });

  test("keeps the old four-package command out of production UI", () => {
    for (const path of productionPaths) {
      expect(source(path)).not.toContain("bun add @scribe-sdk/react@alpha");
      expect(source(path)).not.toContain("bun add --dev @scribe-sdk/cli@alpha");
    }
  });

  test("pins every install command to the beta channel, never @latest", () => {
    // `latest` on npm is intentionally left pointed at an old alpha release
    // (see scribe's RELEASING.md) until a deliberate stable release moves
    // it — the automated publisher never does. A CTA that says "install
    // beta" but resolves `@latest` silently hands out a stale build.
    for (const path of productionPaths) {
      expect(source(path)).not.toContain("@scribe-sdk/cli@latest");
    }
  });
});
