import os from "node:os";
import { readFileSync } from "node:fs";
export function getPlatform() {
    const platform = os.platform();
    if (platform === "darwin")
        return "macos";
    if (platform === "win32")
        return "windows";
    if (platform === "freebsd")
        return "freebsd";
    if (platform === "openbsd")
        return "openbsd";
    if (platform === "linux") {
        try {
            const osRelease = readFileSync("/etc/os-release", "utf-8");
            // Check distribution patterns
            if (/ubuntu/i.test(osRelease))
                return "ubuntu";
            if (/debian/i.test(osRelease))
                return "debian";
            if (/fedora/i.test(osRelease))
                return "fedora";
            if (/arch/i.test(osRelease))
                return "arch";
            if (/suse|opensuse/i.test(osRelease))
                return "suse";
        }
        catch {
            // Fallback if /etc/os-release doesn't exist
        }
        return "linux-unknown";
    }
    return "linux-unknown";
}
//# sourceMappingURL=platform.js.map