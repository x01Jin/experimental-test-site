# Image Corruption Engine & Visual Decay

## Overview

The image corruption pipeline provides real-time, non-destructive degradation of photographic specimens fetched from public internet archives and surveillance feeds. As the user descends through increasing virtual depth, images degrade along a multi-stage progression from subtle pixel softening to severe structural fragmentation and abstract corruption.

---

## Architecture & Data Flow

1. **Specimen Fetching (`internetImages.ts`)**:
   - Sources diverse photographic specimens (archival portraits, surveillance CCTV feeds, medical radiography, architectural shafts, and biological pathology slides) using public CDN image endpoints.
   - Each specimen is associated with categorical identifiers, metadata case numbers, and cryptographic seeds.

2. **Canvas Corruption Pipeline (`imageCorruptor.ts`)**:
   - Renders images onto an HTML5 Canvas context (`willReadFrequently: true`).
   - Scales corruption algorithms to the combined product of global depth corruption and individual item glitch severity (`0.0` to `1.2+`).
   - Implements a procedural canvas fallback routine to generate biometric silhouettes, surveillance overlays, and analog noise if cross-origin security restrictions prevent direct pixel readouts.

3. **Presentation & Fragmentation Layer (`CorruptedImage.tsx`)**:
   - Renders the processed canvas alongside CRT phosphor shimmer lines and dynamic chromatic color burns.
   - Spawns detached polygonal fragment shards that break away from the image frame at high corruption levels, floating and shuddering with user cursor movement.

---

## Corruption Stages & Transformations

### 1. Dynamic Pixelation (Downsampling & Upscaling)
Downscales the source image into an offscreen low-resolution buffer without smoothing (`imageSmoothingEnabled = false`), then scales it back to canvas dimensions:
- **Surface Strata (`0.05 – 0.25`)**: High resolution with subtle pixel softening (buffer resolution: 140–180px).
- **Decay Strata (`0.25 – 0.60`)**: Visible retro mosaic blocks (buffer resolution: 60–90px).
- **Abyss Strata (`0.60 – 1.0+`)**: Heavy digital downsampling (buffer resolution: 20–40px).

### 2. RGB Channel Splitting & Color Distortion
Extracts raw pixel buffers and displaces color channels horizontally:
- **Red Channel**: Shifted laterally to the left by `severity * 14` pixels.
- **Blue/Cyan Channel**: Shifted laterally to the right by `severity * 14` pixels.
- **Green Channel**: Progressively attenuated and suppressed at deep strata, crushing color into high-contrast blood-red palettes.

### 3. Horizontal Glitch Slice Displacement
Cuts randomized horizontal bands across the canvas (varying from 4px to 25px in height) and displaces them laterally across the frame, simulating CRT signal drops, magnetic tape stretching, and transmission packet loss.

### 4. Chunk Inversion & Solarization
Selects random rectangular bounding boxes across the image and inverts their RGB values (`255 - value`), producing high-contrast photographic negative patches.

### 5. Compression Macroblocks & Void Dropouts
Injects randomized digital compression macroblocks:
- High-contrast magenta/green artifact dropouts simulating GPU memory decay.
- Total black void rectangles simulating dead sensor pixels and lost camera channels.

### 6. Demonic Overlays & Vein Capillaries
At high severity (`> 0.45`), paints sunken black hollow orbital cavities at facial biometric coordinates, weeping dark blood tears rendered with quadratic Bézier paths, and glowing pinpoint red pupils that track ambient time oscillations.

### 7. Floating Fragmented Shards
When severity exceeds `0.45`, CSS polygonal clip-paths generate broken fragments that displace outside the card boundaries, giving physical dimension to the image's collapse.
