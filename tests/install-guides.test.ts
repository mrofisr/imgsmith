import { describe, it, expect } from "vitest";
import { getInstallGuide } from "../src/detection/install-guides.js";
import type { Platform } from "../src/detection/platform.js";

describe("Install Guides", () => {
  const platforms: Platform[] = [
    "ubuntu",
    "debian",
    "fedora",
    "arch",
    "suse",
    "macos",
    "windows",
    "freebsd",
    "openbsd",
    "linux-unknown",
  ];

  const dependencies = ["ImageMagick", "cwebp", "avifenc"];

  it("should provide guides for all platforms and dependencies", () => {
    for (const platform of platforms) {
      for (const dep of dependencies) {
        const guide = getInstallGuide(dep, platform);
        expect(guide).toBeDefined();
        expect(typeof guide).toBe("string");
        expect(guide.length).toBeGreaterThan(0);
      }
    }
  });

  it("should return apt-get for Ubuntu", () => {
    const guide = getInstallGuide("ImageMagick", "ubuntu");
    expect(guide).toContain("apt-get");
    expect(guide).toContain("imagemagick");
  });

  it("should return brew for macOS", () => {
    const guide = getInstallGuide("ImageMagick", "macos");
    expect(guide).toContain("brew");
    expect(guide).toContain("imagemagick");
  });

  it("should return choco or winget for Windows", () => {
    const guide = getInstallGuide("ImageMagick", "windows");
    expect(guide).toMatch(/choco|winget/);
  });

  it("should return dnf for Fedora", () => {
    const guide = getInstallGuide("ImageMagick", "fedora");
    expect(guide).toContain("dnf");
  });

  it("should return pacman for Arch", () => {
    const guide = getInstallGuide("ImageMagick", "arch");
    expect(guide).toContain("pacman");
  });

  it("should return fallback for unknown dependency", () => {
    const guide = getInstallGuide("unknown-tool", "ubuntu");
    expect(guide).toContain("unknown-tool");
    expect(guide).toContain("Install");
  });

  it("should provide WebP installation guides", () => {
    const guide = getInstallGuide("cwebp", "ubuntu");
    expect(guide).toContain("webp");
  });

  it("should provide AVIF installation guides", () => {
    const guide = getInstallGuide("avifenc", "ubuntu");
    expect(guide).toContain("libavif");
  });
});
