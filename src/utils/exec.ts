import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function run(cmd: string, args: string[]) {
  try {
    const { stdout, stderr } = await execFileAsync(cmd, args);
    if (stderr) console.warn(stderr);
    return stdout;
  } catch (err: any) {
    throw new Error(`${cmd} failed: ${err.message}`);
  }
}
