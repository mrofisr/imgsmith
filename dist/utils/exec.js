import { execFile } from "child_process";
import { promisify } from "util";
const execFileAsync = promisify(execFile);
export async function run(cmd, args) {
    try {
        const { stdout, stderr } = await execFileAsync(cmd, args);
        if (stderr)
            console.warn(stderr);
        return stdout;
    }
    catch (err) {
        const error = err;
        throw new Error(`${cmd} failed: ${error.message}`);
    }
}
//# sourceMappingURL=exec.js.map