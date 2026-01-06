import type { ImageFormat } from "../core/types.js";
import { analyzeImage } from "./analyzer.js";

export async function recommendFormat(filePath: string): Promise<ImageFormat> {
  const analysis = await analyzeImage(filePath);
  return analysis.recommendation.format;
}

export { analyzeImage } from "./analyzer.js";
export { OPTIMIZATION_RULES, CWV_GUIDELINES } from "./rules.js";
