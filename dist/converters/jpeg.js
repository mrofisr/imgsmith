import { run } from "../utils/exec";
export async function toJPEG(input, output, quality = 85) {
    return run("magick", [input, "-quality", quality.toString(), output]);
}
//# sourceMappingURL=jpeg.js.map