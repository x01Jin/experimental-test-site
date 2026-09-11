/**
 * Single source of truth for depth-driven destruction.
 * All media (text, image, video, audio) derive from the same 0-1 curve
 * so everything rots together as you go down.
 */

export interface AudioCorruption {
  /** waveshaper drive 0-100 (MDN makeDistortionCurve k) */
  drive: number;
  /** quantize steps for cheap bitcrush (0 = off) */
  crushSteps: number;
  /** lowpass cutoff Hz — muffle as you sink */
  lowpassHz: number;
  /** dropout scheduler: events per second at full gate */
  dropoutRate: number;
  /** longest dropout ms */
  dropoutMaxMs: number;
  /** wow/flutter playbackRate jitter depth */
  wowDepth: number;
  /** hiss bed gain 0-1 */
  hissGain: number;
  /** skip-cut jumps per minute */
  skipRate: number;
}

export interface VideoCorruption {
  /** SVG rgb-split channel offset px (0 = filter off) */
  rgbDx: number;
  /** tear-bar flash events per second */
  tearRate: number;
  /** skip-cut jumps per minute */
  skipRate: number;
  /** frame-freeze chance per second 0-1 */
  freezeChance: number;
  /** longest freeze ms */
  freezeMaxMs: number;
}

export interface CorruptionParams {
  /** 0-1 */
  c: number;
  /** severity bucket 0-4, for caching expensive renders */
  bucket: number;
  /** zalgo intensity for titles */
  titleDecay: number;
  /** zalgo intensity for bodies */
  bodyDecay: number;
  /** pixelation + rgb shift strength */
  pixelDecay: number;
  /** slice / tear count */
  sliceCount: number;
  /** css filter string for video/img */
  cssFilter: string;
  /** audio crush 0-1 */
  audioCrush: number;
  /** video playback wobble */
  playbackWobble: number;
  /** waveshaper/filter/dropout voice for tape + radio */
  audio: AudioCorruption;
  /** rgb-split/tear/skip/freeze voice for clips */
  videoFx: VideoCorruption;
}

export function getCorruptionParams(depthMeters: number): CorruptionParams {
  const c = Math.min(1, Math.max(0, depthMeters / 4000));
  const bucket = c < 0.15 ? 0 : c < 0.35 ? 1 : c < 0.6 ? 2 : c < 0.85 ? 3 : 4;

  const contrast = 100 + c * 120;
  const saturate = Math.max(20, 100 - c * 80);
  const hue = Math.floor(c * 40);
  const brightness = 100 - c * 30;

  return {
    c,
    bucket,
    titleDecay: c * 0.35,
    bodyDecay: Math.min(1, 0.08 + c * 0.75),
    pixelDecay: c,
    sliceCount: Math.floor(c * 9),
    cssFilter: `contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg) brightness(${brightness}%)`,
    audioCrush: c,
    playbackWobble: c * 0.35,
    audio: {
      drive: c * 120,
      crushSteps: c < 0.35 ? 0 : c < 0.6 ? 32 : c < 0.85 ? 12 : 6,
      lowpassHz: 18000 - c * 17400,
      dropoutRate: c * 1.6,
      dropoutMaxMs: 60 + c * 340,
      wowDepth: c * 0.08,
      hissGain: c * 0.05,
      skipRate: c * 6,
    },
    videoFx: {
      rgbDx: bucket < 2 ? 0 : bucket === 2 ? 2 : bucket === 3 ? 4 : 7,
      tearRate: c * 1.2,
      skipRate: c * 8,
      freezeChance: c < 0.5 ? 0 : (c - 0.5) * 0.8,
      freezeMaxMs: 120 + c * 280,
    },
  };
}

/** Deterministic pick so the same depth renders the same fragment (no flicker). */
export function seededPick<T>(pool: T[], seed: number): T {
  return pool[Math.abs(Math.floor(seed)) % pool.length];
}
