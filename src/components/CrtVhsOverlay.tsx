/**
 * Single-purpose component: CRT / VHS analog horror overlay.
 * Renders scanlines, chromatic RGB fringe, screen tear flickers,
 * and vignette with corruption scaling.
 */

import React, { useEffect, useRef } from 'react';

interface CrtVhsOverlayProps {
  corruptionLevel: number; // 0 to 100
  isViolent: boolean;
}

export const CrtVhsOverlay: React.FC<CrtVhsOverlayProps> = ({
  corruptionLevel,
  isViolent
}) => {
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate dynamic static noise on a tiny canvas scaled up for high performance
  useEffect(() => {
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const w = (canvas.width = 160);
    const h = (canvas.height = 120);

    const renderNoise = () => {
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      const noiseDensity = 0.04 + (corruptionLevel / 100) * 0.12;

      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < noiseDensity) {
          const val = Math.random() > 0.8 ? 255 : Math.floor(Math.random() * 180);
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
          data[i + 3] = isViolent ? 180 : Math.floor(60 + (corruptionLevel / 100) * 80);
        } else {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(renderNoise);
    };

    animId = requestAnimationFrame(renderNoise);
    return () => cancelAnimationFrame(animId);
  }, [corruptionLevel, isViolent]);

  const rgbSplitAmount = Math.floor((corruptionLevel / 100) * 8) + (isViolent ? 12 : 0);

  return (
    <div
      id="crt-vhs-overlay"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      style={{
        boxShadow: `inset 0 0 ${80 + corruptionLevel * 0.8}px rgba(0, 0, 0, ${0.7 + (corruptionLevel / 100) * 0.25})`
      }}
    >
      {/* Dynamic Static Canvas */}
      <canvas
        ref={noiseCanvasRef}
        className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-70"
      />

      {/* CRT Scanline Bars */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.28) 0px, rgba(0, 0, 0, 0.28) 1px, transparent 1px, transparent 3px)',
          opacity: 0.85
        }}
      />

      {/* Horizontal Sync Scan Bar that rolls down the screen */}
      <div
        className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse"
        style={{
          animationDuration: `${Math.max(1.2, 5 - (corruptionLevel / 100) * 3.8)}s`,
          animationIterationCount: 'infinite'
        }}
      />

      {/* Screen Edge Chromatic Aberration Vignette */}
      {rgbSplitAmount > 0 && (
        <div
          className="absolute inset-0 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `radial-gradient(ellipse at center, transparent 65%, rgba(255, 0, 40, ${0.15 + (corruptionLevel / 100) * 0.3}) 100%)`
          }}
        />
      )}
    </div>
  );
};
