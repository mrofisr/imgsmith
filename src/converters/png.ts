import { run } from "../utils/exec.js";

export async function toPNG(
  input: string,
  output: string,
  quality = 100
): Promise<string> {
  // PNG is lossless, quality parameter is for signature consistency
  return run("magick", [input, output]);
}
