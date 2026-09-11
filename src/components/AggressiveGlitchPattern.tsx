/**
 * Single-purpose component: Abstract aggressive glitch pattern generator.
 * Renders high-frequency moiré lattices, torn digital barcode strips,
 * organic void bleeds, and aggressive warning geometry that intensify
 * and invade the document layout as virtual depth escalates.
 *
 * Localized shaking: When a shock occurs, patterns spasm violently.
 */

import React, { useRef, useEffect } from 'react';

export type GlitchPatternType =
  | 'moire-lattice'
  | 'ram-corruption-dump'
  | 'torn-hazard-slashes'
  | 'organic-void-bleed';

interface AggressiveGlitchPatternProps {
  type: GlitchPatternType;
  severity: number; // 0.0 to 1.0+
  seed: number;
  isViolentShock?: boolean;
}

export const AggressiveGlitchPattern: React.FC<AggressiveGlitchPatternProps> = ({
  type,
  severity,
  seed,
  isViolentShock = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastFrame = 0;
    let visible = true;
    const width = canvas.width;
    const height = canvas.height;

    const io = new IntersectionObserver(
      entries => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !animId) {
          lastFrame = 0;
          animId = requestAnimationFrame(render);
        }
      },
      { rootMargin: '200px' }
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    const render = (time: number) => {
      animId = 0;
      if (!visible || document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }
      // ~20fps is plenty for interference lines
      if (time - lastFrame < 50) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastFrame = time;
      ctx.clearRect(0, 0, width, height);

      if (type === 'moire-lattice') {
        // High-frequency oscillating interference grid
        ctx.save();
        ctx.strokeStyle = severity > 0.6 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(75, 85, 99, 0.35)';
        ctx.lineWidth = 1;

        const lines = 28;
        const phase = time * 0.002 + seed;

        for (let i = 0; i < lines; i++) {
          const y = (i / lines) * height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x < width; x += 15) {
            const wave = Math.sin(x * 0.02 + phase + i * 0.2) * (10 + severity * 20);
            ctx.lineTo(x, y + wave);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (type === 'ram-corruption-dump') {
        // Jagged digital barcodes and corrupted hex values
        ctx.save();
        ctx.fillStyle = severity > 0.5 ? 'rgba(220, 38, 38, 0.65)' : 'rgba(156, 163, 175, 0.35)';
        ctx.font = '9px monospace';

        const bars = 24;
        const barWidth = width / bars;
        for (let b = 0; b < bars; b++) {
          const h = (Math.sin(b * 1.5 + seed + time * 0.003) * 0.5 + 0.5) * height;
          if (b % 2 === 0) {
            ctx.fillRect(b * barWidth, 0, barWidth * 0.7, h);
          }
        }

        // Render flashing hex dump characters
        const hexChars = '0123456789ABCDEF!#%&?';
        ctx.fillStyle = severity > 0.7 ? '#ef4444' : '#9ca3af';
        for (let r = 0; r < 3; r++) {
          let line = '';
          for (let c = 0; c < 35; c++) {
            line += hexChars[Math.floor((breathe(seed + r * 10 + c, time) * hexChars.length)) % hexChars.length];
          }
          ctx.fillText(`0x${line}`, 15, 20 + r * 18);
        }
        ctx.restore();
      } else if (type === 'torn-hazard-slashes') {
        // Diagonal aggressive warning stripes that jitter
        ctx.save();
        const stripeWidth = 24;
        const offset = (time * 0.04) % (stripeWidth * 2);

        ctx.fillStyle = severity > 0.5 ? 'rgba(185, 28, 28, 0.5)' : 'rgba(55, 65, 81, 0.4)';
        for (let x = -height + offset; x < width + height; x += stripeWidth * 2) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + stripeWidth, 0);
          ctx.lineTo(x + stripeWidth - height, height);
          ctx.lineTo(x - height, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else if (type === 'organic-void-bleed') {
        // Pulsing dark tendrils creeping in from edges
        ctx.save();
        const blobs = 6;
        for (let i = 0; i < blobs; i++) {
          const bx = (width / blobs) * (i + 0.5);
          const by = Math.sin(time * 0.002 + i) * 12 + height * 0.5;
          const radius = (15 + Math.sin(time * 0.003 + seed) * 8) * (1 + severity);

          const grad = ctx.createRadialGradient(bx, by, 2, bx, by, radius);
          grad.addColorStop(0, 'rgba(127, 29, 29, 0.7)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bx, by, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      io.disconnect();
    };
  }, [type, Math.round(severity * 5), seed]);

  // Helper pseudorandom generator
  const breathe = (s: number, t: number) => {
    return Math.abs(Math.sin(s * 93.1 + t * 0.001));
  };

  const patternHeight = Math.min(140, Math.floor(40 + severity * 80));

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`relative w-full my-4 overflow-hidden rounded border select-none pointer-events-none transition-all duration-200 ${
        isViolentShock ? 'animate-artifact-spasm border-red-500/80 shadow-lg shadow-red-950/60' : 'border-neutral-900/60 bg-black/80'
      }`}
      style={{ height: `${patternHeight}px` }}
    >
      <canvas
        ref={canvasRef}
        width={720}
        height={patternHeight}
        className="w-full h-full block"
      />
      {/* Pattern Label */}
      <div className="absolute top-1 right-2 text-[9px] font-mono uppercase tracking-widest text-neutral-600">
        rot {(severity * 100).toFixed(0)}%
      </div>
    </div>
  );
};
