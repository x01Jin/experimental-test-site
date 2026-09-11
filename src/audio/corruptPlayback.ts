/**
 * Shared depth-corruption voice for tape + radio playback.
 * One AudioContext (created/resumed inside the click gesture per MDN
 * autoplay best practices), one FX chain per element:
 *
 *   MediaElementSource -> WaveShaper (drive + quantize bitcrush)
 *     -> Biquad lowpass (+ optional highpass for AM-radio thinness)
 *     -> dropout Gain -> Analyser -> destination
 *
 * Plus wow/flutter playbackRate jitter, random skip-cuts, dropout mutes,
 * and a shared tape-hiss bed — all rates scaled by depth 0-1.
 * destroy() always leaves the element wired straight to destination,
 * so a tile can never go silent because of us.
 */

export interface CorruptOptions {
  drive: number;
  crushSteps: number;
  lowpassHz: number;
  highpassHz?: number;
  dropoutRate: number;
  dropoutMaxMs: number;
  wowDepth: number;
  hissGain: number;
  skipRate: number;
}

export interface CorruptVoice {
  analyser: AnalyserNode | null;
  setDepth: (c: number, base: CorruptOptions) => void;
  destroy: () => void;
}

let sharedCtx: AudioContext | null = null;
let sharedHiss: AudioBuffer | null = null;
/** an element can only be captured once — reuse the voice on re-attach */
const voices = new WeakMap<HTMLMediaElement, CorruptVoice>();

/** MUST be called from inside a user gesture (click). Safe to call often. */
export function ensureAudioContext(): AudioContext | null {
  try {
    if (!sharedCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      sharedCtx = new AC();
    }
    if (sharedCtx.state === 'suspended') {
      sharedCtx.resume().catch(() => { /* stays suspended — caller plays plain */ });
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

function getHissBuffer(ctx: AudioContext): AudioBuffer {
  if (!sharedHiss) {
    const len = ctx.sampleRate * 2;
    sharedHiss = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = sharedHiss.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return sharedHiss;
}

/** drive + quantize in one curve: overdrive grit plus cheap bitcrush steps. */
function buildCurve(drive: number, crushSteps: number): Float32Array {
  const n = 1024;
  const curve = new Float32Array(n);
  const k = Math.max(0, drive);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    let y: number;
    if (k < 0.5) {
      y = x;
    } else {
      y = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    if (crushSteps > 0) {
      const step = 2 / crushSteps;
      y = Math.round(y / step) * step;
    }
    curve[i] = Math.max(-1, Math.min(1, y));
  }
  return curve;
}

export function attachCorruption(el: HTMLMediaElement, opts: CorruptOptions): CorruptVoice | null {
  const existing = voices.get(el);
  if (existing) {
    existing.setDepth(1, opts);
    return existing;
  }
  const ctx = ensureAudioContext();
  if (!ctx) return null;

  try {
    const src = ctx.createMediaElementSource(el);
    const shaper = ctx.createWaveShaper();
    shaper.oversample = '2x';
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.Q.value = 0.6;
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    const dropout = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    src.connect(shaper);
    shaper.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(dropout);
    dropout.connect(analyser);
    analyser.connect(ctx.destination);

    // tape-hiss bed from one shared noise buffer
    const hissSrc = ctx.createBufferSource();
    hissSrc.buffer = getHissBuffer(ctx);
    hissSrc.loop = true;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0;
    hissSrc.connect(hissGain);
    hissGain.connect(ctx.destination);
    try {
      hissSrc.start();
    } catch { /* already started */ }

    let rates = { ...opts };
    let timer: number | null = null;

    const applyStatic = (o: CorruptOptions) => {
      shaper.curve = buildCurve(o.drive, o.crushSteps);
      lowpass.frequency.value = Math.max(120, Math.min(19000, o.lowpassHz));
      highpass.frequency.value = Math.max(10, Math.min(4000, o.highpassHz ?? 10));
      hissGain.gain.value = Math.max(0, Math.min(0.12, o.hissGain));
    };
    applyStatic(opts);

    // one slow scheduler drives dropouts, wow/flutter, skip-cuts
    timer = window.setInterval(() => {
      if (el.paused) return;
      const t = ctx.currentTime;
      // dropout: brief mute, deeper = more often + longer
      if (rates.dropoutRate > 0.02 && Math.random() < rates.dropoutRate * 0.25) {
        const ms = 40 + Math.random() * rates.dropoutMaxMs;
        try {
          dropout.gain.cancelScheduledValues(t);
          dropout.gain.setValueAtTime(0, t);
          dropout.gain.linearRampToValueAtTime(1, t + ms / 1000);
        } catch { /* noop */ }
      }
      // wow/flutter: wander playbackRate around 1
      if (rates.wowDepth > 0.004) {
        try {
          el.playbackRate = 1 + (Math.random() * 2 - 1) * rates.wowDepth;
        } catch { /* noop */ }
      }
      // skip-cut: tape chewed a chunk out
      if (
        rates.skipRate > 0.05 &&
        Math.random() < rates.skipRate / 240 &&
        Number.isFinite(el.duration) &&
        el.duration > 20
      ) {
        try {
          el.currentTime = Math.min(
            el.duration - 2,
            Math.max(0, el.currentTime + (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 2.5))
          );
        } catch { /* noop */ }
      }
    }, 250);

    const voice: CorruptVoice = {
      analyser,
      setDepth: (_c, o) => {
        rates = { ...o };
        try {
          applyStatic(o);
        } catch { /* noop */ }
      },
      destroy: () => {
        if (timer !== null) {
          window.clearInterval(timer);
          timer = null;
        }
        try {
          hissSrc.stop();
        } catch { /* noop */ }
        try {
          src.disconnect();
          shaper.disconnect();
          lowpass.disconnect();
          highpass.disconnect();
          dropout.disconnect();
          analyser.disconnect();
          hissGain.disconnect();
          // leave the element audible — straight to speakers
          src.connect(ctx.destination);
        } catch { /* noop */ }
        voices.delete(el);
      },
    };
    voices.set(el, voice);
    return voice;
  } catch {
    return null;
  }
}
