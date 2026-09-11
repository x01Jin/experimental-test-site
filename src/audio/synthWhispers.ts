/**
 * Single-purpose module: Procedural vocal formant whisper & phantom murmur synthesis.
 * Uses acoustic vowel formant modeling (F1, F2, F3 parallel bandpass filters)
 * excited by shaped breath noise and pitch-irregular vocal folds to create
 * genuine, unsettling phantom whispers that pan through the stereo field.
 */

import { audioCore } from './audioContext';

interface FormantProfile {
  name: string;
  f1: number;
  f2: number;
  f3: number;
}

const VOWEL_FORMANTS: FormantProfile[] = [
  { name: 'a', f1: 730, f2: 1090, f3: 2440 },
  { name: 'i', f1: 280, f2: 2280, f3: 3010 },
  { name: 'u', f1: 320, f2: 880, f3: 2250 },
  { name: 'e', f1: 530, f2: 1840, f3: 2480 },
  { name: 'o', f1: 580, f2: 850, f3: 2420 }
];

export class VocalWhisperSynth {
  /**
   * Plays an uncanny, breathy phoneme sequence that mimics an entity whispering into the user's ear.
   */
  public playEerieWhisper(intensity = 1, stereoPan = 0): void {
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master || audioCore.getIsMuted()) return;

    const now = ctx.currentTime;
    const duration = 0.8 + Math.random() * 1.4; // 0.8s to 2.2s phrase

    // Generate breath noise source
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * (duration + 0.2));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const channelData = noiseBuffer.getChannelData(0);

    // Filtered pinkish air turbulence with breathing amplitude swell
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.1983086;
      b2 = 0.57000 * b2 + white * 0.2926014;
      const pink = b0 + b1 + b2 + white * 0.1848;
      // Irregular breath flutter
      const progress = i / bufferSize;
      const breathingEnvelope = Math.sin(progress * Math.PI) * (0.8 + Math.sin(progress * 18) * 0.2);
      channelData[i] = pink * 0.12 * breathingEnvelope;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Parallel formant filter bank
    const vowelA = VOWEL_FORMANTS[Math.floor(Math.random() * VOWEL_FORMANTS.length)];
    const vowelB = VOWEL_FORMANTS[Math.floor(Math.random() * VOWEL_FORMANTS.length)];

    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(vowelA.f1, now);
    f1.frequency.exponentialRampToValueAtTime(vowelB.f1, now + duration);
    f1.Q.setValueAtTime(12, now);

    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(vowelA.f2, now);
    f2.frequency.exponentialRampToValueAtTime(vowelB.f2, now + duration);
    f2.Q.setValueAtTime(14, now);

    const f3 = ctx.createBiquadFilter();
    f3.type = 'bandpass';
    f3.frequency.setValueAtTime(vowelA.f3, now);
    f3.frequency.exponentialRampToValueAtTime(vowelB.f3, now + duration);
    f3.Q.setValueAtTime(16, now);

    // Summing node for formants
    const formantMixer = ctx.createGain();
    formantMixer.gain.setValueAtTime(1.8, now);

    noiseSource.connect(f1);
    noiseSource.connect(f2);
    noiseSource.connect(f3);

    f1.connect(formantMixer);
    f2.connect(formantMixer);
    f3.connect(formantMixer);

    // Subtle sibilance / teeth friction filter
    const sibilance = ctx.createBiquadFilter();
    sibilance.type = 'highpass';
    sibilance.frequency.setValueAtTime(4500, now);
    sibilance.Q.setValueAtTime(1.5, now);

    const sibilanceGain = ctx.createGain();
    sibilanceGain.gain.setValueAtTime(0.08, now);
    noiseSource.connect(sibilance);
    sibilance.connect(sibilanceGain);
    sibilanceGain.connect(formantMixer);

    // Master whisper gain envelope
    const whisperGain = ctx.createGain();
    const volume = Math.min(0.28 * intensity, 0.45);
    whisperGain.gain.setValueAtTime(0.0001, now);
    whisperGain.gain.linearRampToValueAtTime(volume, now + duration * 0.25);
    whisperGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Stereo panner for spatial disorientation
    let panner: StereoPannerNode | null = null;
    if (ctx.createStereoPanner) {
      panner = ctx.createStereoPanner();
      const panTarget = stereoPan !== 0 ? stereoPan : (Math.random() > 0.5 ? 0.75 : -0.75);
      panner.pan.setValueAtTime(panTarget, now);
      panner.pan.linearRampToValueAtTime(panTarget * -0.5, now + duration);
    }

    if (panner) {
      formantMixer.connect(whisperGain);
      whisperGain.connect(panner);
      panner.connect(master);
    } else {
      formantMixer.connect(whisperGain);
      whisperGain.connect(master);
    }

    noiseSource.start(now);
    noiseSource.stop(now + duration + 0.05);
  }

  /**
   * Rapid unintelligible demonic mutter/chatter in the background
   */
  public playMutteringChorus(intensity = 1): void {
    const mutterCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < mutterCount; i++) {
      const pan = (i / (mutterCount - 1 || 1)) * 1.6 - 0.8;
      const delay = i * 140 + Math.random() * 100;
      setTimeout(() => {
        this.playEerieWhisper(intensity * 0.75, pan);
      }, delay);
    }
  }
}

export const vocalWhisperSynth = new VocalWhisperSynth();
