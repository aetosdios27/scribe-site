import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const path = join(import.meta.dir, "ProductFilm.tsx");

describe("ProductFilm", () => {
  test("uses safe native autoplay markup with a poster and fallback", () => {
    expect(existsSync(path)).toBe(true);
    if (!existsSync(path)) return;

    const source = readFileSync(path, "utf8");
    expect(source).toContain('id="product"');
    expect(source).toContain("Scribe, running on a real site.");
    expect(source).toContain("autoPlay");
    expect(source).toContain("muted");
    expect(source).toContain("loop");
    expect(source).toContain("playsInline");
    expect(source).toContain('/media/scribe-product-film-poster.webp');
    expect(source).toContain('/media/scribe-product-film.webm');
    expect(source).toContain('/media/scribe-product-film.mp4');
    expect(source).toContain('type="video/webm"');
    expect(source).toContain('type="video/mp4"');
    expect(source).not.toMatch(/\scontrols(?:=|\s|>)/);
  });

  test("pauses offscreen and autoplays when visible", () => {
    expect(existsSync(path)).toBe(true);
    if (!existsSync(path)) return;

    const source = readFileSync(path, "utf8");
    expect(source).toContain("IntersectionObserver");
    expect(source).toContain("threshold: 0.15");
    expect(source).toContain("video.pause()");
    expect(source).toContain("video.play()");
    expect(source).toContain('href="/media/scribe-product-film.mp4"');
  });
});

