import { Command } from "commander";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { convertMany } from "../../core/converter.js";
import { logger } from "../ui/logger.js";
import type { ConvertOptions } from "../../core/types.js";
import pc from "picocolors";

interface OptimizeCommandOptions {
  format: string;
  quality?: string;
  recursive?: boolean;
  concurrency?: string;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

export const optimizeCommand = new Command()
  .name("optimize")
  .description("Optimize all images in a directory")
  .argument("<directory>", "Directory containing images")
  .option(
    "-f, --format <format>",
    "Output format: webp, avif, jpeg, png, auto",
    "auto"
  )
  .option("-q, --quality <number>", "Quality 1-100 (depends on format)")
  .option("-r, --recursive", "Process subdirectories recursively")
  .option(
    "-c, --concurrency <number>",
    "Number of concurrent conversions",
    "4"
  )
  .action(
    async (directory: string, options: OptimizeCommandOptions) => {
      try {
        logger.header("Batch Optimization");

        // Validate directory exists
        let dirStat;
        try {
          dirStat = await stat(directory);
        } catch {
          logger.error(`Directory not found: ${directory}`);
          process.exit(1);
        }

        if (!dirStat.isDirectory()) {
          logger.error(`Not a directory: ${directory}`);
          process.exit(1);
        }

        // Find all image files
        const files = await findImageFiles(directory, options.recursive);

        if (files.length === 0) {
          logger.warn(`No image files found in ${directory}`);
          return;
        }

        logger.info(`Found ${files.length} image(s) to optimize`);
        console.log();

        const convertOptions: ConvertOptions & { concurrency?: number } = {
          format: options.format as ConvertOptions["format"],
          quality: options.quality ? parseInt(options.quality, 10) : undefined,
          concurrency: parseInt(options.concurrency, 10),
        };

        const startTime = Date.now();
        const results = await convertMany(files, convertOptions);
        const endTime = Date.now();

        // Calculate statistics
        const totalInputSize = results.reduce((sum, r) => sum + r.inputSize, 0);
        const totalOutputSize = results.reduce(
          (sum, r) => sum + r.outputSize,
          0
        );
        const totalSavings = totalInputSize - totalOutputSize;
        const savingsPercent = (totalSavings / totalInputSize) * 100;

        // Display results
        console.log();
        logger.success(`Optimized ${results.length} image(s)`);
        console.log(
          `  ${formatBytes(totalInputSize)} → ${formatBytes(totalOutputSize)} ` +
            (totalSavings > 0
              ? pc.green(`(-${savingsPercent.toFixed(1)}%)`)
              : pc.red(`(+${Math.abs(savingsPercent).toFixed(1)}%)`))
        );
        console.log(`  Time: ${((endTime - startTime) / 1000).toFixed(2)}s`);
      } catch (error) {
        const err = error as Error;
        logger.error(`Optimization failed: ${err.message}`);
        process.exit(1);
      }
    }
  );

async function findImageFiles(
  directory: string,
  recursive = false
): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory() && recursive) {
      const subFiles = await findImageFiles(fullPath, recursive);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
