import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function run(cmd: string, args: string[]): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync(cmd, args);
    if (stderr) console.warn(stderr);
    return stdout;
  } catch (err) {
    const error = err as Error & { code?: string };
    throw new Error(`${cmd} failed: ${error.message}`);
  }
}
