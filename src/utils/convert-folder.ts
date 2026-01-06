import fs from "node:fs/promises";
import path from "node:path";

type Converter = (input: string, output: string) => Promise<string>;

export async function convertFolder(
  inputDir: string,
  outputDir: string,
  ext: string,
  convert: Converter
) {
  await fs.mkdir(outputDir, { recursive: true });
  const files = await fs.readdir(inputDir);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const stat = await fs.stat(inputPath);

    if (!stat.isFile()) continue;

    const name = path.parse(file).name;
    const outputPath = path.join(outputDir, `${name}.${ext}`);

    await convert(inputPath, outputPath);
  }
}
