import { run } from "../utils/exec";

export async function toWebP(
  input: string,
  output: string,
  quality = 80
) {
  return run("cwebp", ["-q", quality.toString(), input, "-o", output]);
}
