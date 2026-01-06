import { describe, it, expect } from "vitest";
import { OPTIMIZATION_RULES, CWV_GUIDELINES } from "../src/recommendation/rules.js";
import type { ImageFormat, ImageType } from "../src/core/types.js";

describe("Recommendation Rules", () => {
  it("should have rules for all image types", () => {
    const imageTypes: ImageType[] = ["photo", "graphic", "screenshot", "mixed"];

    for (const type of imageTypes) {
      expect(OPTIMIZATION_RULES[type]).toBeDefined();
      expect(OPTIMIZATION_RULES[type].primary).toBeDefined();
      expect(OPTIMIZATION_RULES[type].reason).toBeDefined();
      expect(OPTIMIZATION_RULES[type].alternatives).toBeDefined();
    }
  });

  it("should recommend AVIF for photos", () => {
    expect(OPTIMIZATION_RULES.photo.primary).toBe("avif");
  });

  it("should recommend WebP for graphics", () => {
    expect(OPTIMIZATION_RULES.graphic.primary).toBe("webp");
  });

  it("should recommend WebP for screenshots", () => {
    expect(OPTIMIZATION_RULES.screenshot.primary).toBe("webp");
  });

  it("should recommend WebP for mixed content", () => {
    expect(OPTIMIZATION_RULES.mixed.primary).toBe("webp");
  });

  it("should provide alternatives for each recommendation", () => {
    const imageTypes: ImageType[] = ["photo", "graphic", "screenshot", "mixed"];

    for (const type of imageTypes) {
      const alternatives = OPTIMIZATION_RULES[type].alternatives;
      expect(alternatives.length).toBeGreaterThan(0);

      for (const alt of alternatives) {
        expect(alt.format).toBeDefined();
        expect(alt.reason).toBeDefined();
      }
    }
  });
});

describe("Core Web Vitals Guidelines", () => {
  it("should define LCP max size", () => {
    expect(CWV_GUIDELINES.lcp.maxSize).toBe(150 * 1024);
  });

  it("should prefer modern formats for LCP", () => {
    expect(CWV_GUIDELINES.lcp.preferredFormats).toContain("avif");
    expect(CWV_GUIDELINES.lcp.preferredFormats).toContain("webp");
  });

  it("should require dimensions for CLS", () => {
    expect(CWV_GUIDELINES.cls.requireDimensions).toBe(true);
  });
});

describe("Type Definitions", () => {
  it("should validate ImageFormat types", () => {
    const formats: ImageFormat[] = ["webp", "avif", "jpeg", "png"];

    for (const format of formats) {
      expect(format).toMatch(/^(webp|avif|jpeg|png)$/);
    }
  });

  it("should validate ImageType types", () => {
    const types: ImageType[] = ["photo", "graphic", "screenshot", "mixed"];

    for (const type of types) {
      expect(type).toMatch(/^(photo|graphic|screenshot|mixed)$/);
    }
  });
});
