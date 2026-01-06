import { stat } from "node:fs/promises";
import type { ConvertOptions, ConvertResult, ImageFormat } from "./types.js";
import { toWebP } from "../converters/webp.js";
import { toAVIF } from "../converters/avif.js";
import { toJPEG } from "../converters/jpeg.js";
import { toPNG } from "../converters/png.js";

const DEFAULT_QUALITY: Record<ImageFormat, number> = {
  webp: 80,
  avif: 30,
  jpeg: 85,
  png: 100,
};

const CONVERTERS: Record<
  ImageFormat,
  (input: string, output: string, quality: number) => Promise<string>
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
    // TODO: Use recommendation engine (Phase 3)
    // For now, default to webp as it has best compatibility/size balance
    format = "webp";
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

  const savings = inputSize - outputSize;
  const savingsPercent = (savings / inputSize) * 100;

  return {
    input,
    output: outputPath,
    inputSize,
    outputSize,
    format,
    savings,
    savingsPercent,
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
