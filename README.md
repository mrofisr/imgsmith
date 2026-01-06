# imgsmith

> Forge optimized images for the modern web

[![Test](https://github.com/mrofisr/imgsmith/actions/workflows/test.yaml/badge.svg)](https://github.com/mrofisr/imgsmith/actions/workflows/test.yaml)
[![npm version](https://badge.fury.io/js/imgsmith.svg)](https://www.npmjs.com/package/imgsmith)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**imgsmith** is a powerful image optimization tool that uses native CLIs (ImageMagick, WebP, AVIF) to convert and optimize images with intelligent format recommendations based on image analysis.

## Features

- 🎯 **Intelligent Format Selection** - Automatically analyzes images and recommends the best format
- 🚀 **Multiple Usage Modes** - CLI, Library, or Vite Plugin
- 🔍 **Image Analysis** - Classifies images as photo, graphic, screenshot, or mixed content
- ⚡ **Batch Processing** - Optimize entire directories with configurable concurrency
- 📊 **Core Web Vitals** - Optimized for LCP and CLS performance metrics
- 🌐 **Cross-Platform** - Works on Linux, macOS, and Windows
- 💪 **TypeScript** - Fully typed with strict mode enabled

## Installation

```bash
npm install imgsmith
```

### System Dependencies

imgsmith requires the following CLI tools to be installed:

**Ubuntu/Debian:**
```bash
sudo apt-get install imagemagick webp libavif-bin
```

**macOS:**
```bash
brew install imagemagick webp libavif
```

**Windows:**
```bash
choco install imagemagick webp
```

Verify installation:
```bash
npx imgsmith doctor
```

## CLI Usage

### Convert Single Image

```bash
# Auto-detect best format
imgsmith convert photo.jpg

# Specific format
imgsmith convert photo.jpg photo.webp -f webp -q 85

# Show size comparison
imgsmith convert image.png --compare
```

### Analyze Image

```bash
imgsmith analyze photo.jpg
```

Output:
```
Image Information:
  File: photo.jpg
  Format: JPEG
  Size: 2.4 MB
  Dimensions: 1920x1080
  Type: photo
  Transparency: No
  Animation: No

Recommendation:
  ✓ Format: AVIF
  Reason: AVIF provides 50% better compression than JPEG for photos
```

### Batch Optimization

```bash
# Optimize all images in directory
imgsmith optimize ./images

# Recursive with custom settings
imgsmith optimize ./assets -r -f webp -q 80 -c 8
```

## Library Usage

### Basic Conversion

```typescript
import { convert } from 'imgsmith';

// Auto-detect best format
const result = await convert('photo.jpg');
console.log(result.format); // "avif"
console.log(result.savingsPercent); // 52.3

// Specific format
const result2 = await convert('image.png', 'image.webp', {
  format: 'webp',
  quality: 85
});
```

### Batch Conversion

```typescript
import { convertMany } from 'imgsmith';

const files = ['photo1.jpg', 'photo2.jpg', 'logo.png'];
const results = await convertMany(files, {
  format: 'auto',
  concurrency: 4
});

console.log(results); // Array of ConvertResult
```

### Image Analysis

```typescript
import { analyzeImage } from 'imgsmith';

const analysis = await analyzeImage('photo.jpg');
console.log(analysis.imageType); // "photo"
console.log(analysis.recommendation.format); // "avif"
console.log(analysis.recommendation.reason); // "AVIF provides 50%..."
```

### Access Optimization Rules

```typescript
import { OPTIMIZATION_RULES, CWV_GUIDELINES } from 'imgsmith';

console.log(OPTIMIZATION_RULES.photo.primary); // "avif"
console.log(CWV_GUIDELINES.lcp.maxSize); // 153600 (150KB)
```

## Image Classification

imgsmith automatically classifies images into types:

- **Photo**: High color count, continuous tones → **AVIF** recommended
- **Graphic**: Low color count, flat colors, sharp edges → **WebP** recommended
- **Screenshot**: Low color ratio, text-heavy → **WebP** recommended
- **Mixed**: Everything else → **WebP** recommended

## API Reference

### `convert(input, output?, options?)`

Convert a single image.

**Parameters:**
- `input: string` - Input file path
- `output?: string` - Output file path (optional)
- `options?: ConvertOptions`
  - `format?: "webp" | "avif" | "jpeg" | "png" | "auto"` (default: "auto")
  - `quality?: number` - Quality 1-100
  - `preserveOriginal?: boolean`

**Returns:** `Promise<ConvertResult>`

### `convertMany(files, options?)`

Convert multiple images in parallel.

**Parameters:**
- `files: string[]` - Array of input file paths
- `options?: ConvertOptions & { concurrency?: number }`
  - `concurrency?: number` - Parallel conversions (default: 4)

**Returns:** `Promise<ConvertResult[]>`

### `analyzeImage(filePath)`

Analyze an image and get format recommendation.

**Parameters:**
- `filePath: string` - Input file path

**Returns:** `Promise<AnalyzeResult>`

### `recommendFormat(filePath)`

Get recommended format for an image.

**Parameters:**
- `filePath: string` - Input file path

**Returns:** `Promise<ImageFormat>`

## Core Web Vitals

imgsmith optimizations are aligned with Google's Core Web Vitals:

- **LCP (Largest Contentful Paint)**: Target < 150KB for hero images
- **CLS (Cumulative Layout Shift)**: Preserves image dimensions
- **Preferred Formats**: AVIF and WebP for modern browsers

## TypeScript Support

imgsmith is written in TypeScript with strict mode enabled and includes comprehensive type definitions:

```typescript
import type {
  ImageFormat,
  ImageType,
  ConvertOptions,
  ConvertResult,
  AnalyzeResult,
  FormatRecommendation,
} from 'imgsmith';
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch tests
npm run test:watch

# Coverage
npm run test:coverage
```

## License

MIT © [abdurrofi](https://github.com/mrofisr)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Built with:
- [ImageMagick](https://imagemagick.org/) - Image manipulation
- [WebP](https://developers.google.com/speed/webp) - WebP encoding
- [libavif](https://github.com/AOMediaCodec/libavif) - AVIF encoding
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Vitest](https://vitest.dev/) - Testing framework
