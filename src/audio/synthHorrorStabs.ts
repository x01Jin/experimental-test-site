/**
 * Single-purpose module: Visceral shock stabs, microtonal cluster screeches,
 * high-voltage electrical bursts, bone crunches, and phantom numbers station beeps.
 * Provides immense auditory diversity so players never hear the same jumpscare or shock sound twice.
 */

import { audioCore } from './audioContext';

export class HorrorStabsSynth {
  /**
   * Dissonant microtonal cluster chord screech (Penderecki Threnody style).
   * Low crushing register (110–330Hz) sustained — was 660–1760Hz squeaky.
   */
  public playDissonantCluster(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 1.0 + Math.random() * 1.2;

    // Cluster root pitch — low crushed register
    const rootPitches = [110, 147, 185, 220, 262, 330];
    const root = rootPitches[Math.floor(Math.random() * rootPitches.length)];

    // Microtonal offsets in Hz (creating dense, nauseating acoustic friction)
    const offsets = [-48, -22, 0, 18, 37, 65, 93];

    const clusterGain = ctx.createGain();
    const peakVol = Math.min(0.38 * intensity, 0.65);
    clusterGain.gain.setValueAtTime(peakVol, now);
    clusterGain.gain.setValueAtTime(peakVol * 0.85, now + duration * 0.8);
    clusterGain.gain.linearRampToValueAtTime(0.0001, now + duration);

    // Lowpass to keep body, strip squeaky highs (was highpass 500)
    const hp = ctx.createBiquadFilter();
    hp.type = 'lowpass';
    hp.frequency.setValueAtTime(2400, now);

    const oscs: OscillatorNode[] = [];
    offsets.forEach(offset => {
      const osc = ctx.createOscillator();
      osc.type = Math.random() > 0.5 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(Math.max(30, root + offset), now);
      // Minimal drift (±5Hz) — was ±15Hz seasick waver
      osc.frequency.linearRampToValueAtTime(root + offset + (Math.random() - 0.5) * 10, now + duration);

      osc.connect(hp);
      osc.start(now);
      osc.stop(now + duration);
      oscs.push(osc);
    });

    hp.connect(clusterGain);
    clusterGain.connect(master);
    oscs[0].onended = () => {
      try { oscs.forEach(o => o.disconnect()); hp.disconnect(); clusterGain.disconnect(); } catch { /* noop */ }
    };
  }

  /**
   * Visceral anatomical bone snap & organic tear.
   * Instantaneous high-energy crack transient followed by short wet resonance.
   */
  public playBoneSnap(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;

    // Snap transient (ultra-short click)
    const snapOsc = ctx.createOscillator();
    snapOsc.type = 'square';
    snapOsc.frequency.setValueAtTime(2800, now);
    snapOsc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

    const snapGain = ctx.createGain();
    const snapVol = Math.min(0.48 * intensity, 0.7);
    snapGain.gain.setValueAtTime(snapVol, now);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    snapOsc.connect(snapGain);
    snapGain.connect(master);
    snapOsc.start(now);
    snapOsc.stop(now + 0.07);

    // Wet low impact
    const impactOsc = ctx.createOscillator();
    impactOsc.type = 'sine';
    impactOsc.frequency.setValueAtTime(120, now);
    impactOsc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

    const impactGain = ctx.createGain();
    impactGain.gain.setValueAtTime(Math.min(0.42 * intensity, 0.65), now);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    impactOsc.connect(impactGain);
    impactGain.connect(master);
    impactOsc.start(now);
    impactOsc.stop(now + 0.23);
  }

  /**
   * High-voltage electrical transformer arc discharge.
   * 60Hz hum buzzing into scorching white-hot electrical sparks.
   */
  public playElectricalArc(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.22 + Math.random() * 0.28;

    // 60Hz transformer mains fundamental + odd harmonics (180Hz, 300Hz)
    const mainsOsc = ctx.createOscillator();
    mainsOsc.type = 'sawtooth';
    mainsOsc.frequency.setValueAtTime(60, now);

    // Rapid random spark AM modulator
    const sparkMod = ctx.createOscillator();
    sparkMod.type = 'square';
    sparkMod.frequency.setValueAtTime(120 + Math.random() * 180, now);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.6, now);
    sparkMod.connect(modGain.gain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800 + Math.random() * 1400, now);
    filter.Q.setValueAtTime(2.5, now);

    const mainGain = ctx.createGain();
    const vol = Math.min(0.4 * intensity, 0.65);
    mainGain.gain.setValueAtTime(vol, now);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    mainsOsc.connect(filter);
    filter.connect(modGain);
    modGain.connect(mainGain);
    mainGain.connect(master);

    mainsOsc.start(now);
    sparkMod.start(now);
    mainsOsc.stop(now + duration);
    sparkMod.stop(now + duration);
  }

  /**
   * Sub-bass void lock: sustained distorted low freeze (was cartoon 110→20Hz dive).
   * Flat 55–90Hz saw+square + stutter, 1.2–2.2s — broken-machine weight, no fall.
   */
  public playSubVoidDrop(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 1.2 + Math.random() * 1.0;

    const baseFreq = 55 + Math.random() * 35;
    const sub1 = ctx.createOscillator();
    sub1.type = 'sawtooth';
    sub1.frequency.setValueAtTime(baseFreq, now);

    const sub2 = ctx.createOscillator();
    sub2.type = 'square';
    sub2.frequency.setValueAtTime(baseFreq * 1.01, now);

    const stutter = ctx.createOscillator();
    stutter.type = 'square';
    stutter.frequency.setValueAtTime(28 + Math.random() * 20, now);
    const stutterGain = ctx.createGain();
    stutterGain.gain.setValueAtTime(0.5, now);
    stutter.connect(stutterGain.gain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    const gain = ctx.createGain();
    const vol = Math.min(0.45 * intensity, 0.7);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.setValueAtTime(vol, now + duration * 0.85);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);

    sub1.connect(filter);
    sub2.connect(filter);
    filter.connect(stutterGain);
    stutterGain.connect(gain);
    gain.connect(master);

    sub1.start(now);
    sub2.start(now);
    stutter.start(now);
    sub1.stop(now + duration);
    sub2.stop(now + duration);
    stutter.stop(now + duration);
    sub1.onended = () => {
      try { sub1.disconnect(); sub2.disconnect(); stutter.disconnect(); stutterGain.disconnect(); filter.disconnect(); gain.disconnect(); } catch { /* noop */ }
    };
  }

  /**
   * Cursed Numbers Station Synth: Haunting sine beeps reciting mysterious sequences.
   */
  public playNumbersStationBeeps(intensity = 1, noteCount = 4): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const frequencies = [740, 880, 987, 1046, 1174, 1318];
    const now = ctx.currentTime;
    const noteDuration = 0.12;

    for (let i = 0; i < noteCount; i++) {
      const startTime = now + i * 0.18;
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const gain = ctx.createGain();
      const vol = Math.min(0.18 * intensity, 0.3);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(master);

      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.02);
    }
  }

  /**
   * Radio scanner frequency sweep with heterodyne whistle
   */
  public playRadioFrequencySweep(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.28;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const startFreq = 800 + Math.random() * 1200;
    const endFreq = startFreq + (Math.random() > 0.5 ? 1200 : -600);
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(100, endFreq), now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.2 * intensity, 0.35), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const horrorStabsSynth = new HorrorStabsSynth();
