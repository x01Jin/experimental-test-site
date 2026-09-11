/**
 * Single-purpose component: Biometric cardiac pulse telemetry monitor.
 * Displays real-time oscillating electrocardiogram (EKG) waveform,
 * tracks simulated biometric stress, and synthesizes anatomical lub-dub audio thuds.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Activity, Heart, AlertOctagon } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';
import { getBPM } from '../utils/depthScale';

interface HeartbeatMonitorProps {
  baseBpm?: number;
  corruptionLevel: number;
  isViolentShock?: boolean;
}

export const HeartbeatMonitor: React.FC<HeartbeatMonitorProps> = ({
  baseBpm = 76,
  corruptionLevel,
  isViolentShock = false
}) => {
  const [pulseActive, setPulseActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Canonical BPM curve (70-185), seeded from item base then driven by live corruption
  const liveBpm = getBPM(corruptionLevel);
  const effectiveBpm = Math.min(185, Math.max(liveBpm, Math.min(185, baseBpm + Math.floor((corruptionLevel / 100) * 20))));
  const animRef = useRef<number | null>(null);

  const triggerManualPulse = () => {
    setPulseActive(true);
    horrorAudioEngine.playCardiacPulse(1.2);
    setTimeout(() => setPulseActive(false), 300);
  };

  // EKG scanning sweep line
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanX = 0;
    let stepCount = 0;
    const history: number[] = new Array(canvas.width).fill(canvas.height / 2);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      // Dark grid background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(180, 20, 20, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Compute next EKG data point
      stepCount++;
      const beatCycle = stepCount % Math.max(18, Math.floor(1800 / effectiveBpm));
      let currentY = cy;

      if (beatCycle === 4) currentY = cy - 6; // P wave
      else if (beatCycle === 8) currentY = cy + 4; // Q wave
      else if (beatCycle === 10) currentY = cy - 24; // R peak (sharp spike)
      else if (beatCycle === 12) currentY = cy + 12; // S dip
      else if (beatCycle === 16) currentY = cy - 8; // T wave

      // Add erratic fibrillations as corruption increases
      if (corruptionLevel > 50) {
        currentY += (Math.random() - 0.5) * (corruptionLevel * 0.12);
      }

      history[scanX] = currentY;
      scanX = (scanX + 1) % w;

      // Draw EKG trace line
      ctx.beginPath();
      ctx.strokeStyle = corruptionLevel > 60 ? '#ef4444' : '#22c55e';
      ctx.lineWidth = 1.8;

      for (let i = 0; i < w; i++) {
        if (i === 0) {
          ctx.moveTo(i, history[i]);
        } else {
          ctx.lineTo(i, history[i]);
        }
      }
      ctx.stroke();

      // Draw active scanner head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(scanX, history[scanX], 3, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [effectiveBpm, corruptionLevel]);

  return (
    <div
      id="heartbeat-monitor-card"
      className={`my-3 p-3 rounded border border-red-900/60 bg-neutral-950 font-mono text-xs ${
        isViolentShock ? 'animate-artifact-spasm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2 text-[10px] text-red-400">
        <div className="flex items-center gap-1.5 font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>pulse. hold still</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-red-300">
          <Heart className={`w-3.5 h-3.5 text-red-500 ${pulseActive ? 'scale-125 fill-current' : 'animate-pulse'}`} />
          <span>{effectiveBpm} BPM</span>
        </div>
      </div>

      <div className="relative mb-2 overflow-hidden rounded border border-red-950/80 bg-black">
        <canvas ref={canvasRef} width={280} height={64} className="w-full h-16 block" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={triggerManualPulse}
          className="flex-1 py-1.5 px-3 rounded bg-red-950/70 hover:bg-red-900 border border-red-700 text-red-200 text-[10px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
        >
          hold to sync
        </button>

        <div className="flex items-center gap-1 text-[9px] text-red-400/80 bg-neutral-900 px-2 py-1.5 rounded border border-neutral-800">
          <AlertOctagon className="w-3 h-3 text-red-500" />
          <span>{corruptionLevel > 60 ? 'bad' : 'fast'}</span>
        </div>
      </div>
    </div>
  );
};
