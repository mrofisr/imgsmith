import { run } from "../utils/exec";

export async function toPNG(input: string, output: string) {
  return run("magick", [input, output]);
}
