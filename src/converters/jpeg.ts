import { run } from "../utils/exec.js";

export async function toJPEG(
  input: string,
  output: string,
  quality = 85
): Promise<string> {
  return run("magick", [input, "-quality", quality.toString(), output]);
}
