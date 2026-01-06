import { run } from "../utils/exec";
export async function toPNG(input, output) {
    return run("magick", [input, output]);
}
//# sourceMappingURL=png.js.map