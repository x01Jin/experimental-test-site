/**
 * Single-purpose module: Visceral shock stabs, microtonal cluster screeches,
 * high-voltage electrical bursts, bone crunches, and phantom numbers station beeps.
 * Provides immense auditory diversity so players never hear the same jumpscare or shock sound twice.
 */

import { audioCore } from './audioContext';

export class HorrorStabsSynth {
  /**
   * Dissonant microtonal cluster chord screech (Penderecki Threnody style).
   * Multiple quarter-tone detuned sine/saw oscillators creating horrifying acoustic beating.
   */
  public playDissonantCluster(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.35 + Math.random() * 0.45;

    // Cluster root pitch
    const rootPitches = [660, 880, 1174, 1480, 1760];
    const root = rootPitches[Math.floor(Math.random() * rootPitches.length)];

    // Microtonal offsets in Hz (creating dense, nauseating acoustic friction)
    const offsets = [-48, -22, 0, 18, 37, 65, 93];

    const clusterGain = ctx.createGain();
    const peakVol = Math.min(0.38 * intensity, 0.65);
    clusterGain.gain.setValueAtTime(peakVol, now);
    clusterGain.gain.setValueAtTime(peakVol * 0.8, now + duration * 0.7);
    clusterGain.gain.linearRampToValueAtTime(0.0001, now + duration);

    // Highpass filter to strip muddiness and accentuate piercing shriek
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(500, now);

    offsets.forEach(offset => {
      const osc = ctx.createOscillator();
      osc.type = Math.random() > 0.5 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(root + offset, now);
      // Slight pitch waver
      osc.frequency.linearRampToValueAtTime(root + offset + (Math.random() - 0.5) * 30, now + duration);

      osc.connect(hp);
      osc.start(now);
      osc.stop(now + duration);
    });

    hp.connect(clusterGain);
    clusterGain.connect(master);
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
   * Sub-bass void drop: Visceral seismic bass dive shaking headphones.
   */
  public playSubVoidDrop(intensity = 1): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.8 + Math.random() * 0.6;

    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(20, now + duration);

    const gain = ctx.createGain();
    const vol = Math.min(0.45 * intensity, 0.7);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    sub.connect(gain);
    gain.connect(master);

    sub.start(now);
    sub.stop(now + duration);
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
