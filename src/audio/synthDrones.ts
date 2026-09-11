/**
 * Single-purpose module: Procedural ambient background sound synthesis.
 * Generates continuous low-frequency dread drones, tape hiss, and hollow wind
 * that morph and destabilize as the depth increases.
 */

import { audioCore } from './audioContext';

export class AmbientDroneSynth {
  private isRunning = false;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  public start(): void {
    if (this.isRunning) return;
    const ctx = audioCore.getContext();
    const master = audioCore.getMasterDestination();
    if (!master) return;

    this.isRunning = true;
    const now = ctx.currentTime;

    // Drone gain node with smooth fade-in
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.0001, now);
    this.droneGain.gain.exponentialRampToValueAtTime(0.35, now + 3);

    // Resonant lowpass filter
    this.filterNode = ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(120, now);
    this.filterNode.Q.setValueAtTime(4, now);

    // Dual detuned dark oscillators (38Hz and 39.5Hz for binaural dread throbbing)
    this.osc1 = ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(38, now);

    this.osc2 = ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(39.5, now);

    // Deep sub-octave sine
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(28, now);

    // LFO for slow breathing/throbbing filter sweeps
    this.lfo = ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.12, now);
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.setValueAtTime(60, now);

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);

    this.osc1.connect(this.filterNode);
    this.osc2.connect(this.filterNode);
    this.subOsc.connect(this.filterNode);
    this.filterNode.connect(this.droneGain);
    this.droneGain.connect(master);

    this.osc1.start(now);
    this.osc2.start(now);
    this.subOsc.start(now);
    this.lfo.start(now);

    // Tape Hiss / Air Noise Buffer
    this.startNoiseBed(ctx, master);
  }

  private startNoiseBed(ctx: AudioContext, destination: GainNode): void {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    this.noiseNode = ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.02, ctx.currentTime);

    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(destination);

    this.noiseNode.start();
  }

  /**
   * Adjusts drone characteristics based on depth corruption (0 to 1)
   */
  public updateDepth(corruption: number): void {
    if (!this.isRunning || !this.filterNode || !this.lfo || !this.droneGain || !this.noiseGain) return;
    const ctx = audioCore.getContext();
    const now = ctx.currentTime;
    const c = Math.min(Math.max(corruption, 0), 1);

    // Filter frequency opens up and gets more menacing
    const targetFreq = 100 + c * 450;
    this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.4);

    // LFO accelerates
    const targetLfoRate = 0.12 + c * 1.8;
    this.lfo.frequency.setTargetAtTime(targetLfoRate, now, 0.4);

    // Noise bed becomes louder and harsher
    const targetNoiseGain = 0.02 + c * 0.12;
    this.noiseGain.gain.setTargetAtTime(targetNoiseGain, now, 0.4);

    // Drone volume increases slightly
    const targetDroneGain = 0.35 + c * 0.25;
    this.droneGain.gain.setTargetAtTime(targetDroneGain, now, 0.4);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    try {
      this.osc1?.stop();
      this.osc2?.stop();
      this.subOsc?.stop();
      this.lfo?.stop();
      this.noiseNode?.stop();
    } catch {
      // Ignore if already stopped
    }
  }
}
