/**
 * Single-purpose module: Master horror audio orchestrator.
 * Dynamically conducts multi-layered soundscapes:
 * - Sub-bass drone & tape hiss bed with depth frequency tracking
 * - Uncanny stereo vocal formant whispers and muttering entities
 * - Organic/industrial environmental events (metal groans, cardiac thumps, cistern drips, geiger clicks)
 * - Authentic hardware crash failures (BSOD lockup, DMA stutter, parity squeals, relay trips)
 * - Varied jumpscare shocks (microtonal cluster screeches, bone snaps, electrical arc bursts, sub-drops)
 * - Specialized interactive triggers (radio scanner sweeps, classified redaction reveals, cardiac stress)
 */

import { audioCore } from './audioContext';
import { AmbientDroneSynth } from './synthDrones';
import { brokenComputerSynth } from './synthGlitches';
import { screamStaticSynth } from './synthScreams';
import { atmosphereSynth } from './synthAtmosphere';
import { vocalWhisperSynth } from './synthWhispers';
import { horrorStabsSynth } from './synthHorrorStabs';

export type AmbientEventType =
  | 'broken-pc'
  | 'vocal-whisper'
  | 'muttering-chorus'
  | 'metal-groan'
  | 'cardiac-pulse'
  | 'cistern-drip'
  | 'geiger-burst'
  | 'pressure-vent'
  | 'numbers-station'
  | 'radio-sweep';

class HorrorAudioEngine {
  private droneSynth = new AmbientDroneSynth();
  private ambienceTimer: number | null = null;
  private isInitialized = false;
  private currentCorruption = 0; // 0 to 1
  private lastEventType: AmbientEventType | null = null;

  public async initialize(): Promise<boolean> {
    const success = await audioCore.unlock();
    if (success && !this.isInitialized) {
      this.isInitialized = true;
      this.droneSynth.start();
      this.scheduleNextAmbienceEvent();
    }
    return success;
  }

  public getIsReady(): boolean {
    return this.isInitialized && audioCore.getUnlocked();
  }

  public updateDepth(_depthMeters: number, corruptionLevel: number): void {
    this.currentCorruption = Math.min(Math.max(corruptionLevel / 100, 0), 1);
    this.droneSynth.updateDepth(this.currentCorruption);
  }

  /**
   * Schedules a varied cycle of ambient atmospheric, psychological, and hardware sound events.
   * Uses weighted randomness with anti-repetition tracking so no sound repeats consecutively.
   */
  private scheduleNextAmbienceEvent(): void {
    if (this.ambienceTimer !== null) {
      window.clearTimeout(this.ambienceTimer);
    }

    // Interval contracts from ~9s at surface to ~1.4s at deep abyss
    const baseDelay = 9000 - this.currentCorruption * 7500;
    const randomizedDelay = baseDelay * (0.6 + Math.random() * 0.8);

    this.ambienceTimer = window.setTimeout(() => {
      if (this.isInitialized && !audioCore.getIsMuted()) {
        this.triggerVariedAmbientSound();
      }
      this.scheduleNextAmbienceEvent();
    }, randomizedDelay);
  }

  /**
   * Executes a randomized ambient sound with guaranteed variety across categories
   */
  public triggerVariedAmbientSound(): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;

    const availableEvents: AmbientEventType[] = [
      'broken-pc',
      'vocal-whisper',
      'muttering-chorus',
      'metal-groan',
      'cardiac-pulse',
      'cistern-drip',
      'geiger-burst',
      'pressure-vent',
      'numbers-station',
      'radio-sweep'
    ];

    // Filter out the immediate previous event to prevent consecutive repetition
    const pool = availableEvents.filter(e => e !== this.lastEventType);
    const chosenEvent = pool[Math.floor(Math.random() * pool.length)];
    this.lastEventType = chosenEvent;

    const intensity = 0.7 + this.currentCorruption * 0.8;

    switch (chosenEvent) {
      case 'broken-pc':
        brokenComputerSynth.triggerRandomGlitch(intensity);
        break;
      case 'vocal-whisper':
        vocalWhisperSynth.playEerieWhisper(intensity);
        break;
      case 'muttering-chorus':
        vocalWhisperSynth.playMutteringChorus(intensity);
        break;
      case 'metal-groan':
        atmosphereSynth.playMetalGroan(intensity);
        break;
      case 'cardiac-pulse':
        atmosphereSynth.playCardiacThump(intensity);
        break;
      case 'cistern-drip':
        atmosphereSynth.playCaveDrip(intensity);
        break;
      case 'geiger-burst':
        atmosphereSynth.playGeigerBurst(intensity, 8 + Math.floor(this.currentCorruption * 14));
        break;
      case 'pressure-vent':
        atmosphereSynth.playPressureVent(intensity);
        break;
      case 'numbers-station':
        horrorStabsSynth.playNumbersStationBeeps(intensity, 4 + Math.floor(Math.random() * 3));
        break;
      case 'radio-sweep':
        horrorStabsSynth.playRadioFrequencySweep(intensity);
        break;
    }
  }

  /**
   * Triggered on user interactions with anomaly cards or warnings
   */
  public triggerAggressiveEvent(intensity = 1): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;

    const roll = Math.random();
    if (roll < 0.3) {
      brokenComputerSynth.triggerRandomGlitch(intensity);
    } else if (roll < 0.55) {
      vocalWhisperSynth.playEerieWhisper(intensity);
    } else if (roll < 0.75) {
      horrorStabsSynth.playElectricalArc(intensity);
    } else if (roll < 0.9) {
      horrorStabsSynth.playBoneSnap(intensity);
    } else {
      screamStaticSynth.playPiercingStaticBurst(intensity);
    }
  }

  /**
   * Triggered when a violent jumpscare occurs.
   * Uses diverse audio shock recipes instead of playing the same screech every time.
   */
  public triggerJumpscare(intensity = 1.5, _withScream = true): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;

    const effectiveIntensity = intensity * (1 + this.currentCorruption * 0.75);
    const shockRecipe = Math.floor(Math.random() * 5);

    switch (shockRecipe) {
      case 0:
        // Recipe 1: Microtonal cluster screech + bone snap + sub bass thud
        horrorStabsSynth.playDissonantCluster(effectiveIntensity);
        horrorStabsSynth.playBoneSnap(effectiveIntensity);
        screamStaticSynth.playSubBassThud(0, effectiveIntensity);
        break;
      case 1:
        // Recipe 2: High-voltage electrical explosion + static tear
        horrorStabsSynth.playElectricalArc(effectiveIntensity * 1.2);
        screamStaticSynth.playPiercingStaticBurst(effectiveIntensity);
        break;
      case 2:
        // Recipe 3: Brutal DMA hardware freeze + muttering chorus
        brokenComputerSynth.playBsodLockup(effectiveIntensity * 1.3, 0.35);
        vocalWhisperSynth.playMutteringChorus(effectiveIntensity);
        horrorStabsSynth.playSubVoidDrop(effectiveIntensity);
        break;
      case 3:
        // Recipe 4: Hardware crash screech + sub void dive
        screamStaticSynth.playHardwareCrashScreech(effectiveIntensity);
        horrorStabsSynth.playSubVoidDrop(effectiveIntensity);
        break;
      case 4:
      default:
        // Recipe 5: Layered static blast + bone snap + pitch-stretched noise
        screamStaticSynth.playPiercingStaticBurst(effectiveIntensity * 1.2);
        horrorStabsSynth.playBoneSnap(effectiveIntensity);
        brokenComputerSynth.playPitchStretchedStatic(effectiveIntensity);
        break;
    }
  }

  // Interactive component audio hooks
  public playRedactionReveal(intensity = 1): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    vocalWhisperSynth.playEerieWhisper(intensity * 0.85);
    brokenComputerSynth.playPitchStretchedStatic(0.5, 0.08);
  }

  public playRadioScannerDial(intensity = 1): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    horrorStabsSynth.playRadioFrequencySweep(intensity * 0.8);
    brokenComputerSynth.playPitchStretchedStatic(0.4, 0.05);
  }

  public playCardiacPulse(intensity = 1): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    atmosphereSynth.playCardiacThump(intensity);
  }

  public playGeigerClick(intensity = 1): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    atmosphereSynth.playGeigerBurst(intensity, 4);
  }

  public playAudioLogTapeStart(): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    brokenComputerSynth.playHardwareRelayTrip(0.9);
    atmosphereSynth.playPressureVent(0.6);
    setTimeout(() => {
      vocalWhisperSynth.playEerieWhisper(1.1);
    }, 200);
  }

  public triggerDirectScream(intensity = 1.5): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    horrorStabsSynth.playDissonantCluster(intensity);
  }

  public triggerDirectStatic(intensity = 1.5): void {
    if (!this.isInitialized || audioCore.getIsMuted()) return;
    screamStaticSynth.playPiercingStaticBurst(intensity);
  }

  public toggleMute(): boolean {
    return audioCore.toggleMute();
  }

  public getIsMuted(): boolean {
    return audioCore.getIsMuted();
  }

  public setVolume(vol: number): void {
    audioCore.setVolume(vol);
  }

  public getVolume(): number {
    return audioCore.getVolume();
  }

  public cleanup(): void {
    if (this.ambienceTimer !== null) {
      window.clearTimeout(this.ambienceTimer);
      this.ambienceTimer = null;
    }
    this.droneSynth.stop();
    this.isInitialized = false;
  }
}

export const horrorAudioEngine = new HorrorAudioEngine();
