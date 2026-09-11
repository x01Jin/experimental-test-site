/**
 * Single-purpose component: Interactive recovered black-box audio player.
 * Visualizes synthetic audio waveform, simulates magnetic tape flutter,
 * and plays authentic voice intercept recordings and low-frequency whispers.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, Volume2 } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';

interface InteractiveAudioLogProps {
  title: string;
  frequency: string;
  speaker?: string;
  isViolentShock?: boolean;
}

export const InteractiveAudioLog: React.FC<InteractiveAudioLogProps> = ({
  frequency,
  speaker,
  isViolentShock = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const togglePlayback = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      horrorAudioEngine.playAudioLogTapeStart();
    } else {
      setIsPlaying(false);
    }
  };

  // Render animated oscillating waveform on canvas
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

      // Dark oscilloscope background grid lines
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

      // Draw audio waveform line
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#22c55e' : '#4b5563';
      ctx.lineWidth = isPlaying ? 2 : 1;

      const bars = 64;
      const sliceWidth = w / bars;

      for (let i = 0; i < bars; i++) {
        const x = i * sliceWidth;
        let amplitude = 2;

        if (isPlaying) {
          const noise = Math.sin(i * 0.3 + phase) * 12 + Math.cos(i * 0.7 - phase * 1.5) * 8;
          const jitter = (Math.random() - 0.5) * 6;
          amplitude = noise + jitter;
        }

        const y = cy + amplitude;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      if (isPlaying) {
        phase += 0.15;
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div
      id="interactive-audio-log-card"
      className={`my-3 p-3 rounded border border-emerald-950/80 bg-neutral-950 font-mono text-xs ${
        isViolentShock ? 'animate-artifact-spasm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-emerald-900/40 text-[10px] text-emerald-400/80">
        <div className="flex items-center gap-1.5">
          <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-emerald-400' : 'text-neutral-500'}`} />
          <span>CARRIER: {frequency}</span>
        </div>
        {speaker && <span className="text-neutral-400">SRC: {speaker}</span>}
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-neutral-600'}`} />
          <span>{isPlaying ? 'TRANSMITTING' : 'BUFFER STANDBY'}</span>
        </div>
      </div>

      <div className="relative mb-2.5 overflow-hidden rounded border border-emerald-900/60 bg-black">
        <canvas ref={canvasRef} width={280} height={56} className="w-full h-14 block" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
            isPlaying
              ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-500'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'ABORT INTERCEPT' : 'PLAY RECORDED INTERCEPT'}</span>
        </button>

        <div className="flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-900 px-2 py-1.5 rounded border border-neutral-800">
          <Volume2 className="w-3.5 h-3.5 text-neutral-500" />
          <span>VLF-8</span>
        </div>
      </div>
    </div>
  );
};
