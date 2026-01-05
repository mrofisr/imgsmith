# Task: Set Up GitHub Actions CI/CD

**Difficulty:** Medium
**Phase:** 5 - Testing & Release
**Files:** `.github/workflows/test.yaml`, `.github/workflows/release.yaml`

---

## Overview

Configure GitHub Actions for cross-platform testing on Linux, macOS, and Windows with multiple Node versions. Also set up automated npm publishing on version tags.

---

## High-Level Steps

1. Create test workflow for cross-platform testing
2. Include system dependency installation for each OS
3. Run tests on multiple Node versions
4. Upload coverage reports
5. Create release workflow for npm publishing
6. Test workflows trigger on push/PR

---

## Detailed Checklist

### Test Workflow File

- [ ] Create `.github/workflows/test.yaml`
- [ ] Set trigger on push to main and PRs to main
- [ ] Configure matrix strategy:
  - [ ] OS: ubuntu-latest, macos-latest, windows-latest
  - [ ] Node: 18, 20, 22
- [ ] Add job for each combination

### Ubuntu Test Job

- [ ] Install dependencies via apt:
  - [ ] `sudo apt-get update`
  - [ ] `sudo apt-get install -y imagemagick webp libavif-bin`
- [ ] Setup Node.js using actions/setup-node
- [ ] Cache npm dependencies
- [ ] Run `npm ci` to install
- [ ] Run `npm test`

### macOS Test Job

- [ ] Install dependencies via homebrew:
  - [ ] `brew install imagemagick webp libavif`
- [ ] Setup Node.js
- [ ] Cache npm
- [ ] Run npm ci and tests

### Windows Test Job

- [ ] Install dependencies via chocolatey:
  - [ ] `choco install imagemagick webp`
- [ ] Note: AVIF tools require manual setup on Windows
- [ ] Setup Node.js
- [ ] Cache npm
- [ ] Run npm ci and tests

### Coverage Upload

- [ ] For Ubuntu + Node 20 only:
  - [ ] Upload coverage to codecov
  - [ ] Use codecov/codecov-action

### Release Workflow File

- [ ] Create `.github/workflows/release.yaml`
- [ ] Trigger on tags matching `v*` pattern
- [ ] Single job running on ubuntu-latest

### Release Job Steps

- [ ] Checkout code
- [ ] Setup Node.js v20 with npm registry
- [ ] Install dependencies
- [ ] Run `npm run build`
- [ ] Publish to npm with `npm publish --provenance`
  - [ ] Set NODE_AUTH_TOKEN from secrets
- [ ] Create GitHub release with release notes
  - [ ] Use softprops/action-gh-release

### Secrets Configuration

- [ ] Document that NPM_TOKEN secret needs to be set
- [ ] Token should be npm automation token
- [ ] Add to repo settings

---

## Test Workflow Template

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies (macOS)
        if: runner.os == 'macOS'
        run: brew install imagemagick webp libavif

      - name: Install dependencies (Ubuntu)
        if: runner.os == 'Linux'
        run: |
          sudo apt-get update
          sudo apt-get install -y imagemagick webp libavif-bin

      - name: Install dependencies (Windows)
        if: runner.os == 'Windows'
        run: choco install imagemagick webp -y

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'

      - name: Install npm dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Upload coverage
        if: matrix.os == 'ubuntu-latest' && matrix.node == 20
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/lcov.info
```

---

## Release Workflow Template

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
```

---

## Setup Instructions

- [ ] Create `.github/workflows/` directory if it doesn't exist
- [ ] Save test workflow
- [ ] Save release workflow
- [ ] Add NPM_TOKEN secret in GitHub repo settings:
  - [ ] Go to Settings → Secrets and variables → Actions
  - [ ] New repository secret: NPM_TOKEN
  - [ ] Paste npm automation token
- [ ] Push changes and verify workflows appear in Actions tab
