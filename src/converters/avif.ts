import { run } from "../utils/exec.js";

export async function toAVIF(
  input: string,
  output: string,
  quality = 30
) {
  return run("avifenc", ["-q", quality.toString(), input, output]);
}
