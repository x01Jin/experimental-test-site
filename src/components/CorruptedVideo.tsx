/**
 * Depth-rotted film loop. Direct mp4, preloaded before encounter,
 * autoplays muted, starts at a random spot, loops a random ≤12s window.
 * Sound is proximity-based: louder as you scroll onto it, gone past it.
 *
 * Corruption scales with the depth the tile appeared at:
 *  - audio: playback wobble + skip-cuts + dropout gates on the proximity
 *    volume (no Web Audio graph — keeps muted/volume + autoplay safe)
 *  - visual: css rot always; single-element SVG RGB-split filter only
 *    while audible (GPU-gated); tear-bar flashes, snap tears, frame
 *    freezes ∝ depth.
 */

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { getCorruptionParams } from '../utils/corruptionCurve';
import { randomLoopWindow } from '../utils/foundVerbatim';
import { registerProximity } from '../audio/proximityBus';

interface CorruptedVideoProps {
  src: string;
  fallbackSrc?: string;
  pageUrl: string;
  label: string;
  credit: string;
  depthMeters: number;
  isViolentShock?: boolean;
}

export const CorruptedVideo: React.FC<CorruptedVideoProps> = ({
  src,
  fallbackSrc,
  pageUrl,
  label,
  credit,
  depthMeters,
  isViolentShock = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const segRef = useRef<{ start: number; end: number }>({ start: 0, end: 12 });
  const gateRef = useRef({ v: 1 });
  const audibleRef = useRef(false);
  const attemptRef = useRef(0);
  const unregisterRef = useRef<(() => void) | null>(null);
  const [audible, setAudible] = useState(false);
  const [tearTick, setTearTick] = useState(0);
  const [curSrc, setCurSrc] = useState(src);
  const [dead, setDead] = useState(false);
  const filterId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const params = getCorruptionParams(depthMeters);
  const fx = params.videoFx;

  useEffect(() => {
    setCurSrc(src);
    setDead(false);
    attemptRef.current = 0;
  }, [src]);

  // error chain: reload once (transient node 500) → alternate encoding →
  // dead tile with a link out, never a black box
  const handleError = () => {
    const video = videoRef.current;
    if (!video || dead) return;
    attemptRef.current += 1;
    if (attemptRef.current === 1) {
      try {
        video.load();
      } catch { /* falls through to fallback below on next error */ }
    } else if (attemptRef.current === 2 && fallbackSrc && curSrc !== fallbackSrc) {
      setCurSrc(fallbackSrc);
    } else {
      unregisterRef.current?.();
      unregisterRef.current = null;
      audibleRef.current = false;
      setAudible(false);
      setDead(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const box = boxRef.current;
    if (!video || !box) return;

    let unregister: (() => void) | null = null;
    let disposed = false;
    let fxTimer: number | null = null;
    unregisterRef.current = null;

    const onMeta = () => {
      if (disposed) return;
      const { start, len } = randomLoopWindow(video.duration);
      segRef.current = { start, end: start + len };
      try {
        video.currentTime = start;
      } catch { /* metadata race — timeupdate will clamp */ }
    };
    video.addEventListener('loadedmetadata', onMeta);

    // deep-tile sabotage scheduler: dropouts, tears, freezes
    fxTimer = window.setInterval(() => {
      if (disposed || video.paused || !audibleRef.current) return;
      // dropout gate: brief full mute of the proximity volume
      if (fx.tearRate > 0.05 && Math.random() < fx.tearRate * 0.25) {
        gateRef.current.v = 0;
        window.setTimeout(() => { gateRef.current.v = 1; }, 60 + Math.random() * 320);
      }
      // tear-bar flash
      if (fx.tearRate > 0.05 && Math.random() < fx.tearRate * 0.3) {
        setTearTick(t => t + 1);
        window.setTimeout(() => { if (!disposed) setTearTick(0); }, 140 + Math.random() * 120);
      }
      // frame freeze: hold a dead frame, then lurch on
      if (fx.freezeChance > 0.02 && Math.random() < fx.freezeChance * 0.25) {
        video.pause();
        window.setTimeout(() => {
          if (!disposed && audibleRef.current) video.play().catch(() => { /* scroll took it */ });
        }, 100 + Math.random() * fx.freezeMaxMs);
      }
    }, 500);

    const io = new IntersectionObserver(
      records => {
        const rec = records[0];
        if (!rec) return;
        if (rec.isIntersecting) {
          video.load();
          video.play().catch(() => { /* autoplay blocked until entry tap */ });
          gateRef.current.v = 1;
          if (!unregister) {
            unregister = registerProximity({
              el: video,
              box,
              kind: 'clip',
              gate: gateRef.current,
              onAudible: a => {
                audibleRef.current = a;
                setAudible(a);
              },
            });
            unregisterRef.current = unregister;
          }
        } else if (rec.boundingClientRect.top > window.innerHeight) {
          // still above approach range — keep buffered, stay paused
          video.pause();
        } else {
          // scrolled past — pause and leave proximity
          video.pause();
          unregister?.();
          unregister = null;
          unregisterRef.current = null;
          audibleRef.current = false;
          setAudible(false);
        }
      },
      { rootMargin: '1200px 0px' }
    );
    io.observe(box);

    return () => {
      disposed = true;
      video.removeEventListener('loadedmetadata', onMeta);
      io.disconnect();
      if (fxTimer !== null) window.clearInterval(fxTimer);
      unregister?.();
      audibleRef.current = false;
      video.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // loop the random ≤12s window + deep skip-cuts (tape chewed a chunk out)
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime >= segRef.current.end) {
      try {
        video.currentTime = segRef.current.start;
      } catch { /* noop */ }
      return;
    }
    // ~skipRate jumps per minute while audible
    if (
      audibleRef.current &&
      fx.skipRate > 0.2 &&
      Math.random() < fx.skipRate / 240 &&
      Number.isFinite(video.duration) &&
      video.duration > 20
    ) {
      try {
        video.currentTime = Math.min(
          Math.max(segRef.current.start, video.duration - 2),
          Math.max(
            segRef.current.start,
            video.currentTime + (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 2.2)
          )
        );
      } catch { /* noop */ }
    }
  };

  const style = useMemo<React.CSSProperties>(() => {
    const slice = params.sliceCount;
    return {
      filter: audible && fx.rgbDx > 0 ? `url(#rgb-${filterId})` : params.cssFilter,
      transform: `translate(${(Math.random() - 0.5) * slice}px, 0) skewX(${(params.c * 4).toFixed(2)}deg)`,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.bucket, audible, filterId]);

  // tear bars: thin skewed strips flashed over the frame, seeded per tick
  const tearBars = useMemo(() => {
    if (tearTick === 0) return null;
    const bars = 1 + (tearTick % 2);
    return Array.from({ length: bars }, (_, i) => {
      const seed = tearTick * 31 + i * 17;
      const top = (seed * 37) % 85;
      const hgt = 3 + ((seed * 13) % 9);
      const dx = ((seed * 53) % 60) - 30;
      return (
        <div
          key={`${tearTick}-${i}`}
          className="pointer-events-none absolute left-0 w-full bg-red-200/25 mix-blend-screen"
          style={{ top: `${top}%`, height: `${hgt}px`, transform: `translateX(${dx}px) skewX(-12deg)` }}
        />
      );
    });
  }, [tearTick]);

  return (
    <div ref={boxRef} className={`my-3 overflow-hidden rounded border ${isViolentShock ? 'animate-artifact-spasm border-red-600' : 'border-neutral-700'} bg-black`}>
      {/* single-element RGB-split: two channel-shifted copies blended back (screen) */}
      {fx.rgbDx > 0 && (
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <filter id={`rgb-${filterId}`} x="-10%" y="-10%" width="120%" height="120%">
              <feOffset in="SourceGraphic" dx={fx.rgbDx} dy="0" result="layer-r" />
              <feComponentTransfer in="layer-r" result="red">
                <feFuncR type="identity" />
                <feFuncG type="discrete" tableValues="0" />
                <feFuncB type="discrete" tableValues="0" />
              </feComponentTransfer>
              <feOffset in="SourceGraphic" dx={-fx.rgbDx} dy="0" result="layer-c" />
              <feComponentTransfer in="layer-c" result="cyan">
                <feFuncR type="discrete" tableValues="0" />
                <feFuncG type="identity" />
                <feFuncB type="identity" />
              </feComponentTransfer>
              <feBlend in="red" in2="cyan" mode="screen" />
            </filter>
          </defs>
        </svg>
      )}
      <div className="flex items-center justify-between px-2 py-1 font-mono text-[10px] text-neutral-400">
        <span className="truncate font-bold uppercase tracking-wider text-red-400">{label}</span>
        <span>rot {(params.c * 100).toFixed(0)}%</span>
      </div>
      <div className="relative">
        {dead ? (
          <div className="flex h-56 w-full flex-col items-center justify-center gap-1 bg-black font-mono text-[11px] text-red-400/80 sm:h-64">
            <span className="tracking-widest">— signal lost —</span>
            <span className="text-[10px] italic text-neutral-500">this reel rotted past recovery</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={curSrc}
            muted
            loop={false}
            playsInline
            preload="auto"
            disablePictureInPicture
            onTimeUpdate={onTimeUpdate}
            onError={handleError}
            onPlay={e => { e.currentTarget.playbackRate = 1 + params.playbackWobble * 0.4; }}
            className="block h-56 w-full bg-black object-cover sm:h-64"
            style={style}
          />
        )}
        {tearBars}
      </div>
      <div className="flex items-center justify-between gap-2 px-2 py-1 font-mono text-[10px] italic text-neutral-500">
        <span className="truncate">{credit}</span>
        <a href={pageUrl} target="_blank" rel="noreferrer" className="shrink-0 not-italic text-red-400 underline">
          full film →
        </a>
      </div>
    </div>
  );
};
