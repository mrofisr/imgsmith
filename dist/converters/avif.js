import { run } from "../utils/exec";
export async function toAVIF(input, output, quality = 30) {
    return run("avifenc", ["-q", quality.toString(), input, output]);
}
//# sourceMappingURL=avif.js.map