/**
 * Single-purpose module: Procedural fatal crash screech & pitch-stretched static synthesis.
 * Replaces cartoonish vocal slides with authentic, terrifying audio hardware lockup screeches,
 * brutal pitch-stretched static tears, and abrupt power-loss transients.
 */

import { audioCore } from './audioContext';

// Hard-clipping wave shaper for abrasive distortion
function makeBrutalDistortionCurve(amount = 80): Float32Array {
  const n_samples = 2048;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + amount) * x * 25 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export class ScreamStaticSynth {
  private distortionCurve = makeBrutalDistortionCurve(100);

  /**
   * Generates a sudden piercing static burst with randomly adjusted pitch stretch and duration.
   * Free of cartoonish frequency slides.
   */
  public playPiercingStaticBurst(intensity = 1, customDuration?: number): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    // Sustained burst: 1.2s–2.2s flat + hard cut (was 80–400ms pluck)
    const duration = customDuration || (1.2 + Math.random() * 1.0 * Math.min(intensity, 2));

    // High energy white / pink digital noise
    const bufferSize = Math.floor(ctx.sampleRate * Math.max(duration * 2, 0.4));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // 8-bit quantized noise for raw digital bite
      data[i] = Math.round((Math.random() * 2 - 1) * 32) / 32;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Pitch stretch: randomly choose between sluggish digital drag (0.4x) and high shrill arc (3.0x)
    const stretchFactors = [0.42, 0.65, 0.95, 1.4, 2.2, 3.1];
    const pitchStretch = stretchFactors[Math.floor(Math.random() * stretchFactors.length)];
    noiseSource.playbackRate.setValueAtTime(pitchStretch, now);

    // Resonant bandpass or notch filter (fixed frequency, NO goofy slides!)
    const filter = ctx.createBiquadFilter();
    filter.type = Math.random() > 0.4 ? 'bandpass' : 'notch';
    const centerFreq = 1200 + Math.random() * 3400;
    filter.frequency.setValueAtTime(centerFreq, now);
    filter.Q.setValueAtTime(4 + intensity * 3, now);

    const gain = ctx.createGain();
    const maxGain = Math.min(0.48 * intensity, 0.75);
    // Instantaneous 0ms digital attack, flat sustain, hard cut
    gain.gain.setValueAtTime(maxGain, now);
    gain.gain.setValueAtTime(maxGain * 0.9, now + duration * 0.85);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
    noiseSource.onended = () => {
      try { noiseSource.disconnect(); filter.disconnect(); gain.disconnect(); } catch { /* noop */ }
    };
  }

  /**
   * Generates a horrifying digital driver lockup screech / DAC buffer crash scream.
   * Free of cartoon slides. Uses audio-rate ring modulation and extreme saturation.
   */
  public playHardwareCrashScreech(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    // Sustained lockup screech: 1.5s–2.8s (was 0.16–0.46s)
    const duration = 1.5 + Math.random() * 1.3 * Math.min(intensity, 1.8);

    // Low crushed crash pitches (was 880–2637Hz squeal) — broken machine grind
    const crashFreqs = [110, 147, 185, 220, 294, 370];
    const baseFreq = crashFreqs[Math.floor(Math.random() * crashFreqs.length)];

    const carrier1 = ctx.createOscillator();
    carrier1.type = 'sawtooth';
    carrier1.frequency.setValueAtTime(baseFreq, now);

    const carrier2 = ctx.createOscillator();
    carrier2.type = 'square';
    carrier2.frequency.setValueAtTime(baseFreq * 1.503, now);

    // High-speed audio-rate ring modulator (creates abrasive metallic shriek)
    const modulator = ctx.createOscillator();
    modulator.type = 'sawtooth';
    modulator.frequency.setValueAtTime(140 + Math.random() * 160, now);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(600 * intensity, now);
    modulator.connect(carrier1.frequency);
    modulator.connect(carrier2.frequency);

    // WaveShaper distortion node (4x oversample for harsh highs)
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.distortionCurve;
    distortion.oversample = '4x';

    // Resonant bandpass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 1.2, now);
    filter.Q.setValueAtTime(3.5, now);

    // Sudden 0ms attack envelope
    const gain = ctx.createGain();
    const peakVolume = Math.min(0.42 * intensity, 0.75);
    gain.gain.setValueAtTime(peakVolume, now);
    gain.gain.setValueAtTime(peakVolume * 0.8, now + duration * 0.82);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    carrier1.connect(distortion);
    carrier2.connect(distortion);
    distortion.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    carrier1.start(now);
    carrier2.start(now);
    modulator.start(now);

    carrier1.stop(now + duration);
    carrier2.stop(now + duration);
    modulator.stop(now + duration);
    carrier1.onended = () => {
      try {
        carrier1.disconnect(); carrier2.disconnect(); modulator.disconnect();
        modGain.disconnect(); distortion.disconnect(); filter.disconnect(); gain.disconnect();
      } catch { /* noop */ }
    };

    // Layer with pitch-stretched static tear
    this.playPiercingStaticBurst(intensity * 1.1, Math.min(duration * 0.9, 2.2));
    // Layer with abrupt hardware power-loss thud
    this.playSubBassThud(now, intensity);
  }

  /**
   * Alias for backward compatibility with existing callers
   */
  public playScream(intensity = 1): void {
    this.playHardwareCrashScreech(intensity);
  }

  /**
   * Visceral low-frequency DC impulse thud (hardware power cutout)
   */
  public playSubBassThud(startTime: number, intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = startTime || ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.linearRampToValueAtTime(30, now + 0.3);

    gain.gain.setValueAtTime(Math.min(0.45 * intensity, 0.7), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 0.46);
    osc.onended = () => {
      try { osc.disconnect(); gain.disconnect(); } catch { /* noop */ }
    };
  }
}

export const screamStaticSynth = new ScreamStaticSynth();
