# Task: Define Core TypeScript Types

**Difficulty:** Easy
**Phase:** 2 - Core Conversion
**File:** `src/core/types.ts`

---

## Overview

Create the core TypeScript interfaces and types used throughout the library. These types define the contract for conversion, optimization, and analysis operations.

---

## High-Level Steps

1. Create core types file
2. Define image format type (webp, avif, jpeg, png)
3. Define image type classifier (photo, graphic, screenshot, mixed)
4. Define conversion options and results
5. Define optimization options and progress tracking
6. Define analysis results and recommendations

---

## Detailed Checklist

### File Creation

- [ ] Create `src/core/types.ts`

### Basic Type Definitions

- [ ] Define `type ImageFormat = "webp" | "avif" | "jpeg" | "png"`
- [ ] Define `type ImageType = "photo" | "graphic" | "screenshot" | "mixed"`

### Conversion Types

- [ ] Create interface `ConvertOptions`:
  - [ ] `format?: ImageFormat | "auto"` - target format
  - [ ] `quality?: number` - quality 1-100
  - [ ] `preserveOriginal?: boolean` - keep original file
- [ ] Create interface `ConvertResult`:
  - [ ] `input: string` - input file path
  - [ ] `output: string` - output file path
  - [ ] `inputSize: number` - input file size in bytes
  - [ ] `outputSize: number` - output file size in bytes
  - [ ] `format: ImageFormat` - actual format used
  - [ ] `savings: number` - bytes saved
  - [ ] `savingsPercent: number` - percentage saved

### Optimization Types

- [ ] Create interface `OptimizeOptions extends ConvertOptions`:
  - [ ] `recursive?: boolean` - include subdirectories
  - [ ] `concurrency?: number` - parallel conversions
  - [ ] `minSavingsPercent?: number` - skip if savings below threshold
  - [ ] `onProgress?: (progress: OptimizeProgress) => void` - callback
- [ ] Create interface `OptimizeProgress`:
  - [ ] `current: number` - current file index
  - [ ] `total: number` - total files
  - [ ] `file: string` - current filename
  - [ ] `result?: ConvertResult` - conversion result if available

### Analysis Types

- [ ] Create interface `AnalyzeResult`:
  - [ ] `file: string` - file path
  - [ ] `currentFormat: string` - detected format
  - [ ] `currentSize: number` - current file size
  - [ ] `imageType: ImageType` - classified type
  - [ ] `hasTransparency: boolean` - has alpha channel
  - [ ] `hasAnimation: boolean` - is animated
  - [ ] `dimensions: { width: number; height: number }` - image dimensions
  - [ ] `recommendation: FormatRecommendation` - recommended format
- [ ] Create interface `FormatRecommendation`:
  - [ ] `format: ImageFormat` - recommended format
  - [ ] `reason: string` - brief reason
  - [ ] `explanation: string` - detailed explanation
  - [ ] `estimatedSavings?: number` - estimated byte savings
  - [ ] `alternatives: Array<{ format: ImageFormat; reason: string }>` - other options

---

## Code Template

```typescript
export type ImageFormat = "webp" | "avif" | "jpeg" | "png";
export type ImageType = "photo" | "graphic" | "screenshot" | "mixed";

export interface ConvertOptions {
  format?: ImageFormat | "auto";
  quality?: number;
  preserveOriginal?: boolean;
}

export interface ConvertResult {
  input: string;
  output: string;
  inputSize: number;
  outputSize: number;
  format: ImageFormat;
  savings: number;
  savingsPercent: number;
}

export interface OptimizeOptions extends ConvertOptions {
  recursive?: boolean;
  concurrency?: number;
  minSavingsPercent?: number;
  onProgress?: (progress: OptimizeProgress) => void;
}

export interface OptimizeProgress {
  current: number;
  total: number;
  file: string;
  result?: ConvertResult;
}

export interface AnalyzeResult {
  file: string;
  currentFormat: string;
  currentSize: number;
  imageType: ImageType;
  hasTransparency: boolean;
  hasAnimation: boolean;
  dimensions: { width: number; height: number };
  recommendation: FormatRecommendation;
}

export interface FormatRecommendation {
  format: ImageFormat;
  reason: string;
  explanation: string;
  estimatedSavings?: number;
  alternatives: Array<{
    format: ImageFormat;
    reason: string;
  }>;
}
```

---

## Notes

- Use clear, self-documenting type names
- Include optional fields for flexibility
- These types will be imported throughout the codebase
