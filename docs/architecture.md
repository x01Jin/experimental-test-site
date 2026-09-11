# System Architecture

## Overview

**Experimental Test Site** is a client-side React 19 + TypeScript single-page app. Sound is synthesized with Web Audio, visuals with Canvas 2D.

---

## Script Modularity & Component Hierarchy

```
src/
├── types/
│   └── horror.ts                  # Shared data interfaces (DepthState, JumpscareEvent, HorrorItem, HorrorItemType)
├── utils/
│   ├── zalgo.ts                   # Algorithmic unicode text corruption
│   ├── scaryTexts.ts              # Curated psychological narrative lore templates and eldritch logs
│   ├── proceduralNarrative.ts     # Combinatorial procedural horror content generator with depth tiering
│   ├── layoutChaos.ts             # Procedural layout chaos, non-Euclidean transforms, and asymmetric geometry
│   ├── internetImages.ts          # Curated CDN internet image specimens, categories, and smart correlation
│   └── imageCorruptor.ts          # Real-time HTML5 Canvas pixelator, glitch slicer, and chromatic shader
├── audio/
│   ├── audioContext.ts            # AudioContext singleton, master gain, and safety dynamics limiter
│   ├── synthDrones.ts             # Low-frequency sub-bass and dread wind oscillator generator
│   ├── synthGlitches.ts           # BSOD DMA buffer lockup, pitch-stretched static, and hardware coil whine
│   ├── synthScreams.ts            # Hardware-level crash screeches, hard-clipping distortion, and static bursts
│   ├── synthWhispers.ts           # Acoustic vowel formant modeling (F1/F2/F3 bandpass filters) and murmurs
│   ├── synthAtmosphere.ts         # Metal groans, cardiac lub-dub pulses, cistern drips, and geiger crackles
│   ├── synthHorrorStabs.ts        # Microtonal cluster chords, bone snaps, electrical arcs, and numbers stations
│   └── horrorAudioEngine.ts       # Master audio orchestrator coordinating depth scaling and non-repeating schedules
├── effects/
│   ├── useDepthTracker.ts         # Window scroll depth, velocity, and tier evaluation hook
│   ├── useViolentShake.ts         # Physical trauma and shock state hook for localized element shaking
│   └── nightmareFaces.ts          # Canvas rendering algorithms for entities and tracking eyes
└── components/
    ├── WarningScreen.tsx          # Initial sensory advisory and AudioContext unlock entry gate
    ├── HudStatus.tsx              # Sticky telemetry HUD (depth, corruption, heart rate, volume controls)
    ├── HorrorCanvas.tsx           # Background canvas tracking user cursor with biological eyes
    ├── HorrorTile.tsx             # Modular card rendering anomaly reports, redactions, and interactive widgets
    ├── RedactedText.tsx           # Interactive classified blackout blocks with click/hover disclosure
    ├── InteractiveAudioLog.tsx    # Recovered black-box audio player with animated canvas waveform
    ├── CursedRadioScanner.tsx     # Frequency tuner dial with heterodyne sweeps and phantom broadcasts
    ├── HeartbeatMonitor.tsx       # Biometric cardiac pulse visualizer with EKG sweep line and lub-dub audio
    ├── CctvMatrixViewer.tsx       # Multi-channel surveillance matrix with live switcher controls
    ├── CorruptedImage.tsx         # Corrupted internet image specimen with detached floating shards
    ├── AggressiveGlitchPattern.tsx# Canvas-driven aggressive noise and mathematical interference lattices
    ├── InfiniteHorrorStream.tsx   # Unconstrained fractured stream generator interleaving procedural items and curated lore
    ├── StructuralCollapseRibbon.tsx# Diagonal caution rupture tape and memory corruption banners
    ├── CrtVhsOverlay.tsx          # Analog CRT scanlines, static noise, and chromatic fringe
    ├── JumpscareOverlay.tsx       # Abstract non-blocking jumpscare layer (crashes, popups, distorted photos)
    └── App.tsx                    # Root orchestrator coordinating components and effects
```

---

## Data Flow

1. **User Interaction & Entry**:
   - `WarningScreen` captures the initial user click, satisfying browser autoplay policies, un-suspending the `AudioContext`, and initiating baseline ambient drones via `horrorAudioEngine`.

2. **Scroll Telemetry**:
   - `useDepthTracker` measures window scroll position (`1px = 0.4m`) and velocity (`px/ms`).
   - Calculates the corruption index (`0%` to `100%`) and determines the active depth tier (`surface`, `decay`, `breakdown`, `nightmare`, `abyss`).

3. **Audio-Visual Synchronous Feedback**:
   - Depth metrics are delivered to `horrorAudioEngine`, altering the resonant lowpass filter of ambient drones and shortening the interval between ambient sound events.
   - Depth metrics drive `InfiniteHorrorStream` to synthesize an unconstrained fractured layout stream where items drift laterally, vary in width (45%–118%), collide with negative vertical margins, exhibit polygonal clipping fractures, and feature asymmetric borders.
   - Milestone depths or sudden rapid scrolling dispatch an abstract `JumpscareEvent` to `JumpscareOverlay` and trigger localized element/popup shaking via CSS keyframe animations.
