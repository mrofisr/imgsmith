import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPlatform } from "../src/detection/platform.js";
import type { Platform } from "../src/detection/platform.js";
import os from "node:os";
import { readFileSync } from "node:fs";

describe("Platform Detection", () => {
  const originalPlatform = os.platform;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should detect macOS", () => {
    vi.spyOn(os, "platform").mockReturnValue("darwin");
    expect(getPlatform()).toBe("macos");
  });

  it("should detect Windows", () => {
    vi.spyOn(os, "platform").mockReturnValue("win32");
    expect(getPlatform()).toBe("windows");
  });

  it("should detect FreeBSD", () => {
    vi.spyOn(os, "platform").mockReturnValue("freebsd");
    expect(getPlatform()).toBe("freebsd");
  });

  it("should detect OpenBSD", () => {
    vi.spyOn(os, "platform").mockReturnValue("openbsd");
    expect(getPlatform()).toBe("openbsd");
  });

  it("should detect current platform correctly", () => {
    const platform = getPlatform();
    const validPlatforms: Platform[] = [
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

    expect(validPlatforms).toContain(platform);
  });

  it("should return a string", () => {
    const platform = getPlatform();
    expect(typeof platform).toBe("string");
    expect(platform.length).toBeGreaterThan(0);
  });
});
