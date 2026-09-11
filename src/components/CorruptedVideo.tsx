/**
 * Depth-rotted film loop. Direct mp4, preloaded before encounter,
 * autoplays muted, starts at a random spot, loops a random ≤12s window.
 * Sound is proximity-based: louder as you scroll onto it, gone past it.
 * Pattern per React docs: video driven through refs + effects (react.dev:
 * manipulating-the-dom-with-refs, synchronizing-with-effects, onTimeUpdate).
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { getCorruptionParams } from '../utils/corruptionCurve';
import { randomLoopWindow } from '../utils/foundVerbatim';

/** one shared scroll listener drives volume for every mounted loop */
const registry = new Set<{ el: HTMLVideoElement; box: HTMLElement }>();
let proximityWired = false;

function wireProximity() {
  if (proximityWired || typeof window === 'undefined') return;
  proximityWired = true;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight || 800;
    const scored: { el: HTMLVideoElement; vol: number }[] = [];
    registry.forEach(entry => {
      if (entry.el.paused) return;
      const r = entry.box.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - vh / 2);
      scored.push({ el: entry.el, vol: Math.max(0, 1 - dist / (vh * 0.9)) });
    });
    // only the 2 nearest get sound — the rest stay muted
    scored.sort((a, b) => b.vol - a.vol);
    scored.forEach((s, i) => {
      const audible = i < 2 && s.vol > 0.05;
      s.el.muted = !audible;
      if (audible) s.el.volume = Math.min(1, s.vol);
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  window.setInterval(update, 800);
}

interface CorruptedVideoProps {
  src: string;
  pageUrl: string;
  label: string;
  credit: string;
  depthMeters: number;
  isViolentShock?: boolean;
}

export const CorruptedVideo: React.FC<CorruptedVideoProps> = ({
  src,
  pageUrl,
  label,
  credit,
  depthMeters,
  isViolentShock = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const segRef = useRef<{ start: number; end: number }>({ start: 0, end: 12 });
  const params = getCorruptionParams(depthMeters);

  useEffect(() => {
    wireProximity();
    const video = videoRef.current;
    const box = boxRef.current;
    if (!video || !box) return;

    let entry: { el: HTMLVideoElement; box: HTMLElement } | null = null;
    let disposed = false;

    const onMeta = () => {
      if (disposed) return;
      const { start, len } = randomLoopWindow(video.duration);
      segRef.current = { start, end: start + len };
      try {
        video.currentTime = start;
      } catch { /* metadata race — timeupdate will clamp */ }
    };
    video.addEventListener('loadedmetadata', onMeta);

    const io = new IntersectionObserver(
      records => {
        const rec = records[0];
        if (!rec) return;
        if (rec.isIntersecting) {
          video.load();
          video.play().catch(() => { /* autoplay blocked until entry tap */ });
          entry = { el: video, box };
          registry.add(entry);
        } else if (rec.boundingClientRect.top > window.innerHeight) {
          // still above approach range — keep buffered, stay paused
          video.pause();
        } else {
          // scrolled past — pause and leave the registry
          video.pause();
          if (entry) {
            registry.delete(entry);
            entry = null;
          }
        }
      },
      { rootMargin: '1200px 0px' }
    );
    io.observe(box);

    return () => {
      disposed = true;
      video.removeEventListener('loadedmetadata', onMeta);
      io.disconnect();
      if (entry) registry.delete(entry);
      video.pause();
    };
  }, [src]);

  // loop the random ≤12s window (react.dev onTimeUpdate pattern)
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime >= segRef.current.end) {
      try {
        video.currentTime = segRef.current.start;
      } catch { /* noop */ }
    }
  };

  const style = useMemo<React.CSSProperties>(() => {
    const slice = params.sliceCount;
    return {
      filter: params.cssFilter,
      transform: `translate(${(Math.random() - 0.5) * slice}px, 0) skewX(${(params.c * 4).toFixed(2)}deg)`,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.bucket]);

  return (
    <div ref={boxRef} className={`my-3 overflow-hidden rounded border ${isViolentShock ? 'animate-artifact-spasm border-red-600' : 'border-neutral-700'} bg-black`}>
      <div className="flex items-center justify-between px-2 py-1 font-mono text-[10px] text-neutral-400">
        <span className="truncate font-bold uppercase tracking-wider text-red-400">{label}</span>
        <span>rot {(params.c * 100).toFixed(0)}%</span>
      </div>
      <video
        ref={videoRef}
        src={src}
        muted
        loop={false}
        playsInline
        preload="auto"
        disablePictureInPicture
        onTimeUpdate={onTimeUpdate}
        onPlay={e => { e.currentTarget.playbackRate = 1 + params.playbackWobble * 0.4; }}
        className="block h-56 w-full bg-black object-cover sm:h-64"
        style={style}
      />
      <div className="flex items-center justify-between gap-2 px-2 py-1 font-mono text-[10px] italic text-neutral-500">
        <span className="truncate">{credit}</span>
        <a href={pageUrl} target="_blank" rel="noreferrer" className="shrink-0 not-italic text-red-400 underline">
          full film →
        </a>
      </div>
    </div>
  );
};
