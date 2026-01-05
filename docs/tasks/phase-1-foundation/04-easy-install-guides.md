# Task: Create Install Guides

**Difficulty:** Easy
**Phase:** 1 - Foundation
**File:** `src/detection/install-guides.ts`

---

## Overview

Create a mapping of installation commands for each dependency across all supported platforms. This data is used to guide users on how to install missing dependencies.

---

## High-Level Steps

1. Create install-guides.ts file
2. Create a data structure mapping dependencies to platforms to install commands
3. Create function to get install guide for a dependency and platform
4. Cover all platforms: Ubuntu, Debian, Fedora, Arch, SUSE, macOS, Windows, FreeBSD, OpenBSD
5. Test retrieving guides for each combination

---

## Detailed Checklist

### File Creation & Imports

- [ ] Create file `src/detection/install-guides.ts`
- [ ] Import `Platform` type from `./platform`

### Constants: ImageMagick Installation

- [ ] Create object mapping ImageMagick installations:
  - [ ] ubuntu: `"sudo apt-get install imagemagick"`
  - [ ] debian: `"sudo apt-get install imagemagick"`
  - [ ] fedora: `"sudo dnf install ImageMagick"`
  - [ ] arch: `"sudo pacman -S imagemagick"`
  - [ ] suse: `"sudo zypper install ImageMagick"`
  - [ ] macos: `"brew install imagemagick"`
  - [ ] windows: `"choco install imagemagick OR winget install ImageMagick.ImageMagick"`
  - [ ] freebsd: `"sudo pkg install ImageMagick7"`
  - [ ] openbsd: `"doas pkg_add ImageMagick"`
  - [ ] linux-unknown: `"Install ImageMagick via your package manager"`

### Constants: libwebp (cwebp) Installation

- [ ] Create object mapping libwebp installations:
  - [ ] ubuntu: `"sudo apt-get install webp"`
  - [ ] debian: `"sudo apt-get install webp"`
  - [ ] fedora: `"sudo dnf install libwebp-tools"`
  - [ ] arch: `"sudo pacman -S libwebp"`
  - [ ] suse: `"sudo zypper install libwebp-tools"`
  - [ ] macos: `"brew install webp"`
  - [ ] windows: `"choco install webp OR download from https://developers.google.com/speed/webp/download"`
  - [ ] freebsd: `"sudo pkg install webp"`
  - [ ] openbsd: `"doas pkg_add libwebp"`
  - [ ] linux-unknown: `"Install libwebp/webp-tools via your package manager"`

### Constants: libavif Installation

- [ ] Create object mapping libavif installations:
  - [ ] ubuntu: `"sudo apt-get install libavif-bin"`
  - [ ] debian: `"sudo apt-get install libavif-bin"`
  - [ ] fedora: `"sudo dnf install libavif-tools"`
  - [ ] arch: `"sudo pacman -S libavif"`
  - [ ] suse: `"sudo zypper install libavif-tools"`
  - [ ] macos: `"brew install libavif"`
  - [ ] windows: `"Download from https://github.com/AOMediaCodec/libavif/releases"`
  - [ ] freebsd: `"sudo pkg install libavif"`
  - [ ] openbsd: `"doas pkg_add libavif"`
  - [ ] linux-unknown: `"Install libavif via your package manager"`

### Main Guide Object

- [ ] Create const `INSTALL_GUIDES: Record<string, Record<Platform, string>>`
- [ ] Include all three guides above (ImageMagick, cwebp, avifenc)

### Function

- [ ] Create function `getInstallGuide(dependency: string, platform: Platform): string`
  - [ ] Look up guide in INSTALL_GUIDES
  - [ ] Return fallback message if not found: `"Install ${dependency} for your platform"`

### Verification

- [ ] Test getting guide for each combination
- [ ] Verify fallback works for unknown dependencies

---

## Code Template

```typescript
import type { Platform } from "./platform";

const INSTALL_GUIDES: Record<string, Record<Platform, string>> = {
  ImageMagick: {
    debian: "sudo apt-get install imagemagick",
    ubuntu: "sudo apt-get install imagemagick",
    fedora: "sudo dnf install ImageMagick",
    arch: "sudo pacman -S imagemagick",
    suse: "sudo zypper install ImageMagick",
    macos: "brew install imagemagick",
    windows: "choco install imagemagick OR winget install ImageMagick.ImageMagick",
    freebsd: "sudo pkg install ImageMagick7",
    openbsd: "doas pkg_add ImageMagick",
    "linux-unknown": "Install ImageMagick via your package manager",
  },
  cwebp: {
    debian: "sudo apt-get install webp",
    ubuntu: "sudo apt-get install webp",
    fedora: "sudo dnf install libwebp-tools",
    arch: "sudo pacman -S libwebp",
    suse: "sudo zypper install libwebp-tools",
    macos: "brew install webp",
    windows: "choco install webp OR download from https://developers.google.com/speed/webp/download",
    freebsd: "sudo pkg install webp",
    openbsd: "doas pkg_add libwebp",
    "linux-unknown": "Install libwebp/webp-tools via your package manager",
  },
  avifenc: {
    debian: "sudo apt-get install libavif-bin",
    ubuntu: "sudo apt-get install libavif-bin",
    fedora: "sudo dnf install libavif-tools",
    arch: "sudo pacman -S libavif",
    suse: "sudo zypper install libavif-tools",
    macos: "brew install libavif",
    windows: "Download from https://github.com/AOMediaCodec/libavif/releases",
    freebsd: "sudo pkg install libavif",
    openbsd: "doas pkg_add libavif",
    "linux-unknown": "Install libavif via your package manager",
  },
};

export function getInstallGuide(dependency: string, platform: Platform): string {
  return (
    INSTALL_GUIDES[dependency]?.[platform] ??
    `Install ${dependency} for your platform`
  );
}
```

---

## Notes

- Keep guide commands concise but complete
- Windows has multiple options since there's no universal package manager
- Unknown Linux distros get generic guidance
