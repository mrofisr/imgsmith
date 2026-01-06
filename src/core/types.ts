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
