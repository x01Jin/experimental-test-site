# Visual Effects, Degradation & Jumpscares

## Progressive Degradation Scrolling Mechanism

Visual elements dynamically degrade as virtual scroll depth increases, progressing through structured tiers of aesthetic decomposition:

### 1. Subtle Artifacts (`0m – 300m`)
- **Color Distortion**: Mild red/cyan chromatic aberration text-shadows (`1px` offset) and slight phosphor edge glows.
- **Pixel Softening**: Faint mosaic filtering applied to internet photographs.
- **Micro Jitter**: Minimal local element vibration preserving typography legibility while hinting at instability.

### 2. Intermediate Decay & Fragmentation (`300m – 1500m`)
- **Pixelation**: Photographs downsample into noticeable retro pixel blocks (mosaic factor 4–8px).
- **Glitch Slicing**: Lateral displacement of horizontal image strips and card borders.
- **Fragmented Images**: Polygonal image shards break away from picture frames, floating with CSS clip-paths and twitching upon interaction.
- **Text Corruption**: Zalgo combining marks proliferate; unicode symbol substitution (`█`, `§`, `‡`) appears in telemetry titles.
- **Chaotic Layout Breakdown**: Unconstrained stream flow where items adopt variable widths (55%–110%), collide with negative top margins, skew diagonally, and fracture with jagged polygonal clip-paths.

### 3. Abstract & Aggressive Breakdown (`1500m+`)
- **Abstract Patterns**: Invasive full-width interference structures inserted into the stream.
- **Structural Collapses & Voids**: Diagonal hazard collapse ribbons and anomalous spatial void telemetry breaks slash across the feed.
- **Severe Text Decay**: Overlapping, melting typography and hex memory address leak logs.
- **High-Contrast Solarization**: Inverted negative patches and deep blood-red color crushing.
- **Demonic Biometric Alterations**: Sunken black eye cavities and weeping capillaries drawn onto faces.

---

## Abstract Aggressive Glitch Patterns (`AggressiveGlitchPattern.tsx`)

Renders mathematical noise and signal corruption structures directly into the stream:

- **Moiré Lattice**: High-frequency oscillating sinusoidal wave grids generating optical visual interference.
- **RAM Corruption Dump**: Rapidly updated hexadecimal memory dump fields with simulated address leaks (`0xDEAD...`).
- **Torn Hazard Slashes**: Aggressive diagonal hazard bars accompanied by sweeping horizontal tear lines.
- **Organic Void Bleed**: Pulsating organic dark tendrils rendered with radial Bézier contours.

---

## Localized Aggressive Shaking Engine (`useViolentShake.ts` & `index.css`)

The shake system isolates violent tremors strictly to individual elements, popups, and creepy visual artifacts rather than shaking the entire website viewport:
- **No Global Viewport Displacement**: The document root remains free of page-level translation and rotation, ensuring scrolling remains completely natural, fluid, and uninterrupted.
- **Targeted Element Shaking (`animate-element-shake`)**: Individual cards and warning panels execute multi-directional tremors (±8px, ±3deg) when shocks or high corruption thresholds occur.
- **Artifact Spasm (`animate-artifact-spasm`)**: Creepy visual artifacts—such as corrupted images, floating clip-path shards, tracking eyeball specimens, and panic triggers—vibrate at extreme high frequencies (50 Hz) with chromatic drop-shadow separation.
- **Popup Vibration (`animate-popup-vibrate`)**: System error dialogs shudder with rapid mechanical jitter without intercepting scroll gestures.

---

## Abstract Non-Blocking Jumpscare Layer (`JumpscareOverlay.tsx`)

Jumpscares are designed to catch users offguard with unexpected abstract system anomalies that never lock the screen or impede scrolling:

- **Non-Blocking Overlay**: The container maintains `pointer-events-none` throughout all events. Users are never blocked from scrolling through the page.
- **Abstract Anomaly Types**:
  1. `loud-crash-noise`: Sudden BSOD hardware acoustic rupture with high-gain wave clipping, accompanied by a momentary sub-frame phosphor flash.
  2. `corrupted-error-popup`: Authentic twitching system crash dialogs (`CRITICAL_STRUCTURE_CORRUPTION`, `KERNEL_SECURITY_CHECK_FAILURE`, `EXCEPTION_DOUBLE_FAULT`) anchored to viewport corners.
  3. `distorted-fetched-image`: Broken internet photographic specimens flashing briefly with intense chromatic aberration and jagged scanline tears.
  4. `abstract-signal-tear`: Sudden horizontal and diagonal scanline tears splitting across the screen.
- **Infrequent & Unpredictable Timing**: Governed by a minimum 45-second global cooldown and randomized depth milestones (e.g., 520m, 1950m, 4300m), ensuring long stretches of tension that catch the user completely offguard.

---

## CRT & VHS Overlay (`CrtVhsOverlay.tsx`)

- **Hardware-Accelerated Static Canvas**: A 160x120 noise canvas continuously drawn via `requestAnimationFrame` and CSS-stretched with `mix-blend-mode: screen`.
- **Scanlines**: Repeating CSS linear gradients at 3-pixel intervals mimicking cathode-ray phosphor grids.
- **Rolling Sync Bar**: A vertical gradient bar scrolling down the viewport simulating vertical hold loss.
- **Dynamic Vignette**: Inset radial shadows intensifying in darkness with virtual descent.
