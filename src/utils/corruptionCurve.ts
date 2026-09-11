/**
 * Single source of truth for depth-driven destruction.
 * All media (text, image, video, audio) derive from the same 0-1 curve
 * so everything rots together as you go down.
 */

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
  };
}

/** Deterministic pick so the same depth renders the same fragment (no flicker). */
export function seededPick<T>(pool: T[], seed: number): T {
  return pool[Math.abs(Math.floor(seed)) % pool.length];
}
