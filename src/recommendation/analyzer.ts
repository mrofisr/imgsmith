import { stat } from "node:fs/promises";
import { run } from "../utils/exec.js";
import type { ImageType, AnalyzeResult, FormatRecommendation } from "../core/types.js";
import { OPTIMIZATION_RULES } from "./rules.js";

interface ImageMagickInfo {
  format: string;
  width: number;
  height: number;
  hasAlpha: boolean;
  colorspace: string;
  colors: number;
}

async function getImageInfo(filePath: string): Promise<ImageMagickInfo> {
  // Use ImageMagick identify to get image properties
  // Format: format width height alpha colorspace colors
  const output = await run("magick", [
    "identify",
    "-format",
    "%m %w %h %A %[colorspace] %k",
    filePath,
  ]);

  const parts = output.trim().split(" ");
  if (parts.length < 6) {
    throw new Error(`Unable to identify image: ${filePath}`);
  }

  return {
    format: parts[0]?.toLowerCase() || "unknown",
    width: parseInt(parts[1] || "0", 10),
    height: parseInt(parts[2] || "0", 10),
    hasAlpha: parts[3] === "True",
    colorspace: parts[4] || "unknown",
    colors: parseInt(parts[5] || "0", 10),
  };
}

function classifyImageType(info: ImageMagickInfo): ImageType {
  const { colors, colorspace, width, height } = info;
  const totalPixels = width * height;
  const colorRatio = totalPixels > 0 ? colors / totalPixels : 0;

  // Screenshot: Low color count relative to pixel count, typically RGB
  if (colorRatio < 0.01 && colorspace === "sRGB") {
    return "screenshot";
  }

  // Graphic: Low absolute color count, sharp edges
  if (colors < 256) {
    return "graphic";
  }

  // Photo: High color count, continuous tones
  if (colorRatio > 0.05 || colorspace === "YCbCr") {
    return "photo";
  }

  // Mixed: Everything else
  return "mixed";
}

export async function analyzeImage(filePath: string): Promise<AnalyzeResult> {
  const [info, stats] = await Promise.all([
    getImageInfo(filePath),
    stat(filePath),
  ]);

  const imageType = classifyImageType(info);
  const rule = OPTIMIZATION_RULES[imageType];

  if (!rule) {
    throw new Error(`No optimization rule found for image type: ${imageType}`);
  }

  const recommendation: FormatRecommendation = {
    format: rule.primary,
    reason: rule.reason,
    explanation: `Based on image analysis, this ${imageType} would benefit most from ${rule.primary.toUpperCase()} format. ${rule.reason}`,
    alternatives: rule.alternatives,
  };

  return {
    file: filePath,
    currentFormat: info.format,
    currentSize: stats.size,
    imageType,
    hasTransparency: info.hasAlpha,
    hasAnimation: false, // TODO: Detect animation in future version
    dimensions: {
      width: info.width,
      height: info.height,
    },
    recommendation,
  };
}
