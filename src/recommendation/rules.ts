import type { ImageFormat, ImageType } from "../core/types.js";

interface OptimizationRule {
  primary: ImageFormat;
  reason: string;
  alternatives: Array<{
    format: ImageFormat;
    reason: string;
  }>;
}

export const OPTIMIZATION_RULES: Record<ImageType, OptimizationRule> = {
  photo: {
    primary: "avif",
    reason: "AVIF provides 50% better compression than JPEG for photos",
    alternatives: [
      {
        format: "webp",
        reason: "Wider browser support, 30% better than JPEG",
      },
      { format: "jpeg", reason: "Universal support, use as fallback" },
    ],
  },
  graphic: {
    primary: "webp",
    reason: "WebP excels at graphics with flat colors and sharp edges",
    alternatives: [
      { format: "png", reason: "Best for graphics needing transparency" },
      { format: "avif", reason: "Good compression but slower to decode" },
    ],
  },
  screenshot: {
    primary: "webp",
    reason: "Screenshots benefit from WebP lossless or near-lossless mode",
    alternatives: [
      {
        format: "png",
        reason: "Lossless, good for text-heavy screenshots",
      },
      { format: "avif", reason: "Best compression if decode speed not critical" },
    ],
  },
  mixed: {
    primary: "webp",
    reason: "WebP provides good balance for mixed content",
    alternatives: [
      {
        format: "avif",
        reason: "Better compression, growing browser support",
      },
      { format: "jpeg", reason: "Safe fallback with wide support" },
    ],
  },
};

export const CWV_GUIDELINES = {
  lcp: {
    maxSize: 150 * 1024,
    preferredFormats: ["avif", "webp"] as ImageFormat[],
    note: "LCP images should be under 150KB for good performance",
  },
  cls: {
    requireDimensions: true,
    note: "Always specify width/height to prevent layout shift",
  },
};
