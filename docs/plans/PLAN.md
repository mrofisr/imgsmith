# Imgsmith Implementation Plan

> Forge optimized images for the modern web

## Overview

Build a Node/Bun library that converts images between formats using native CLI tools (ImageMagick, cwebp, avifenc), with smart format recommendations based on Core Web Vitals best practices.

**Target Users:** Web developers who forget to optimize images
**Platforms:** Linux (all distros), BSD, macOS, Windows
**Interfaces:** CLI (colorful), Library API

---

## Project Structure

```
imgsmith/
├── src/
│   ├── index.ts                 # Main library exports
│   ├── cli/
│   │   ├── index.ts             # CLI entry point (commander.js)
│   │   ├── commands/
│   │   │   ├── convert.ts       # imgsmith convert <input>
│   │   │   ├── optimize.ts      # imgsmith optimize <dir>
│   │   │   ├── analyze.ts       # imgsmith analyze <image>
│   │   │   └── doctor.ts        # imgsmith doctor
│   │   └── ui/
│   │       ├── logger.ts        # Colorful output (picocolors)
│   │       ├── progress.ts      # Progress bars
│   │       └── table.ts         # Size comparison tables
│   ├── core/
│   │   ├── converter.ts         # Unified converter interface
│   │   ├── analyzer.ts          # Image content analysis
│   │   └── types.ts             # Shared TypeScript types
│   ├── converters/              # Existing converters
│   ├── detection/
│   │   ├── dependencies.ts      # Check installed CLI tools
│   │   ├── platform.ts          # OS detection
│   │   └── install-guides.ts    # Per-platform install commands
│   ├── recommendation/
│   │   ├── engine.ts            # Format recommendation logic
│   │   ├── rules.ts             # Core Web Vitals rules
│   │   └── explanations.ts      # Educational content
│   └── utils/                   # Existing utilities
├── tests/
├── docs/
│   ├── plans/                   # This file
│   └── tasks/                   # Microtasks with checklists
└── .github/workflows/
```

---

## CLI Commands

```bash
imgsmith convert <input> [output]  # Convert single image
  -f, --format <format>            # webp|avif|jpeg|png|auto (default: auto)
  -q, --quality <1-100>            # Quality level
  --compare                        # Show before/after comparison

imgsmith optimize <dir>            # Optimize all images in directory
  -r, --recursive                  # Include subdirectories
  --dry-run                        # Preview without converting
  --concurrency <n>                # Parallel conversions

imgsmith analyze <image>           # Analyze and recommend format
  --explain                        # Show educational explanation
  --json                           # Output as JSON

imgsmith doctor                    # Check if dependencies installed
```

---

## Library API

```typescript
import { convert, analyze, optimize } from 'imgsmith';

// Convert with auto-format detection
const result = await convert('photo.jpg');

// Analyze and get recommendation
const analysis = await analyze('hero.png');

// Batch optimize
await optimize('./images', { recursive: true, format: 'auto' });
```

---

## Smart Format Recommendations

| Image Type | Primary | Reason |
|------------|---------|--------|
| Photo (high entropy, many colors) | AVIF | 50% smaller than JPEG |
| Graphic (flat colors, sharp edges) | WebP | Excellent for illustrations |
| Screenshot (text, UI elements) | WebP | Preserves text clarity |
| Transparent graphic | PNG | Lossless transparency |
| Animated | WebP | 50-80% smaller than GIF |

---

## Dependency Detection

Detect and guide installation for:
- **ImageMagick** (`magick`) - JPEG/PNG conversion
- **libwebp** (`cwebp`) - WebP conversion
- **libavif** (`avifenc`) - AVIF conversion

Platform-specific install guides:
- Ubuntu/Debian: `apt-get install imagemagick webp libavif-bin`
- Fedora: `dnf install ImageMagick libwebp-tools libavif-tools`
- Arch: `pacman -S imagemagick libwebp libavif`
- macOS: `brew install imagemagick webp libavif`
- Windows: `choco install imagemagick webp`

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Update package.json with new dependencies
- [ ] Create TypeScript types (`src/core/types.ts`)
- [ ] Implement platform detection (`src/detection/platform.ts`)
- [ ] Implement dependency checking (`src/detection/dependencies.ts`)
- [ ] Create install guides (`src/detection/install-guides.ts`)
- [ ] Implement `imgsmith doctor` command

### Phase 2: Core Conversion
- [ ] Create unified converter interface (`src/core/converter.ts`)
- [ ] Add consistent error handling to existing converters
- [ ] Implement batch conversion with concurrency
- [ ] Add file size comparison utilities
- [ ] Implement `imgsmith convert` command

### Phase 3: Recommendation Engine
- [ ] Implement image analysis using ImageMagick identify
- [ ] Create image type classification (photo/graphic/screenshot)
- [ ] Implement format recommendation rules
- [ ] Add educational explanations
- [ ] Implement `imgsmith analyze` command

### Phase 4: CLI Polish
- [ ] Set up commander.js with all commands
- [ ] Implement colorful logger with picocolors
- [ ] Add progress bars for batch operations
- [ ] Create size comparison tables
- [ ] Implement `imgsmith optimize` command

### Phase 5: Testing & Release
- [ ] Set up Vitest for unit tests
- [ ] Add integration tests for CLI
- [ ] Configure GitHub Actions for cross-platform CI
- [ ] Write documentation
- [ ] Prepare npm publishing workflow

---

## Success Criteria

1. **Works on all platforms** - Linux, BSD, macOS, Windows
2. **Clear dependency guidance** - `imgsmith doctor` tells users exactly what to install
3. **Smart defaults** - Auto-detects best format without user thinking
4. **Educational** - Explains why certain formats are better (CWV focus)
5. **Beautiful CLI** - Colorful output, progress bars, size comparisons
6. **Developer-friendly** - Clean API, TypeScript types

---

## Future Scope (v2)

- Vite plugin for automatic image optimization during build
- Webpack plugin
- Rollup plugin
- Watch mode for development
- Config file support (imgsmith.config.js)
