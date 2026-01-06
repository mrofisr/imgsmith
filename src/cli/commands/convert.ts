import { Command } from "commander";
import { stat } from "node:fs/promises";
import { convert } from "../../core/converter.js";
import { logger } from "../ui/logger.js";
import type { ConvertOptions } from "../../core/types.js";
import pc from "picocolors";

interface ConvertCommandOptions {
  format: string;
  quality?: string;
  compare?: boolean;
}

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
  .option("-q, --quality <number>", "Quality 1-100 (depends on format)")
  .option("--compare", "Show before/after comparison")
  .action(
    async (
      input: string,
      output: string | undefined,
      options: ConvertCommandOptions
    ) => {
      try {
        logger.header("Image Conversion");

        // Validate input file exists
        try {
          await stat(input);
        } catch {
          logger.error(`Input file not found: ${input}`);
          process.exit(1);
        }

        const convertOptions: ConvertOptions = {
          format: options.format as ConvertOptions["format"],
          quality: options.quality ? parseInt(options.quality, 10) : undefined,
        };

        const result = await convert(input, output, convertOptions);

        logger.success(
          `Converted to ${result.format.toUpperCase()}: ${result.output}`
        );

        if (options.compare) {
          console.log("\nSize Comparison:");
          const reduction =
            result.savings > 0
              ? pc.green(`(-${result.savingsPercent.toFixed(1)}%)`)
              : pc.red(`(+${Math.abs(result.savingsPercent).toFixed(1)}%)`);

          console.log(
            `  ${formatBytes(result.inputSize)} → ${formatBytes(result.outputSize)} ${reduction}`
          );
        }
      } catch (error) {
        const err = error as Error;
        logger.error(`Conversion failed: ${err.message}`);
        process.exit(1);
      }
    }
  );

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
