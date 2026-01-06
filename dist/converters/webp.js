import { run } from "../utils/exec";
export async function toWebP(input, output, quality = 80) {
    return run("cwebp", ["-q", quality.toString(), input, "-o", output]);
}
//# sourceMappingURL=webp.js.map