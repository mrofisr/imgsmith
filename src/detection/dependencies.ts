import { run } from "../utils/exec.js";
import { getPlatform, type Platform } from "./platform.js";
import { getInstallGuide } from "./install-guides.js";

export interface DependencyStatus {
  name: string;
  command: string;
  installed: boolean;
  version?: string;
  installGuide?: string;
}

export interface DependencyCheckResult {
  allInstalled: boolean;
  dependencies: DependencyStatus[];
  platform: Platform;
}

const DEPENDENCIES = [
  { name: "ImageMagick", command: "magick", versionArg: "--version" },
  { name: "cwebp", command: "cwebp", versionArg: "-version" },
  { name: "avifenc", command: "avifenc", versionArg: "--version" },
] as const;

export async function checkDependency(
  command: string,
  versionArg: string
): Promise<{ installed: boolean; version?: string }> {
  try {
    const output = await run(command, [versionArg]);
    const versionMatch = output.match(/(\d+\.\d+(?:\.\d+)?)/);
    return {
      installed: true,
      version: versionMatch?.[1],
    };
  } catch {
    return { installed: false };
  }
}

export async function checkAllDependencies(): Promise<DependencyCheckResult> {
  const platform = getPlatform();
  const results = await Promise.all(
    DEPENDENCIES.map(async (dep) => {
      const status = await checkDependency(dep.command, dep.versionArg);
      return {
        name: dep.name,
        command: dep.command,
        installed: status.installed,
        version: status.version,
        installGuide: status.installed
          ? undefined
          : getInstallGuide(dep.name, platform),
      };
    })
  );

  return {
    allInstalled: results.every((r) => r.installed),
    dependencies: results,
    platform,
  };
}
