# Task: Implement Dependency Detection

**Difficulty:** Medium
**Phase:** 1 - Foundation
**File:** `src/detection/dependencies.ts`

---

## Overview

Check if required CLI tools (ImageMagick, cwebp, avifenc) are installed and their versions. This helps diagnose missing dependencies and guide users to install them.

---

## High-Level Steps

1. Create dependencies.ts file
2. Define dependency list (magick, cwebp, avifenc)
3. Implement function to check individual dependency
4. Implement function to check all dependencies
5. Return structured result with installation guides
6. Handle errors gracefully

---

## Detailed Checklist

### File Creation & Imports

- [ ] Create file `src/detection/dependencies.ts`
- [ ] Import `run` function from `../utils/exec`
- [ ] Import `getPlatform` and `Platform` type from `./platform`
- [ ] Import `getInstallGuide` (will create next task)

### Type Definitions

- [ ] Create interface `DependencyStatus` with fields:
  - [ ] `name: string` (e.g., "ImageMagick")
  - [ ] `command: string` (e.g., "magick")
  - [ ] `installed: boolean`
  - [ ] `version?: string` (optional version)
  - [ ] `installGuide?: string` (optional guide)
- [ ] Create interface `DependencyCheckResult` with fields:
  - [ ] `allInstalled: boolean`
  - [ ] `dependencies: DependencyStatus[]`
  - [ ] `platform: Platform`

### Constants

- [ ] Create const `DEPENDENCIES` array with objects:
  - [ ] `{ name: "ImageMagick", command: "magick", versionArg: "--version" }`
  - [ ] `{ name: "cwebp", command: "cwebp", versionArg: "-version" }`
  - [ ] `{ name: "avifenc", command: "avifenc", versionArg: "--version" }`

### Check Single Dependency

- [ ] Implement `async checkDependency(command, versionArg)` function
  - [ ] Try to run command with version argument
  - [ ] Parse version from output using regex: `/(\d+\.\d+(?:\.\d+)?)/`
  - [ ] Catch errors and return `{ installed: false }`
  - [ ] Return `{ installed: true, version: "x.y.z" }` on success

### Check All Dependencies

- [ ] Implement `async checkAllDependencies()` function
  - [ ] Get platform using `getPlatform()`
  - [ ] Create Promise.all to check all dependencies in parallel
  - [ ] For each dependency, call `checkDependency`
  - [ ] Add install guide if not installed using `getInstallGuide(name, platform)`
  - [ ] Return `DependencyCheckResult` with all information

### Error Handling

- [ ] Silently handle missing tools (don't throw)
- [ ] Handle parsing errors for version numbers gracefully

---

## Code Template

```typescript
import { run } from "../utils/exec";
import { getPlatform, type Platform } from "./platform";
import { getInstallGuide } from "./install-guides";

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
```

---

## Notes

- Version checking is best-effort; missing version doesn't mean tool isn't installed
- Using Promise.all for parallel checking is efficient
- The `run` function will handle command not found errors
