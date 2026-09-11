/**
 * Recovered tape player. Plays a real LibriVox file from a random spot.
 * Sound runs through the depth-corruption voice (drive, bitcrush, muffle,
 * dropouts, wow/flutter, skip-cuts, hiss) — shallow is clean, deep is chewed.
 *
 * Two past bugs fixed here: the AudioContext is created/resumed inside the
 * click gesture (never suspended-silenced), and the element opts into CORS
 * up front so the Web Audio graph gets real samples. If a file refuses CORS,
 * we reload it plain — audible and clean beats silent and corrupted.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, Volume2 } from 'lucide-react';
import { attachCorruption, ensureAudioContext, CorruptVoice } from '../audio/corruptPlayback';
import { registerProximity } from '../audio/proximityBus';
import { getCorruptionParams } from '../utils/corruptionCurve';
import { randomAudioWindow } from '../utils/foundVerbatim';

interface InteractiveAudioLogProps {
  title: string;
  frequency: string;
  speaker?: string;
  /** direct mp3 — playback starts at a random offset */
  audioUrl?: string;
  audioCredit?: string;
  depthMeters: number;
  isViolentShock?: boolean;
}

export const InteractiveAudioLog: React.FC<InteractiveAudioLogProps> = ({
  frequency,
  speaker,
  audioUrl,
  audioCredit,
  depthMeters,
  isViolentShock = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audible, setAudible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const voiceRef = useRef<CorruptVoice | null>(null);
  const waveRef = useRef<{ analyser: AnalyserNode; data: Uint8Array } | null>(null);
  const plainFallbackRef = useRef(false);
  const segRef = useRef<{ start: number; end: number }>({ start: 0, end: 60 });
  const unregisterRef = useRef<(() => void) | null>(null);
  const animRef = useRef<number | null>(null);
  const params = getCorruptionParams(depthMeters);

  const hookVoice = () => {
    const audio = audioRef.current;
    if (!audio || voiceRef.current || plainFallbackRef.current) return;
    ensureAudioContext();
    const voice = attachCorruption(audio, { ...params.audio });
    if (voice?.analyser) {
      voiceRef.current = voice;
      waveRef.current = {
        analyser: voice.analyser,
        data: new Uint8Array(voice.analyser.frequencyBinCount),
      };
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    const box = boxRef.current;
    if (!audio) return;
    if (audio.paused) {
      hookVoice();
      // join proximity: heard only when scrolled near, like the film loops
      if (box && !unregisterRef.current) {
        unregisterRef.current = registerProximity({
          el: audio,
          box,
          kind: 'tape',
          gate: { v: 1 },
          onAudible: a => setAudible(a),
        });
      }
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      unregisterRef.current?.();
      unregisterRef.current = null;
      setAudible(false);
    }
  };

  // random 1–60s loop from a random point — never the beginning
  const handleMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const { start, len } = randomAudioWindow(audio.duration);
    segRef.current = { start, end: start + len };
    try {
      audio.currentTime = start;
    } catch { /* timeupdate will clamp */ }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime >= segRef.current.end || audio.currentTime < segRef.current.start - 1) {
      try {
        audio.currentTime = segRef.current.start;
      } catch { /* noop */ }
    }
  };

  // If the file refuses CORS, drop the attribute and play it plain.
  const handleError = () => {
    const audio = audioRef.current;
    if (!audio || plainFallbackRef.current) return;
    plainFallbackRef.current = true;
    voiceRef.current?.destroy();
    voiceRef.current = null;
    waveRef.current = null;
    try {
      audio.removeAttribute('crossorigin');
      audio.load();
      audio.play().catch(() => setIsPlaying(false));
    } catch { /* stays quiet — user can retry */ }
  };

  // Render waveform: live post-corruption analyser data when available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      ctx.strokeStyle = 'rgba(20, 80, 40, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#22c55e' : '#4b5563';
      ctx.lineWidth = isPlaying ? 2 : 1;

      const live = waveRef.current;
      const bars = 64;
      const sliceWidth = w / bars;
      for (let i = 0; i < bars; i++) {
        const x = i * sliceWidth;
        let amplitude = 2;
        if (isPlaying) {
          if (live) {
            live.analyser.getByteTimeDomainData(live.data);
            const sample = live.data[Math.floor((i / bars) * live.data.length)] ?? 128;
            amplitude = ((sample - 128) / 128) * (h / 2 - 2);
          } else {
            amplitude = Math.sin(i * 0.3 + phase) * 12 + Math.cos(i * 0.7 - phase * 1.5) * 8;
          }
        }
        const y = cy + amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (isPlaying) phase += 0.15;
      animRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Tear down on unmount — voice first, then proximity
  useEffect(() => {
    return () => {
      unregisterRef.current?.();
      unregisterRef.current = null;
      voiceRef.current?.destroy();
      voiceRef.current = null;
    };
  }, []);

  const rot = Math.round(params.c * 100);

  return (
    <div
      id="interactive-audio-log-card"
      ref={boxRef}
      className={`my-3 rounded border border-emerald-950/80 bg-neutral-950 p-3 font-mono text-xs ${
        isViolentShock ? 'animate-artifact-spasm' : ''
      }`}
    >
      <div className="mb-2 flex items-center justify-between border-b border-emerald-900/40 pb-1 text-[10px] text-emerald-400/80">
        <div className="flex items-center gap-1.5">
          <Radio className={`h-3.5 w-3.5 ${isPlaying ? 'animate-pulse text-emerald-400' : 'text-neutral-500'}`} />
          <span>CARRIER: {frequency}</span>
        </div>
        {speaker && <span className="text-neutral-400">SRC: {speaker}</span>}
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider">
          <span className={`h-2 w-2 rounded-full ${audible ? 'animate-ping bg-emerald-500' : 'bg-neutral-600'}`} />
          <span>{audible ? 'live' : isPlaying ? 'far' : 'quiet'}</span>
        </div>
      </div>

      <div className="relative mb-2.5 overflow-hidden rounded border border-emerald-900/60 bg-black">
        <canvas ref={canvasRef} width={280} height={56} className="block h-14 w-full" />
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          crossOrigin="anonymous"
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => {
            setIsPlaying(false);
            setAudible(false);
          }}
          onLoadedMetadata={handleMetadata}
          onTimeUpdate={handleTimeUpdate}
          onError={handleError}
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!audioUrl}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
            isPlaying
              ? 'border-emerald-500 bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
              : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
          } ${!audioUrl ? 'opacity-40' : ''}`}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          <span>{isPlaying ? 'stop' : 'play the tape'}</span>
        </button>

        <div className="flex items-center gap-1 rounded border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-[10px] text-neutral-400">
          <Volume2 className="h-3.5 w-3.5 text-neutral-500" />
          <span>rot {rot}%</span>
        </div>
      </div>
      {audioCredit && <div className="mt-1 font-mono text-[9px] italic text-neutral-600">{audioCredit}</div>}
    </div>
  );
};
