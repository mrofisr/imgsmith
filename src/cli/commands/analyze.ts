import { Command } from "commander";
import { stat } from "node:fs/promises";
import { analyzeImage } from "../../recommendation/engine.js";
import { logger } from "../ui/logger.js";
import pc from "picocolors";

export const analyzeCommand = new Command()
  .name("analyze")
  .description("Analyze an image and get format recommendation")
  .argument("<input>", "Input image file to analyze")
  .action(async (input: string) => {
    try {
      logger.header("Image Analysis");

      // Validate input file exists
      try {
        await stat(input);
      } catch {
        logger.error(`Input file not found: ${input}`);
        process.exit(1);
      }

      const analysis = await analyzeImage(input);

      // Display image information
      console.log(pc.bold("\nImage Information:"));
      console.log(`  File: ${analysis.file}`);
      console.log(`  Format: ${analysis.currentFormat.toUpperCase()}`);
      console.log(`  Size: ${formatBytes(analysis.currentSize)}`);
      console.log(
        `  Dimensions: ${analysis.dimensions.width}x${analysis.dimensions.height}`
      );
      console.log(`  Type: ${pc.cyan(analysis.imageType)}`);
      console.log(`  Transparency: ${analysis.hasTransparency ? "Yes" : "No"}`);
      console.log(`  Animation: ${analysis.hasAnimation ? "Yes" : "No"}`);

      // Display recommendation
      console.log(pc.bold("\nRecommendation:"));
      console.log(
        `  ${pc.green("✓")} Format: ${pc.green(analysis.recommendation.format.toUpperCase())}`
      );
      console.log(`  Reason: ${analysis.recommendation.reason}`);

      // Display alternatives
      if (analysis.recommendation.alternatives.length > 0) {
        console.log(pc.bold("\nAlternatives:"));
        for (const alt of analysis.recommendation.alternatives) {
          console.log(
            `  • ${alt.format.toUpperCase()}: ${pc.dim(alt.reason)}`
          );
        }
      }

      console.log(); // Empty line for spacing
    } catch (error) {
      const err = error as Error;
      logger.error(`Analysis failed: ${err.message}`);
      process.exit(1);
    }
  });

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
