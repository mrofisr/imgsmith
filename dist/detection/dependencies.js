import { run } from "../utils/exec";
import { getPlatform } from "./platform";
import { getInstallGuide } from "./install-guides";
const DEPENDENCIES = [
    { name: "ImageMagick", command: "magick", versionArg: "--version" },
    { name: "cwebp", command: "cwebp", versionArg: "-version" },
    { name: "avifenc", command: "avifenc", versionArg: "--version" },
];
export async function checkDependency(command, versionArg) {
    try {
        const output = await run(command, [versionArg]);
        const versionMatch = output.match(/(\d+\.\d+(?:\.\d+)?)/);
        return {
            installed: true,
            version: versionMatch?.[1],
        };
    }
    catch {
        return { installed: false };
    }
}
export async function checkAllDependencies() {
    const platform = getPlatform();
    const results = await Promise.all(DEPENDENCIES.map(async (dep) => {
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
    }));
    return {
        allInstalled: results.every((r) => r.installed),
        dependencies: results,
        platform,
    };
}
//# sourceMappingURL=dependencies.js.map