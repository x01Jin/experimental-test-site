/**
 * Single-purpose module: Web Audio API Context lifecycle,
 * master volume control, unlock handling, and master safety limiter.
 */

class AudioCore {
  private ctx: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private limiterNode: DynamicsCompressorNode | null = null;
  private isUnlocked = false;
  private volume = 0.9;
  private isMuted = false;

  public getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master limiter: loud broken-machine crashes but safe from driver clipping.
      // Threshold -1dB (was -3dB) lets hard-clipped BSOD transients through.
      this.limiterNode = this.ctx.createDynamicsCompressor();
      this.limiterNode.threshold.setValueAtTime(-1, this.ctx.currentTime);
      this.limiterNode.knee.setValueAtTime(4, this.ctx.currentTime);
      this.limiterNode.ratio.setValueAtTime(16, this.ctx.currentTime);
      this.limiterNode.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.limiterNode.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.masterGainNode.connect(this.limiterNode);
      this.limiterNode.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public getMasterDestination(): GainNode | null {
    this.getContext();
    return this.masterGainNode;
  }

  public async unlock(): Promise<boolean> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      }
    }
    this.isUnlocked = ctx.state === 'running';
    return this.isUnlocked;
  }

  public getUnlocked(): boolean {
    return this.isUnlocked && (this.ctx?.state === 'running');
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGainNode && this.ctx && !this.isMuted) {
      this.masterGainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGainNode && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioCore = new AudioCore();
