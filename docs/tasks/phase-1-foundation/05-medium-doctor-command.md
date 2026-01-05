# Task: Implement Doctor Command

**Difficulty:** Medium
**Phase:** 1 - Foundation
**File:** `src/cli/commands/doctor.ts`

---

## Overview

Create the `imgsmith doctor` CLI command that checks for installed dependencies and provides installation guidance. This is the first CLI command users run to diagnose issues.

---

## High-Level Steps

1. Create CLI commands directory structure
2. Create logger utility for colorful output
3. Implement doctor command that checks all dependencies
4. Display results in a clear, user-friendly format
5. Provide installation guidance when dependencies are missing
6. Create main CLI entry point that includes doctor command

---

## Detailed Checklist

### Directory Structure

- [ ] Create `src/cli/` directory
- [ ] Create `src/cli/commands/` directory
- [ ] Create `src/cli/ui/` directory

### Logger Utility

- [ ] Create `src/cli/ui/logger.ts`
- [ ] Create logger object with methods:
  - [ ] `info(msg: string)` - blue "i" icon + message
  - [ ] `success(msg: string)` - green "✓" icon + message
  - [ ] `warn(msg: string)` - yellow "!" icon + message
  - [ ] `error(msg: string)` - red "✗" icon + message
  - [ ] `header(msg: string)` - bold cyan header with newlines
- [ ] Import `picocolors` for colors
- [ ] Export logger object

### Doctor Command

- [ ] Create `src/cli/commands/doctor.ts`
- [ ] Import `checkAllDependencies` from detection module
- [ ] Import logger from UI module
- [ ] Create async function `runDoctor()`
  - [ ] Call `checkAllDependencies()`
  - [ ] Log header: "Dependency Check"
  - [ ] For each dependency result:
    - [ ] If installed: show success with version `✓ ImageMagick (7.1.0-35)`
    - [ ] If not installed: show error and installation guide
  - [ ] Log summary:
    - [ ] If all installed: `success("All dependencies are installed!")`
    - [ ] If some missing: `warn("Some dependencies are missing. See guides above.")`
- [ ] Export doctor command function

### CLI Entry Point

- [ ] Create `src/cli/index.ts`
- [ ] Import `Command` from commander
- [ ] Import doctor command
- [ ] Create program using commander
  - [ ] Set name: "imgsmith"
  - [ ] Set description: "Forge optimized images for the modern web" (with color)
  - [ ] Set version (read from package.json)
- [ ] Add doctor subcommand
- [ ] Export CLI for use in bin script
- [ ] Add shebang: `#!/usr/bin/env node` at the top

### Bin Script

- [ ] Create `src/cli/index.ts` as executable entry point
- [ ] CLI calls `runDoctor()` for doctor command
- [ ] Handle command parsing

### Package.json Updates

- [ ] Update `package.json` bin field:
  ```json
  "bin": { "imgsmith": "dist/cli/index.js" }
  ```
- [ ] Add scripts:
  - [ ] `"cli": "node dist/cli/index.js"`
  - [ ] `"cli:dev": "ts-node src/cli/index.ts"`

---

## Code Template: Logger

```typescript
import pc from "picocolors";

export const logger = {
  info: (msg: string) => console.log(pc.blue("ℹ") + " " + msg),
  success: (msg: string) => console.log(pc.green("✓") + " " + msg),
  warn: (msg: string) => console.log(pc.yellow("⚠") + " " + msg),
  error: (msg: string) => console.error(pc.red("✗") + " " + msg),
  header: (msg: string) => console.log("\n" + pc.bold(pc.cyan(msg)) + "\n"),
};
```

## Code Template: Doctor Command

```typescript
import { checkAllDependencies } from "../../detection/dependencies";
import { logger } from "../ui/logger";

export async function doctor() {
  logger.header("Dependency Check");

  const result = await checkAllDependencies();

  for (const dep of result.dependencies) {
    if (dep.installed) {
      logger.success(`${dep.name} ${dep.version ? `(${dep.version})` : ""}`);
    } else {
      logger.error(`${dep.name} is missing`);
      if (dep.installGuide) {
        console.log(`  Run: ${dep.installGuide}`);
      }
    }
  }

  console.log();
  if (result.allInstalled) {
    logger.success("All dependencies are installed!");
  } else {
    logger.warn("Some dependencies are missing. Install them and try again.");
  }
}
```

---

## Testing

- [ ] Run `npm run cli:dev doctor` and verify output
- [ ] Test with missing dependencies
- [ ] Verify installation guides display correctly
- [ ] Check color output looks good in terminal
