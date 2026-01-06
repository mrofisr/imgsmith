import { run } from "../utils/exec.js";

export async function toWebP(
  input: string,
  output: string,
  quality = 80
): Promise<string> {
  return run("cwebp", ["-q", quality.toString(), input, "-o", output]);
}
