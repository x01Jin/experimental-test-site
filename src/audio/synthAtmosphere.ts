/**
 * Single-purpose module: Environmental horror atmosphere synthesis.
 * Synthesizes organic and industrial environmental horrors:
 * - Subterranean structural steel groans & buckling metal
 * - Anatomical cardiac pulse (sub-bass lub-dub thuds)
 * - Echoing cistern water drips / biological squelches
 * - Geiger counter ionizing radiation crackle
 * - Antique wire recorder surface static
 */

import { audioCore } from './audioContext';

export class AtmosphereSynth {
  /**
   * Deep structural metal groan / buckling hull stress.
   * Simulates thousands of tons of concrete and steel groaning under pressure.
   */
  public playMetalGroan(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 1.6 + Math.random() * 1.8;

    // Carrier oscillator (low fundamental with slow pitch sag)
    const baseFreq = 55 + Math.random() * 35;
    const carrier = ctx.createOscillator();
    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(baseFreq, now);
    carrier.frequency.exponentialRampToValueAtTime(baseFreq * 0.78, now + duration);

    // Modulator for resonant metallic ring
    const mod = ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.setValueAtTime(baseFreq * 1.414, now); // Tracing tritone dissonance
    mod.frequency.linearRampToValueAtTime(baseFreq * 1.25, now + duration);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(baseFreq * 1.5, now);
    mod.connect(modGain);
    modGain.connect(carrier.frequency);

    // Resonant bandpass filter to shape metallic hollow resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(160 + Math.random() * 120, now);
    filter.Q.setValueAtTime(6, now);

    const gain = ctx.createGain();
    const peakVol = Math.min(0.32 * intensity, 0.5);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakVol, now + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    carrier.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    carrier.start(now);
    mod.start(now);
    carrier.stop(now + duration);
    mod.stop(now + duration);
  }

  /**
   * Anatomical cardiac pulse: Authentic physiological lub-dub double thump.
   */
  public playCardiacThump(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const playThump = (time: number, freq: number, gainVal: number, decay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + decay);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gainVal, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

      osc.connect(gain);
      gain.connect(master);

      osc.start(time);
      osc.stop(time + decay);
    };

    const vol = Math.min(0.4 * intensity, 0.65);
    // "Lub" (ventricular contraction)
    playThump(now, 48, vol, 0.16);
    // "Dub" (aortic valve closure, slightly higher frequency, 0.15s later)
    playThump(now + 0.14, 58, vol * 0.75, 0.14);
  }

  /**
   * Wet subterranean water drip echoing into darkness
   */
  public playCaveDrip(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const startPitch = 1200 + Math.random() * 800;
    const endPitch = startPitch * (0.6 + Math.random() * 0.5);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startPitch, now);
    osc.frequency.exponentialRampToValueAtTime(endPitch, now + 0.08);

    const gain = ctx.createGain();
    const vol = Math.min(0.22 * intensity, 0.35);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    // Resonant cavity filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(endPitch, now);
    filter.Q.setValueAtTime(4, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Geiger counter ionizing radiation bursts (Poisson distribution crackles)
   */
  public playGeigerBurst(intensity = 1, clicksCount = 7): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const count = Math.min(Math.floor(clicksCount * intensity), 30);

    for (let i = 0; i < count; i++) {
      const clickTime = now + Math.random() * 0.5;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2400 + Math.random() * 1200, clickTime);

      const clickVol = (0.08 + Math.random() * 0.12) * Math.min(intensity, 1.5);
      gain.gain.setValueAtTime(clickVol, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.006);

      osc.connect(gain);
      gain.connect(master);

      osc.start(clickTime);
      osc.stop(clickTime + 0.008);
    }
  }

  /**
   * Subterranean pressure equalization hiss
   */
  public playPressureVent(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.9 + Math.random() * 0.7;

    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + duration);
    filter.Q.setValueAtTime(3, now);

    const gain = ctx.createGain();
    const vol = Math.min(0.24 * intensity, 0.4);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }
}

export const atmosphereSynth = new AtmosphereSynth();
