# Task: Set Up Testing with Vitest

**Difficulty:** Easy
**Phase:** 5 - Testing & Release
**File:** `vitest.config.ts`

---

## Overview

Configure Vitest for running unit tests across the codebase. Set up code coverage reporting and test patterns.

---

## High-Level Steps

1. Create vitest.config.ts configuration file
2. Configure test environment and globals
3. Set up coverage reporting
4. Define test file patterns
5. Verify configuration works with a sample test

---

## Detailed Checklist

### Configuration File

- [ ] Create `vitest.config.ts` in project root
- [ ] Import `defineConfig` from vitest
- [ ] Set test environment to "node"
- [ ] Enable globals (describe, it, expect)

### Test Patterns

- [ ] Configure test include pattern: `"tests/**/*.test.ts"`
- [ ] Configure output directory: coverage will go to `coverage/`

### Coverage Configuration

- [ ] Enable coverage with v8 provider
- [ ] Set coverage reporters:
  - [ ] "text" - console output
  - [ ] "html" - HTML report
  - [ ] "lcov" - for CI/CD integration
- [ ] Exclude from coverage:
  - [ ] tests folder
  - [ ] dist folder
  - [ ] node_modules

### Timeouts

- [ ] Set testTimeout to 30 seconds (for CLI commands)
- [ ] Set hookTimeout to 30 seconds

### Package.json Scripts

- [ ] `"test": "vitest run"` - run tests once
- [ ] `"test:watch": "vitest"` - watch mode
- [ ] `"test:coverage": "vitest run --coverage"` - with coverage

### Create Sample Test

- [ ] Create `tests/sample.test.ts` with a simple test
- [ ] Test should verify basic functionality
- [ ] Run tests to verify configuration works

---

## Code Template

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "tests/**",
        "dist/**",
        "node_modules/**",
      ],
    },
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
```

---

## Sample Test

```typescript
import { describe, it, expect } from "vitest";

describe("sample", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
```

---

## Verification

- [ ] Run `npm test` and verify all tests pass
- [ ] Run `npm run test:coverage` and verify coverage report
- [ ] Check HTML coverage report in `coverage/index.html`
