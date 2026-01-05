# Task: Implement Format Recommendation Rules

**Difficulty:** Medium
**Phase:** 3 - Recommendation Engine
**File:** `src/recommendation/rules.ts`

---

## Overview

Create the Core Web Vitals-focused rules for recommending image formats based on image type. Define which format is best for each image classification.

---

## High-Level Steps

1. Create rules.ts file
2. Define optimization rules for each image type
3. Include alternatives for each recommendation
4. Add Core Web Vitals guideline constants
5. Provide reasoning aligned with optimization best practices

---

## Detailed Checklist

### File Creation & Imports

- [ ] Create `src/recommendation/rules.ts`
- [ ] Import types: `ImageFormat`, `ImageType` from `../core/types`

### Define Optimization Rule Type

- [ ] Create interface `OptimizationRule`:
  - [ ] `primary: ImageFormat` - recommended format
  - [ ] `reason: string` - brief reason
  - [ ] `alternatives: Array<{ format: ImageFormat; reason: string }>` - fallback options

### Photo Rules

- [ ] Define rule for "photo" type:
  - [ ] Primary: AVIF (50% smaller than JPEG)
  - [ ] Alternatives: WebP (30% smaller), JPEG (fallback)
  - [ ] Include reasoning about entropy and color depth

### Graphic Rules

- [ ] Define rule for "graphic" type:
  - [ ] Primary: WebP (excellent for flat colors, sharp edges)
  - [ ] Alternatives: PNG (transparency), AVIF (compression)
  - [ ] Include reasoning about color count and sharpness

### Screenshot Rules

- [ ] Define rule for "screenshot" type:
  - [ ] Primary: WebP (near-lossless, text clarity)
  - [ ] Alternatives: PNG (lossless), AVIF (best compression)
  - [ ] Include reasoning about text and UI elements

### Mixed Content Rules

- [ ] Define rule for "mixed" type:
  - [ ] Primary: WebP (balanced approach)
  - [ ] Alternatives: AVIF (better compression), JPEG (wide support)
  - [ ] Include reasoning about versatility

### Core Web Vitals Guidelines

- [ ] Create `CWV_GUIDELINES` constant with:
  - [ ] LCP (Largest Contentful Paint):
    - [ ] `maxSize: 150 * 1024` (150KB target)
    - [ ] `preferredFormats: ["avif", "webp"]`
    - [ ] `note: string` explaining importance
  - [ ] CLS (Cumulative Layout Shift):
    - [ ] `requireDimensions: true`
    - [ ] `note: string` about preserving dimensions

### Export

- [ ] Create `OPTIMIZATION_RULES: Record<ImageType, OptimizationRule>`
- [ ] Include all four image type rules
- [ ] Export both OPTIMIZATION_RULES and CWV_GUIDELINES

---

## Code Template

```typescript
import type { ImageFormat, ImageType } from "../core/types";

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
    reason:
      "Screenshots benefit from WebP lossless or near-lossless mode",
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
```

---

## Notes

- Format recommendations are based on real-world performance data
- AVIF provides better compression but has slower decoding on some platforms
- Always provide alternatives in case primary format isn't suitable
- Core Web Vitals guidelines align with Google's performance standards
