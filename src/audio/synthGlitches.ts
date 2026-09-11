/**
 * Single-purpose module: Procedural PC Crash, BSOD lockup & hardware error audio synthesis.
 * Emulates the authentic sounds of a computer crashing:
 * - BSOD DMA audio buffer repeat loop (mechanical buzzing freeze)
 * - Randomly pitch-stretched and duration-adjusted static tears
 * - Memory bus parity errors & hardware lockup stutters
 * - Hard power drop clicks
 */

import { audioCore } from './audioContext';

// Hard-clipping wave shaper for brutal digital distortion
function createHardClipCurve(): Float32Array {
  const n = 1024;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; ++i) {
    const x = (i * 2) / n - 1;
    // Hard digital saturation
    curve[i] = Math.max(-0.85, Math.min(0.85, x * 4.5));
  }
  return curve;
}

export class BrokenComputerSynth {
  private clipCurve = createHardClipCurve();

  /**
   * Plays authentic BSOD Audio Freeze / DMA Buffer Lockup.
   * When Windows / Linux crashes, the sound card's cyclic DMA buffer repeats a micro-slice
   * (e.g. 5ms - 25ms) indefinitely, creating a signature mechanical buzzy lockup drone.
   */
  public playBsodLockup(intensity = 1, customDuration?: number): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    // Sustained lockup: 1.2s–2.8s so it reads as a loud broken crash, not a pluck.
    const duration = customDuration || (1.2 + Math.random() * 1.6 * Math.min(intensity, 2));

    // Choose authentic crash fundamental frequencies (73Hz, 98Hz, 123Hz, 147Hz, 185Hz, 240Hz, 330Hz)
    const crashFreqs = [73, 98, 123, 147, 185, 220, 261, 330];
    const baseFreq = crashFreqs[Math.floor(Math.random() * crashFreqs.length)];

    // Random pitch stretch factor
    const pitchStretch = 0.5 + Math.random() * 1.5;
    const finalFreq = baseFreq * pitchStretch;

    // Dual pulse/saw oscillators for harsh metallic beating
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(finalFreq, now);
    // Slight detuning for metallic ring-mod friction
    osc2.frequency.setValueAtTime(finalFreq * 1.015 + (Math.random() - 0.5) * 6, now);

    // Rapid DMA buffer stutter gating (35Hz to 75Hz square modulation)
    const stutterLfo = ctx.createOscillator();
    stutterLfo.type = 'square';
    stutterLfo.frequency.setValueAtTime(35 + Math.random() * 40, now);

    const stutterGain = ctx.createGain();
    stutterGain.gain.setValueAtTime(0.4, now);
    stutterLfo.connect(stutterGain.gain);

    // Distortion WaveShaper (4x oversample reduces aliasing on harsh highs)
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.clipCurve;
    distortion.oversample = '4x';

    // Resonant bandpass to shape harsh chassis buzz
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(Math.min(finalFreq * 2.8, 3800), now);
    filter.Q.setValueAtTime(3 + intensity * 2, now);

    // Amplitude envelope with sharp 0ms digital attack
    const mainGain = ctx.createGain();
    const peakVolume = Math.min(0.38 * intensity, 0.65);
    mainGain.gain.setValueAtTime(peakVolume, now);
    // Sudden hard digital cut off at end
    mainGain.gain.setValueAtTime(peakVolume, now + duration * 0.85);
    mainGain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc1.connect(distortion);
    osc2.connect(distortion);
    distortion.connect(filter);
    filter.connect(stutterGain);
    stutterGain.connect(mainGain);
    mainGain.connect(master);

    osc1.start(now);
    osc2.start(now);
    stutterLfo.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    stutterLfo.stop(now + duration);

    // Prevent long-session graph leaks
    const cleanup = () => {
      try {
        osc1.disconnect(); osc2.disconnect(); stutterLfo.disconnect();
        stutterGain.disconnect(); distortion.disconnect();
        filter.disconnect(); mainGain.disconnect();
      } catch { /* already disconnected */ }
    };
    osc1.onended = cleanup;
  }

  /**
   * Generates harsh digital static with randomly adjusted pitch stretch and duration.
   */
  public playPitchStretchedStatic(intensity = 1, customDuration?: number): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    // Sustained static tear: 1.0s–2.2s flat sustain + hard cut (was 60–400ms pluck)
    const duration = customDuration || (1.0 + Math.random() * 1.2);

    // Create noise buffer with discrete quantized bit-steps
    const sampleCount = Math.floor(ctx.sampleRate * Math.max(duration * 2, 0.4));
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // 4-bit quantized digital noise
    const bitDepth = 16;
    for (let i = 0; i < sampleCount; i++) {
      const raw = Math.random() * 2 - 1;
      data[i] = Math.round(raw * bitDepth) / bitDepth;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Pitch stretch: random playbackRate (0.35x low rumble up to 3.2x high-frequency static arc)
    const stretchRates = [0.38, 0.55, 0.85, 1.2, 1.8, 2.7, 3.4];
    const pitchStretch = stretchRates[Math.floor(Math.random() * stretchRates.length)];
    source.playbackRate.setValueAtTime(pitchStretch, now);

    // Random filter selection: Notch or Bandpass
    const filter = ctx.createBiquadFilter();
    const filterTypes: BiquadFilterType[] = ['bandpass', 'notch', 'highpass'];
    filter.type = filterTypes[Math.floor(Math.random() * filterTypes.length)];
    filter.frequency.setValueAtTime(800 + Math.random() * 3200, now);
    filter.Q.setValueAtTime(2 + Math.random() * 6, now);

    const gain = ctx.createGain();
    const volume = Math.min(0.35 * intensity, 0.6);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.003); // 3ms attack
    // Flat broken-machine sustain, then hard digital cut (no bouncy exp decay)
    gain.gain.setValueAtTime(volume, now + duration * 0.85);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    source.start(now);
    source.stop(now + duration);
    source.onended = () => {
      try { source.disconnect(); filter.disconnect(); gain.disconnect(); } catch { /* noop */ }
    };
  }

  /**
   * Memory bus parity growl / register overflow error.
   * Low-register (90–240Hz) sustained grind — was 880–3520Hz squeaky hops.
   */
  public playMemoryBusParitySqueal(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.7 + Math.random() * 0.6;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';

    // Low discrete register grind (no cartoon slides, no squeaky highs)
    const registers = [92, 110, 138, 165, 196, 233];
    const stepCount = 4;
    for (let s = 0; s < stepCount; s++) {
      const stepTime = now + (duration / stepCount) * s;
      const regFreq = registers[Math.floor(Math.random() * registers.length)];
      osc.frequency.setValueAtTime(regFreq, stepTime);
    }

    const distortion = ctx.createWaveShaper();
    distortion.curve = this.clipCurve;
    distortion.oversample = '4x';

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(2, now);

    const gain = ctx.createGain();
    const peak = Math.min(0.3 * intensity, 0.55);
    gain.gain.setValueAtTime(peak, now);
    gain.gain.setValueAtTime(peak, now + duration * 0.85);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    osc.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + duration);
    osc.onended = () => {
      try { osc.disconnect(); distortion.disconnect(); filter.disconnect(); gain.disconnect(); } catch { /* noop */ }
    };
  }

  /**
   * Hardware power cutout pop / relay trip.
   */
  public playHardwareRelayTrip(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.012);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Hard DC click pop
    for (let s = 0; s < bufferSize; s++) {
      data[s] = (Math.random() * 2 - 1) * Math.exp(-s / (bufferSize * 0.18));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.35 * intensity, 0.6), now);

    noise.connect(gain);
    gain.connect(master);

    noise.start(now);
    noise.stop(now + 0.015);
  }

  /**
   * Randomly triggers one of the authentic computer crash sounds.
   * Weighted to sustained BSOD/static (loud long broken), growl relay rare.
   */
  public triggerRandomGlitch(intensity = 1): void {
    const roll = Math.random();
    if (roll < 0.5) {
      this.playBsodLockup(intensity);
    } else if (roll < 0.88) {
      this.playPitchStretchedStatic(intensity);
    } else if (roll < 0.96) {
      this.playMemoryBusParitySqueal(intensity);
    } else {
      this.playHardwareRelayTrip(intensity);
    }
  }

  // Backwards compatibility aliases for callers
  public playDialUpScreech(intensity = 1): void {
    this.playBsodLockup(intensity);
  }

  public playHardDriveThrash(intensity = 1): void {
    this.playPitchStretchedStatic(intensity);
  }

  public playBitcrushChirp(intensity = 1): void {
    this.playMemoryBusParitySqueal(intensity);
  }

  public playBufferStutter(intensity = 1): void {
    this.playBsodLockup(intensity * 1.2, 1.4);
  }
}

export const brokenComputerSynth = new BrokenComputerSynth();
