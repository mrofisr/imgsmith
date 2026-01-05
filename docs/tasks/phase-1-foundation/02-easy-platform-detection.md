# Task: Implement Platform Detection

**Difficulty:** Easy
**Phase:** 1 - Foundation
**File:** `src/detection/platform.ts`

---

## Overview

Detect the operating system and Linux distribution to provide platform-specific installation guides later. This is a foundational utility needed by the dependency detection system.

---

## High-Level Steps

1. Create detection folder and platform.ts file
2. Detect macOS, Windows, FreeBSD, OpenBSD
3. For Linux, detect specific distributions (Ubuntu, Debian, Fedora, Arch, SUSE)
4. Export the platform type and detection function
5. Write basic tests

---

## Detailed Checklist

### File Creation

- [ ] Create directory `src/detection/`
- [ ] Create file `src/detection/platform.ts`

### Platform Detection Implementation

- [ ] Import `os` module from Node.js
- [ ] Import `execSync` from `child_process`
- [ ] Create type: `type Platform = "debian" | "ubuntu" | "fedora" | "arch" | "suse" | "macos" | "windows" | "freebsd" | "openbsd" | "linux-unknown"`
- [ ] Create function `getPlatform(): Platform`
  - [ ] Check `os.platform()` for "darwin" → return "macos"
  - [ ] Check `os.platform()` for "win32" → return "windows"
  - [ ] Check `os.platform()` for "freebsd" → return "freebsd"
  - [ ] Check `os.platform()` for "openbsd" → return "openbsd"
  - [ ] For "linux" platform:
    - [ ] Try reading `/etc/os-release`
    - [ ] Check for Ubuntu regex pattern
    - [ ] Check for Debian regex pattern
    - [ ] Check for Fedora regex pattern
    - [ ] Check for Arch regex pattern
    - [ ] Check for SUSE regex pattern
    - [ ] Return fallback "linux-unknown" if no match
- [ ] Export `getPlatform` function and `Platform` type

### Testing

- [ ] Verify function returns correct platform for current OS
- [ ] Test regex patterns work correctly
- [ ] Test fallback behavior

---

## Code Template

```typescript
import os from "os";
import { execSync } from "child_process";

export type Platform =
  | "debian" | "ubuntu" | "fedora" | "arch" | "suse"
  | "macos" | "windows" | "freebsd" | "openbsd"
  | "linux-unknown";

export function getPlatform(): Platform {
  const platform = os.platform();

  if (platform === "darwin") return "macos";
  if (platform === "win32") return "windows";
  if (platform === "freebsd") return "freebsd";
  if (platform === "openbsd") return "openbsd";

  if (platform === "linux") {
    try {
      const osRelease = execSync("cat /etc/os-release", { encoding: "utf-8" });

      // Check distribution patterns
      if (/ubuntu/i.test(osRelease)) return "ubuntu";
      if (/debian/i.test(osRelease)) return "debian";
      if (/fedora/i.test(osRelease)) return "fedora";
      if (/arch/i.test(osRelease)) return "arch";
      if (/suse|opensuse/i.test(osRelease)) return "suse";
    } catch {
      // Fallback if /etc/os-release doesn't exist
    }
    return "linux-unknown";
  }

  return "linux-unknown";
}
```

---

## Notes

- This function runs synchronously which is fine for startup/CLI usage
- On systems without `/etc/os-release`, it falls back to "linux-unknown"
- User's distribution will still be guided to their closest match
