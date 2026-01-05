# Task: Create Unified Converter Interface

**Difficulty:** Medium
**Phase:** 2 - Core Conversion
**File:** `src/core/converter.ts`

---

## Overview

Implement a high-level conversion API that automatically selects the best format and delegates to the appropriate converter. This is the core of the library's functionality.

---

## High-Level Steps

1. Create converter.ts file with type imports
2. Create default quality constants for each format
3. Implement converter mapping to format converters
4. Create main `convert()` function with auto-format detection
5. Implement batch conversion with concurrency control
6. Add error handling and file size tracking

---

## Detailed Checklist

### File Creation & Imports

- [ ] Create `src/core/converter.ts`
- [ ] Import types from `./types.ts`
- [ ] Import individual converters: toWebP, toAVIF, toJPEG, toPNG
- [ ] Import `stat` from `fs/promises`
- [ ] Import `path` module

### Constants

- [ ] Create `DEFAULT_QUALITY` object:
  - [ ] `webp: 80`
  - [ ] `avif: 30`
  - [ ] `jpeg: 85`
  - [ ] `png: 100` (lossless)
- [ ] Create `CONVERTERS` mapping:
  - [ ] Maps each ImageFormat to its converter function

### Main Convert Function

- [ ] Create async `convert(input: string, output?: string, options?: ConvertOptions)`
  - [ ] Get input file stats using `stat(input)`
  - [ ] Extract input file size
  - [ ] Determine format:
    - [ ] If `options.format === "auto"` or not specified:
      - [ ] Call `recommendFormat(input)` (will implement later)
      - [ ] Use recommended format
    - [ ] Otherwise use specified format
  - [ ] Determine output path:
    - [ ] If output provided, use it
    - [ ] Otherwise: replace extension in input path
  - [ ] Get quality:
    - [ ] Use `options.quality` if provided
    - [ ] Otherwise use DEFAULT_QUALITY for format
  - [ ] Get appropriate converter and call it
  - [ ] Get output file size using `stat(outputPath)`
  - [ ] Calculate savings (inputSize - outputSize)
  - [ ] Calculate savings percentage
  - [ ] Return ConvertResult object

### Batch Conversion

- [ ] Create async `convertMany(files: string[], options?: ConvertOptions & { concurrency?: number })`
  - [ ] Get concurrency count (default: 4)
  - [ ] Batch files by concurrency size
  - [ ] For each batch, use Promise.all to convert in parallel
  - [ ] Collect results from all batches
  - [ ] Return array of ConvertResult

### Error Handling

- [ ] Wrap converter calls in try-catch
- [ ] Provide clear error messages for conversion failures
- [ ] Ensure output file is created before checking size

---

## Code Template

```typescript
import { stat } from "fs/promises";
import path from "path";
import type { ConvertOptions, ConvertResult, ImageFormat } from "./types";
import { toWebP } from "../converters/webp";
import { toAVIF } from "../converters/avif";
import { toJPEG } from "../converters/jpeg";
import { toPNG } from "../converters/png";

const DEFAULT_QUALITY: Record<ImageFormat, number> = {
  webp: 80,
  avif: 30,
  jpeg: 85,
  png: 100,
};

const CONVERTERS: Record<
  ImageFormat,
  (input: string, output: string, quality: number) => Promise<void>
> = {
  webp: toWebP,
  avif: toAVIF,
  jpeg: toJPEG,
  png: toPNG,
};

export async function convert(
  input: string,
  output?: string,
  options: ConvertOptions = {}
): Promise<ConvertResult> {
  const inputStat = await stat(input);
  const inputSize = inputStat.size;

  // Determine format
  let format: ImageFormat;
  if (options.format === "auto" || !options.format) {
    // TODO: Use recommendation engine
    format = "webp"; // Placeholder
  } else {
    format = options.format as ImageFormat;
  }

  // Determine output path
  const outputPath = output ?? input.replace(/\.[^.]+$/, `.${format}`);

  // Get quality
  const quality = options.quality ?? DEFAULT_QUALITY[format];

  // Convert
  const converter = CONVERTERS[format];
  if (!converter) {
    throw new Error(`Unknown format: ${format}`);
  }

  await converter(input, outputPath, quality);

  // Get output size
  const outputStat = await stat(outputPath);
  const outputSize = outputStat.size;

  return {
    input,
    output: outputPath,
    inputSize,
    outputSize,
    format,
    savings: inputSize - outputSize,
    savingsPercent: ((inputSize - outputSize) / inputSize) * 100,
  };
}

export async function convertMany(
  files: string[],
  options: ConvertOptions & { concurrency?: number } = {}
): Promise<ConvertResult[]> {
  const concurrency = options.concurrency ?? 4;
  const results: ConvertResult[] = [];

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((file) => convert(file, undefined, options))
    );
    results.push(...batchResults);
  }

  return results;
}
```

---

## Notes

- Default quality values are optimized for Core Web Vitals (AVIF lower quality for smaller size)
- Batch conversion uses concurrency control to avoid overwhelming the system
- Use Promise.all only within batches, not for all files
