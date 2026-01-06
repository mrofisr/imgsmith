import fs from "fs/promises";
import path from "path";
export async function convertFolder(inputDir, outputDir, ext, convert) {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(inputDir);
    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const stat = await fs.stat(inputPath);
        if (!stat.isFile())
            continue;
        const name = path.parse(file).name;
        const outputPath = path.join(outputDir, `${name}.${ext}`);
        await convert(inputPath, outputPath);
    }
}
//# sourceMappingURL=convert-folder.js.map