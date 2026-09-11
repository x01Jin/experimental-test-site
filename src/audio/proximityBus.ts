/**
 * One shared scroll listener driving proximity audio for every mounted
 * media tile. Kinds:
 *  - clip: the 2 nearest playing clips get sound, rest stay muted
 *  - tape: manual-play tapes, audible only when scrolled near
 *  - radio: pure visibility sentinels (no element) — feeds the global
 *    background radio its bed/full gain target
 * Master volume/mute live here too so one HUD control silences everything.
 */

export type ProximityKind = 'clip' | 'tape' | 'radio';

export interface ProximityEntry {
  /** null for radio sentinels — visibility only, no element to drive */
  el: HTMLMediaElement | null;
  box: HTMLElement;
  kind: ProximityKind;
  /** dropout gate 0-1, chews holes in the volume when deep */
  gate: { v: number };
  onAudible?: (audible: boolean) => void;
}

const registry = new Set<ProximityEntry>();
const presenceListeners = new Set<(anyVisible: boolean) => void>();
let lastPresence = false;
let proximityWired = false;
let masterVolume = 0.8;
let masterMuted = false;
let updateFn: (() => void) | null = null;

/** run one proximity pass immediately (HUD mute shouldn't lag a beat) */
export function nudgeProximity(): void {
  updateFn?.();
}

export function setMasterVolume(v: number): void {
  masterVolume = Math.max(0, Math.min(1, v));
}

export function setMasterMuted(m: boolean): void {
  masterMuted = m;
}

export function getMasterVolume(): number {
  return masterMuted ? 0 : masterVolume;
}

export function registerProximity(entry: ProximityEntry): () => void {
  wireProximity();
  registry.add(entry);
  return () => {
    registry.delete(entry);
  };
}

export function onRadioPresence(fn: (anyVisible: boolean) => void): () => void {
  presenceListeners.add(fn);
  fn(lastPresence);
  return () => {
    presenceListeners.delete(fn);
  };
}

function wireProximity() {
  if (proximityWired || typeof window === 'undefined') return;
  proximityWired = true;
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight || 800;
    const master = getMasterVolume();
    const clips: { entry: ProximityEntry; vol: number }[] = [];

    registry.forEach(entry => {
      const r = entry.box.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - vh / 2);
      const prox = Math.max(0, 1 - dist / (vh * 0.9));
      const inView = r.bottom > -200 && r.top < vh + 200;

      if (entry.kind === 'radio') {
        entry.onAudible?.(inView);
        return;
      }
      if (!entry.el || entry.el.paused) {
        entry.onAudible?.(false);
        return;
      }
      if (entry.kind === 'clip') {
        clips.push({ entry, vol: prox });
        return;
      }
      // tape: audible only when near, never otherwise
      const audible = prox > 0.05 && master > 0;
      entry.el.muted = !audible;
      if (audible) entry.el.volume = Math.min(1, prox) * entry.gate.v * master;
      entry.onAudible?.(audible);
    });

    // only the 2 nearest clips get sound — the rest stay muted
    clips.sort((a, b) => b.vol - a.vol);
    clips.forEach((s, i) => {
      const audible = i < 2 && s.vol > 0.05 && master > 0;
      if (!s.entry.el) return;
      s.entry.el.muted = !audible;
      if (audible) s.entry.el.volume = Math.min(1, s.vol) * s.entry.gate.v * master;
      s.entry.onAudible?.(audible);
    });

    // radio presence: any sentinel on screen?
    let anyVisible = false;
    registry.forEach(entry => {
      if (entry.kind !== 'radio') return;
      const r = entry.box.getBoundingClientRect();
      if (r.bottom > -200 && r.top < vh + 200) anyVisible = true;
    });
    if (anyVisible !== lastPresence) {
      lastPresence = anyVisible;
      presenceListeners.forEach(fn => {
        try {
          fn(anyVisible);
        } catch { /* noop */ }
      });
    }
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  window.setInterval(update, 800);
  updateFn = update;
  update();
}
