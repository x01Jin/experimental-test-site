# Procedural Audio Engine

## Overview

The audio engine synthesizes all sound effects, ambient atmospheres, vocal murmurs, and jumpscare shocks in real time using the native browser **Web Audio API**. There are zero external audio samples or audio asset dependencies. The system operates across distinct physical and psychological synthesis domains:
- Electronic hardware failures (BSOD crashes, locked DMA buffers, coil whines)
- Acoustic vocal formant modeling (F1/F2/F3 parallel bandpass filters mimicking human whispers)
- Environmental industrial/organic atmospheres (buckling steel groans, cardiac lub-dub pulses, geiger counter clicks, cistern drips)
- Microtonal cluster shocks (Penderecki-style detuned chords, bone snaps, electrical arcs, and numbers station beeps)

---

## Audio Pipeline

```
[ Oscillators / Noise Buffers ]
              │
              ▼
   [ Biquad Filters / Waveshapers / Formants ]
              │
              ▼
    [ Stereo Panner / Spatial Nodes ]
              │
              ▼
        [ Gain Nodes ]
              │
              ▼
     [ Master Gain Node ]
              │
              ▼
 [ DynamicsCompressorNode (Safety Limiter) ]
              │
              ▼
     [ AudioContext.destination ]
```

### Safety Limiting
A `DynamicsCompressorNode` is placed directly ahead of `AudioContext.destination` to prevent digital driver clipping during intense layered audio events while preserving maximum dynamic presence:
- **Threshold**: -3 dB
- **Knee**: 4 dB
- **Ratio**: 16:1
- **Attack**: 0.002s
- **Release**: 0.15s

---

## Synthesis Modules

### 1. Ambient Sub-Surface Drone (`synthDrones.ts`)
- **Oscillator Layers**:
  - `Oscillator 1`: Sawtooth waveform at 38 Hz.
  - `Oscillator 2`: Triangle waveform at 39.5 Hz (producing a 1.5 Hz binaural acoustic beating effect).
  - `Sub-Oscillator`: Pure sine wave at 28 Hz.
- **Filter Sweep**: A resonant lowpass filter modulated by a low-frequency oscillator (`0.12 Hz` to `1.8 Hz` based on corruption level).
- **Tape Hiss Generator**: Looped random white noise buffer shaped by a bandpass filter (`800 Hz`, Q = 1.5).

### 2. Broken Computer & BSOD Glitches (`synthGlitches.ts`)
- **Locked DMA Buffer Loop**: Simulates a kernel panic where the sound card's DMA audio buffer freezes into an ultra-fast repeating loop. Uses high-frequency square pulse bursts scheduled at micro-intervals (8ms to 35ms) across 12 to 28 repetitions with random duration and resonant filter bite.
- **Pitch-Stretched Static Burst**: A raw white noise buffer modulated through an exponential frequency curve. Randomized pitch-shifts and time-stretches create the characteristic granular tearing of a crashed sound driver.
- **Fatal Hardware Fault Transient & Coil Whine**: An immediate sub-millisecond DC click paired with an ultra-high frequency inductive squeal (3.5 kHz to 8.2 kHz) and resonant bandpass filter, simulating inductor vibration during sudden power cutoffs.
- **Memory Dump Bit-Shred**: Multi-frequency stepped waveforms rapidly skipping across dissonant pitches to represent unhandled memory register dumps.

### 3. Vocal Formant Whispers & Murmurs (`synthWhispers.ts`)
- **Vocal Tract Acoustic Modeling**: Uses parallel bandpass filters corresponding to human vowel formants (F1, F2, F3 frequencies for /a/, /i/, /u/, /e/, /o/) excited by shaped pink breath noise.
- **Stereo Spatialization**: Directs whispers to alternate ears via `StereoPannerNode` with moving spatial trajectories.
- **Muttering Chorus**: Rapid, unintelligible asynchronous murmur loops simulating multiple phantoms speaking simultaneously.

### 4. Environmental Atmosphere (`synthAtmosphere.ts`)
- **Structural Metal Groan**: Low fundamental carrier (55 Hz - 90 Hz) modulated by a tritone dissonance modulator, simulating subterranean structural stress.
- **Cardiac Lub-Dub Pulse**: Dual sub-bass sine pulses at 48 Hz (ventricular contraction) and 58 Hz (valve closure) matching anatomical heartbeat intervals.
- **Subterranean Cave Drip**: Downward frequency chirp passing through a resonant cavity filter.
- **Geiger Radiation Burst**: Poisson-distributed high-frequency square clicks simulating ionizing radiation detection.
- **Subterranean Pressure Vent**: Bandpass-filtered air turbulence simulating pressure equalization.

### 5. Visceral Horror Stabs & Musical Shock (`synthHorrorStabs.ts`)
- **Dissonant Microtonal Cluster**: 7 quarter-tone detuned oscillators creating acoustic friction and nausea.
- **Anatomical Bone Snap**: Instantaneous high-frequency click transient followed by a wet low-frequency impact.
- **Electrical Arc Explosion**: 60 Hz mains buzz coupled with random square-wave AM modulation and bandpass filtration.
- **Sub-Bass Void Drop**: Exponential dive from 110 Hz down to 20 Hz.
- **Cursed Numbers Station**: Haunting synthesized sine tones reciting pseudo-random harmonic sequences.
- **Radio Scanner Sweep**: Frequency-modulated carrier sweeps with heterodyne whistle.

---

## Dynamic Orchestration (`horrorAudioEngine.ts`)

- **Anti-Repetition Tracking**: Tracks previous audio events to ensure no ambient sound repeats consecutively.
- **Interval Contraction**: Dynamic intervals scale smoothly from ~9 seconds at the surface down to ~1.4 seconds at abyssal depths.
- **Multi-Recipe Jumpscares**: Five distinct audio recipes for jumpscares (cluster screech + bone snap, electrical explosion + static tear, DMA hardware lockup + muttering chorus, crash screech + void drop, layered static blast) so every jumpscare sounds distinct.
- **Interactive Component Hooks**: Direct audio triggers for redaction disclosure, radio tuning, and biometric cardiac stress.
