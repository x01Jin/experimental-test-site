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
    // Duration randomly varies (e.g. 80ms to 420ms)
    const duration = customDuration || (0.08 + Math.random() * 0.32 * Math.min(intensity, 2));

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
    // Instantaneous 0ms digital attack
    gain.gain.setValueAtTime(maxGain, now);
    gain.gain.setValueAtTime(maxGain * 0.9, now + duration * 0.8);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
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
    // Duration randomly adjusts: 0.18s to 0.48s
    const duration = 0.16 + Math.random() * 0.3 * Math.min(intensity, 1.8);

    // Primary carrier tuned to harsh electronic crash pitches (no downward slide!)
    const crashFreqs = [880, 1174, 1480, 1760, 2217, 2637];
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

    // WaveShaper distortion node
    const distortion = ctx.createWaveShaper();
    distortion.curve = this.distortionCurve;

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

    // Layer with pitch-stretched static tear
    this.playPiercingStaticBurst(intensity * 1.1, duration * 0.9);
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
    osc.frequency.linearRampToValueAtTime(25, now + 0.15);

    gain.gain.setValueAtTime(Math.min(0.45 * intensity, 0.7), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 0.23);
  }
}

export const screamStaticSynth = new ScreamStaticSynth();
