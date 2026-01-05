# Task: Project Setup and Dependencies

**Difficulty:** Easy
**Phase:** 1 - Foundation
**Estimated Impact:** 15 mins

---

## Overview

Update `package.json` with new dependencies needed for the CLI and build infrastructure. Add bin entry for CLI executable.

---

## High-Level Steps

1. Add commander.js and picocolors to dependencies
2. Add testing dependencies (vitest, coverage tools)
3. Add bin entry pointing to CLI
4. Add TypeScript configuration for CLI scripts
5. Update package.json exports for new modules
6. Verify build script still works

---

## Detailed Checklist

### Dependencies

- [ ] Open `package.json`
- [ ] Add to `dependencies`: `"commander": "^12.0.0"`
- [ ] Add to `dependencies`: `"picocolors": "^1.0.0"`
- [ ] Add to `devDependencies`: `"vitest": "^1.0.0"`
- [ ] Add to `devDependencies`: `"@vitest/coverage-v8": "^1.0.0"`

### Scripts & Bin

- [ ] Add `"bin": { "imgsmith": "dist/cli/index.js" }` to package.json
- [ ] Update `"scripts"` to include `"test": "vitest run"`
- [ ] Update `"scripts"` to include `"test:watch": "vitest"`
- [ ] Add `"test:coverage": "vitest run --coverage"` to scripts

### Exports

- [ ] Add `"exports"` field to package.json
- [ ] Configure main export for library: `".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }`
- [ ] Add CLI export if needed: `"./cli": { "import": "./dist/cli/index.js" }`

### Verification

- [ ] Run `npm install` to install new dependencies
- [ ] Run `npm run build` to verify TypeScript still compiles
- [ ] Verify no build errors
- [ ] Check `dist/` folder was created successfully

---

## Notes

- Keep Node version requirement at `>=18`
- Keep MIT license
- Don't change existing keywords, just add to them if desired
