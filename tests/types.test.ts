import { describe, it, expect } from "vitest";
import type {
  ImageFormat,
  ImageType,
  ConvertOptions,
  ConvertResult,
  OptimizeOptions,
  OptimizeProgress,
  AnalyzeResult,
  FormatRecommendation,
} from "../src/core/types.js";

describe("Type Definitions", () => {
  describe("ImageFormat", () => {
    it("should accept valid image formats", () => {
      const formats: ImageFormat[] = ["webp", "avif", "jpeg", "png"];
      expect(formats).toHaveLength(4);
      expect(formats).toContain("webp");
      expect(formats).toContain("avif");
      expect(formats).toContain("jpeg");
      expect(formats).toContain("png");
    });
  });

  describe("ImageType", () => {
    it("should accept valid image types", () => {
      const types: ImageType[] = ["photo", "graphic", "screenshot", "mixed"];
      expect(types).toHaveLength(4);
      expect(types).toContain("photo");
      expect(types).toContain("graphic");
      expect(types).toContain("screenshot");
      expect(types).toContain("mixed");
    });
  });

  describe("ConvertOptions", () => {
    it("should accept format option", () => {
      const options: ConvertOptions = { format: "webp" };
      expect(options.format).toBe("webp");
    });

    it("should accept auto format", () => {
      const options: ConvertOptions = { format: "auto" };
      expect(options.format).toBe("auto");
    });

    it("should accept quality option", () => {
      const options: ConvertOptions = { quality: 85 };
      expect(options.quality).toBe(85);
    });

    it("should accept preserveOriginal option", () => {
      const options: ConvertOptions = { preserveOriginal: true };
      expect(options.preserveOriginal).toBe(true);
    });

    it("should allow all options together", () => {
      const options: ConvertOptions = {
        format: "avif",
        quality: 30,
        preserveOriginal: false,
      };
      expect(options).toBeDefined();
    });

    it("should allow empty options", () => {
      const options: ConvertOptions = {};
      expect(options).toBeDefined();
    });
  });

  describe("ConvertResult", () => {
    it("should have all required fields", () => {
      const result: ConvertResult = {
        input: "input.jpg",
        output: "output.webp",
        inputSize: 1000000,
        outputSize: 500000,
        format: "webp",
        savings: 500000,
        savingsPercent: 50,
      };

      expect(result.input).toBe("input.jpg");
      expect(result.output).toBe("output.webp");
      expect(result.inputSize).toBe(1000000);
      expect(result.outputSize).toBe(500000);
      expect(result.format).toBe("webp");
      expect(result.savings).toBe(500000);
      expect(result.savingsPercent).toBe(50);
    });
  });

  describe("OptimizeOptions", () => {
    it("should extend ConvertOptions", () => {
      const options: OptimizeOptions = {
        format: "webp",
        quality: 80,
        recursive: true,
        concurrency: 4,
      };

      expect(options.format).toBe("webp");
      expect(options.quality).toBe(80);
      expect(options.recursive).toBe(true);
      expect(options.concurrency).toBe(4);
    });

    it("should accept onProgress callback", () => {
      const callback = (progress: OptimizeProgress) => {
        expect(progress.current).toBeDefined();
      };

      const options: OptimizeOptions = {
        onProgress: callback,
      };

      expect(options.onProgress).toBe(callback);
    });

    it("should accept minSavingsPercent", () => {
      const options: OptimizeOptions = {
        minSavingsPercent: 10,
      };

      expect(options.minSavingsPercent).toBe(10);
    });
  });

  describe("OptimizeProgress", () => {
    it("should have progress tracking fields", () => {
      const progress: OptimizeProgress = {
        current: 5,
        total: 10,
        file: "image.jpg",
      };

      expect(progress.current).toBe(5);
      expect(progress.total).toBe(10);
      expect(progress.file).toBe("image.jpg");
    });

    it("should optionally include result", () => {
      const result: ConvertResult = {
        input: "input.jpg",
        output: "output.webp",
        inputSize: 1000,
        outputSize: 500,
        format: "webp",
        savings: 500,
        savingsPercent: 50,
      };

      const progress: OptimizeProgress = {
        current: 1,
        total: 1,
        file: "input.jpg",
        result,
      };

      expect(progress.result).toBe(result);
    });
  });

  describe("FormatRecommendation", () => {
    it("should have recommendation details", () => {
      const recommendation: FormatRecommendation = {
        format: "avif",
        reason: "Best for photos",
        explanation: "AVIF provides superior compression",
        alternatives: [
          { format: "webp", reason: "Good browser support" },
        ],
      };

      expect(recommendation.format).toBe("avif");
      expect(recommendation.reason).toBe("Best for photos");
      expect(recommendation.explanation).toBeDefined();
      expect(recommendation.alternatives).toHaveLength(1);
    });

    it("should optionally include estimated savings", () => {
      const recommendation: FormatRecommendation = {
        format: "webp",
        reason: "Efficient",
        explanation: "Good compression",
        estimatedSavings: 50000,
        alternatives: [],
      };

      expect(recommendation.estimatedSavings).toBe(50000);
    });
  });

  describe("AnalyzeResult", () => {
    it("should have all analysis fields", () => {
      const analysis: AnalyzeResult = {
        file: "photo.jpg",
        currentFormat: "JPEG",
        currentSize: 2000000,
        imageType: "photo",
        hasTransparency: false,
        hasAnimation: false,
        dimensions: { width: 1920, height: 1080 },
        recommendation: {
          format: "avif",
          reason: "Best compression",
          explanation: "AVIF is optimal for photos",
          alternatives: [],
        },
      };

      expect(analysis.file).toBe("photo.jpg");
      expect(analysis.currentFormat).toBe("JPEG");
      expect(analysis.currentSize).toBe(2000000);
      expect(analysis.imageType).toBe("photo");
      expect(analysis.hasTransparency).toBe(false);
      expect(analysis.hasAnimation).toBe(false);
      expect(analysis.dimensions.width).toBe(1920);
      expect(analysis.dimensions.height).toBe(1080);
      expect(analysis.recommendation).toBeDefined();
    });
  });
});
