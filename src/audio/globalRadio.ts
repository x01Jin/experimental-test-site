/**
 * Global background radio. One singleton <audio> element owned by this
 * module (never unmounted — it isn't in the React tree at all), one shared
 * dial state every radio tile reads and writes, one corruption voice that
 * rots harder the deeper you scroll.
 *
 * Store pattern per react.dev useSyncExternalStore: a tiny module store,
 * no dependencies. The element starts on entry (user gesture), tuned to a
 * live channel, as a quiet bed that swells to full when any radio tile is
 * on screen — never fully muted by distance, only by the HUD mute.
 */

import { useSyncExternalStore } from 'react';
import { AUDIO_CLIPS } from '../utils/foundVerbatim';
import { getCorruptionParams } from '../utils/corruptionCurve';
import { attachCorruption, ensureAudioContext, CorruptVoice } from './corruptPlayback';
import { onRadioPresence, getMasterVolume, setMasterMuted as busSetMuted } from './proximityBus';

export interface RadioSnapshot {
  /** shared dial position, kHz */
  freq: number;
  /** index into AUDIO_CLIPS currently on air, -1 = dead air */
  liveClip: number;
  /** has the background station been started (post-entry) */
  started: boolean;
  /** audible station right now (not dead air) */
  onAir: boolean;
}

let snapshot: RadioSnapshot = { freq: 114.2, liveClip: -1, started: false, onAir: false };
let listeners: Array<() => void> = [];

function emit() {
  listeners.forEach(l => {
    try {
      l();
    } catch { /* noop */ }
  });
}

function setSnap(patch: Partial<RadioSnapshot>) {
  snapshot = { ...snapshot, ...patch };
  emit();
}

export function subscribeRadio(fn: () => void): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function getRadioSnapshot(): RadioSnapshot {
  return snapshot;
}

export function useRadioState(): RadioSnapshot {
  return useSyncExternalStore(subscribeRadio, getRadioSnapshot, getRadioSnapshot);
}

// --- singleton element + voice -------------------------------------------

let el: HTMLAudioElement | null = null;
let voice: CorruptVoice | null = null;
let plainFallback = false;
let lastBucket = -1;
let bedLevel = 0.25;
let levelTimer: number | null = null;

function amVoice(depthMeters: number) {
  const p = getCorruptionParams(depthMeters);
  return {
    ...p.audio,
    drive: p.audio.drive + 40,
    lowpassHz: Math.min(p.audio.lowpassHz, 5200 - p.c * 4400),
    highpassHz: 220 + p.c * 380,
  };
}

function playClip(idx: number) {
  if (!el) return;
  const clip = AUDIO_CLIPS[idx % AUDIO_CLIPS.length];
  if (!clip) return;
  if (!el.src.endsWith(encodeURI(clip.url)) && el.src !== clip.url) {
    el.src = clip.url;
    el.load();
  }
  const go = () => {
    if (!el) return;
    if (Number.isFinite(el.duration) && el.duration > 15) {
      try {
        el.currentTime = 5 + Math.random() * (el.duration - 10);
      } catch { /* noop */ }
    }
    el.play().catch(() => { /* gesture will come */ });
  };
  if (el.readyState >= 1) go();
  else el.onloadedmetadata = go;
}

/** tune the shared dial; null clip = dead air (background ducks out) */
export function tuneRadio(freq: number, clipIdx: number | null) {
  if (clipIdx === null || clipIdx < 0) {
    setSnap({ freq, liveClip: -1, onAir: false });
    try {
      el?.pause();
    } catch { /* noop */ }
    return;
  }
  setSnap({ freq, liveClip: clipIdx, onAir: true });
  playClip(clipIdx);
}

/**
 * Start the background station. Call from the entry gesture.
 * Picks a live channel at random and fades the bed in underneath.
 */
export function startGlobalRadio() {
  if (typeof window === 'undefined' || el) return;
  ensureAudioContext();
  el = new Audio();
  el.crossOrigin = 'anonymous';
  el.preload = 'auto';
  el.loop = false;
  el.volume = 0;
  el.addEventListener('error', () => {
    if (!el || plainFallback) return;
    plainFallback = true;
    try {
      voice?.destroy();
    } catch { /* noop */ }
    voice = null;
    el.removeAttribute('crossorigin');
    el.load();
    if (snapshot.onAir) el.play().catch(() => { /* noop */ });
  });

  if (!plainFallback) {
    voice = attachCorruption(el, amVoice(0));
  }

  // bed/full level follows radio-tile presence; master always applies
  onRadioPresence(visible => {
    bedLevel = visible ? 1 : 0.25;
  });
  if (levelTimer === null) {
    levelTimer = window.setInterval(() => {
      if (!el) return;
      const master = getMasterVolume();
      try {
        el.muted = master <= 0;
        const target = bedLevel * master * (snapshot.onAir ? 1 : 0.35);
        el.volume = el.volume + (target - el.volume) * 0.35;
      } catch { /* noop */ }
    }, 400);
  }

  const idx = Math.floor(Math.random() * AUDIO_CLIPS.length);
  setSnap({ started: true });
  tuneRadio(100 + Math.random() * 300, idx);
}

/** live depth → voice params, throttled to bucket changes (no curve rebuild spam) */
export function updateRadioDepth(depthMeters: number) {
  if (!voice) return;
  const p = getCorruptionParams(depthMeters);
  if (p.bucket === lastBucket) return;
  lastBucket = p.bucket;
  try {
    voice.setDepth(p.c, amVoice(depthMeters));
  } catch { /* noop */ }
}

/** HUD master mute also ducks the background station immediately */
export function setRadioMuted(m: boolean) {
  busSetMuted(m);
  try {
    if (el) el.muted = m || getMasterVolume() <= 0;
  } catch { /* noop */ }
}
