# Task: Implement Convert CLI Command

**Difficulty:** Easy
**Phase:** 4 - CLI Polish
**File:** `src/cli/commands/convert.ts`

---

## Overview

Create the `imgsmith convert` command for converting individual images with options for format, quality, and comparison display.

---

## High-Level Steps

1. Create convert.ts command file
2. Define command options: format, quality, compare
3. Implement conversion logic using core converter
4. Display before/after comparison
5. Show success message with file sizes

---

## Detailed Checklist

### File Creation & Imports

- [ ] Create `src/cli/commands/convert.ts`
- [ ] Import `Command` from commander
- [ ] Import `convert` from `../../core/converter`
- [ ] Import logger from `../ui/logger`
- [ ] Import `stat` from `fs/promises`

### Command Setup

- [ ] Create new Command instance
- [ ] Set command: `"convert <input> [output]"`
- [ ] Set description: "Convert an image to optimized format"
- [ ] Add option `-f, --format <format>`:
  - [ ] Description: "Output format (webp|avif|jpeg|png|auto)"
  - [ ] Default: "auto"
- [ ] Add option `-q, --quality <number>`:
  - [ ] Description: "Quality 1-100"
  - [ ] Optional
- [ ] Add option `--compare`:
  - [ ] Description: "Show before/after comparison"
  - [ ] Boolean flag

### Action Handler

- [ ] Implement async action handler:
  - [ ] Parameters: input, output (optional), options
  - [ ] Validate input file exists
  - [ ] Build ConvertOptions from command options
  - [ ] Call `convert(input, output, options)`
  - [ ] Get input file size
  - [ ] Log success message with output format
  - [ ] If `--compare` flag, display comparison table
  - [ ] Show file size reduction percentage

### Comparison Display

- [ ] Create helper function to format bytes (B, KB, MB)
- [ ] Show original size and format
- [ ] Show new size and format
- [ ] Show reduction percentage in green (positive) or red (negative)

### Error Handling

- [ ] Check if input file exists
- [ ] Handle conversion errors gracefully
- [ ] Show helpful error messages

---

## Code Template

```typescript
import { Command } from "commander";
import { stat } from "fs/promises";
import { convert } from "../../core/converter";
import { logger } from "../ui/logger";
import type { ConvertOptions } from "../../core/types";
import pc from "picocolors";

export const convertCommand = new Command()
  .name("convert")
  .description("Convert an image to optimized format")
  .argument("<input>", "Input image file")
  .argument("[output]", "Output image file (optional)")
  .option(
    "-f, --format <format>",
    "Output format: webp, avif, jpeg, png, auto",
    "auto"
  )
  .option(
    "-q, --quality <number>",
    "Quality 1-100 (depends on format)"
  )
  .option("--compare", "Show before/after comparison")
  .action(async (input: string, output: string | undefined, options: any) => {
    try {
      logger.header("Image Conversion");

      const convertOptions: ConvertOptions = {
        format: options.format,
        quality: options.quality ? parseInt(options.quality) : undefined,
      };

      const result = await convert(input, output, convertOptions);

      logger.success(
        `Converted to ${result.format.toUpperCase()}: ${result.output}`
      );

      if (options.compare) {
        console.log("\nSize Comparison:");
        console.log(
          `  ${formatBytes(result.inputSize)} → ${formatBytes(result.outputSize)} ` +
            pc.green(`(-${result.savingsPercent.toFixed(1)}%)`)
        );
      }
    } catch (error: any) {
      logger.error(`Conversion failed: ${error.message}`);
      process.exit(1);
    }
  });

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
```

---

## Testing

- [ ] Test converting with auto-format detection
- [ ] Test converting with specific format
- [ ] Test quality option
- [ ] Test --compare flag shows size reduction
- [ ] Test with missing input file shows error
