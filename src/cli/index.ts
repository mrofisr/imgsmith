#!/usr/bin/env node

import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { color } from "./ui/logger.js";
import { doctor } from "./commands/doctor.js";
import { convert } from "../core/converter.js";
import { analyzeImage } from "../recommendation/engine.js";
import { convertMany } from "../core/converter.js";
import { readdir } from "node:fs/promises";
import { extname } from "node:path";
import { logger } from "./ui/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, "../../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

// Helper functions
function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function findImages(dir: string, recursive: boolean): Promise<string[]> {
  const images: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      images.push(...(await findImages(fullPath, recursive)));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

// Show help
function showHelp(): void {
  console.log(color.cyan("\nimgsmith - Forge optimized images for the modern web\n"));
  console.log(`Version: ${packageJson.version}\n`);
  console.log("Usage:");
  console.log("  imgsmith <command> [options]\n");
  console.log("Commands:");
  console.log("  doctor                    Check for required dependencies");
  console.log("  convert <input> [output]  Convert an image to optimized format");
  console.log("  analyze <input>           Analyze an image and get format recommendation");
  console.log("  optimize <directory>      Optimize all images in a directory\n");
  console.log("Options:");
  console.log("  -h, --help               Show help");
  console.log("  -v, --version            Show version\n");
  console.log("Examples:");
  console.log("  imgsmith doctor");
  console.log("  imgsmith convert photo.jpg --format avif --quality 30");
  console.log("  imgsmith analyze screenshot.png");
  console.log("  imgsmith optimize ./images -r -f webp\n");
}

// Main CLI logic
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "-h" || command === "--help") {
  showHelp();
  process.exit(0);
}

if (command === "-v" || command === "--version") {
  console.log(packageJson.version);
  process.exit(0);
}

// Handle commands
try {
  if (command === "doctor") {
    await doctor();
  } else if (command === "convert") {
    const { values, positionals } = parseArgs({
      args: args.slice(1),
      options: {
        format: { type: "string", short: "f", default: "auto" },
        quality: { type: "string", short: "q" },
        compare: { type: "boolean" },
      },
      allowPositionals: true,
    });

    const input = positionals[0];
    const output = positionals[1];

    if (!input) {
      logger.error("Input file required");
      console.log("\nUsage: imgsmith convert <input> [output] [options]");
      process.exit(1);
    }

    logger.header("Image Conversion");

    const result = await convert(input, output, {
      format: values.format as any,
      quality: values.quality ? parseInt(values.quality, 10) : undefined,
    });

    logger.success(`Converted to ${result.format.toUpperCase()}: ${result.output}`);

    if (values.compare) {
      console.log("\nSize Comparison:");
      const reduction =
        result.savings > 0
          ? color.green(`(-${result.savingsPercent.toFixed(1)}%)`)
          : color.red(`(+${Math.abs(result.savingsPercent).toFixed(1)}%)`);
      console.log(
        `  ${formatBytes(result.inputSize)} → ${formatBytes(result.outputSize)} ${reduction}`
      );
    }
  } else if (command === "analyze") {
    const input = args[1];
    if (!input) {
      logger.error("Input file required");
      console.log("\nUsage: imgsmith analyze <input>");
      process.exit(1);
    }

    logger.header("Image Analysis");

    const analysis = await analyzeImage(input);

    console.log(color.bold("\nImage Information:"));
    console.log(`  File: ${analysis.file}`);
    console.log(`  Format: ${analysis.currentFormat.toUpperCase()}`);
    console.log(`  Size: ${formatBytes(analysis.currentSize)}`);
    console.log(
      `  Dimensions: ${analysis.dimensions.width}x${analysis.dimensions.height}`
    );
    console.log(`  Type: ${color.cyan(analysis.imageType)}`);
    console.log(`  Transparency: ${analysis.hasTransparency ? "Yes" : "No"}`);
    console.log(`  Animation: ${analysis.hasAnimation ? "Yes" : "No"}`);

    console.log(color.bold("\nRecommendation:"));
    console.log(
      `  ${color.green("✓")} Format: ${color.green(analysis.recommendation.format.toUpperCase())}`
    );
    console.log(`  Reason: ${analysis.recommendation.reason}`);

    if (analysis.recommendation.alternatives.length > 0) {
      console.log(color.bold("\nAlternatives:"));
      for (const alt of analysis.recommendation.alternatives) {
        console.log(`  • ${alt.format.toUpperCase()}: ${color.dim(alt.reason)}`);
      }
    }
    console.log();
  } else if (command === "optimize") {
    const { values, positionals } = parseArgs({
      args: args.slice(1),
      options: {
        format: { type: "string", short: "f", default: "auto" },
        quality: { type: "string", short: "q" },
        recursive: { type: "boolean", short: "r" },
        concurrency: { type: "string", short: "c", default: "4" },
      },
      allowPositionals: true,
    });

    const directory = positionals[0];
    if (!directory) {
      logger.error("Directory required");
      console.log("\nUsage: imgsmith optimize <directory> [options]");
      process.exit(1);
    }

    logger.header("Batch Optimization");

    const images = await findImages(directory, values.recursive || false);

    if (images.length === 0) {
      logger.warn("No images found");
      process.exit(0);
    }

    logger.info(`Found ${images.length} image(s)`);

    const startTime = Date.now();
    const results = await convertMany(images, {
      format: values.format as any,
      quality: values.quality ? parseInt(values.quality, 10) : undefined,
      concurrency: parseInt(values.concurrency || "4", 10),
    });

    const endTime = Date.now();
    const totalInputSize = results.reduce((sum, r) => sum + r.inputSize, 0);
    const totalOutputSize = results.reduce((sum, r) => sum + r.outputSize, 0);
    const totalSavings = totalInputSize - totalOutputSize;
    const savingsPercent = (totalSavings / totalInputSize) * 100;

    console.log();
    logger.success(`Optimized ${results.length} image(s)`);
    console.log(
      `  ${formatBytes(totalInputSize)} → ${formatBytes(totalOutputSize)} ` +
        (totalSavings > 0
          ? color.green(`(-${savingsPercent.toFixed(1)}%)`)
          : color.red(`(+${Math.abs(savingsPercent).toFixed(1)}%)`))
    );
    console.log(`  Time: ${((endTime - startTime) / 1000).toFixed(2)}s`);
  } else {
    logger.error(`Unknown command: ${command}`);
    console.log("\nRun 'imgsmith --help' for usage information");
    process.exit(1);
  }
} catch (error) {
  const err = error as Error;
  logger.error(err.message);
  process.exit(1);
}
