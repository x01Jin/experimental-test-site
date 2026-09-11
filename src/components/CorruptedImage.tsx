/**
 * Single-purpose component: Dynamically corrupted internet image renderer.
 * Loads an internet specimen, renders real-time pixelation, RGB distortion,
 * glitch slices, and spawns detached fragmented shards that float and shudder as depth increases.
 *
 * Localized shaking: When a shock occurs or on hover, the image and shards
 * spasm and vibrate violently without shaking the entire document viewport.
 */

import React, { useRef, useEffect, useState } from 'react';
import { InternetImageSpecimen } from '../utils/internetImages';
import { corruptImageOnCanvas } from '../utils/imageCorruptor';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';

interface CorruptedImageProps {
  specimen: InternetImageSpecimen;
  severity: number; // 0.0 to 1.0+
  isViolentShock?: boolean;
  onInteraction?: () => void;
}

export const CorruptedImage: React.FC<CorruptedImageProps> = ({
  specimen,
  severity,
  isViolentShock = false,
  onInteraction
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoverTwitch, setHoverTwitch] = useState(false);
  const [renderTick, setRenderTick] = useState(0);

  // Preload and cache source image with anonymous cross-origin
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = specimen.url;

    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      setRenderTick(t => t + 1);
    };

    img.onerror = () => {
      // Procedural fallback will be drawn by corruptImageOnCanvas
      setIsLoaded(true);
      setRenderTick(t => t + 1);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [specimen.url]);

  // Redraw canvas when severity bucket, hover, or load changes.
  // Bucketing avoids re-running the O(n) pixel loop on every scroll tick.
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const raw = Math.min(1.2, severity + (hoverTwitch ? 0.25 : 0));
    const bucketed = raw < 0.15 ? 0.1 : raw < 0.35 ? 0.3 : raw < 0.6 ? 0.55 : raw < 0.85 ? 0.8 : 1.1;

    corruptImageOnCanvas(imageRef.current, canvas, {
      severity: bucketed,
      timeSeed: specimen.fallbackSeed * 1000 + Math.round(bucketed * 10),
      category: specimen.category,
      enableDemonicFeatures: bucketed > 0.4
    });
  }, [Math.round(severity * 5), hoverTwitch, isLoaded, renderTick, specimen]);

  // Handle pointer hover
  const handleMouseEnter = () => {
    setHoverTwitch(true);
    if (severity > 0.2) {
      horrorAudioEngine.triggerAggressiveEvent(0.4 + severity * 0.4);
    }
    if (onInteraction) {
      onInteraction();
    }
  };

  const handleMouseLeave = () => {
    setHoverTwitch(false);
  };

  // Fragment shards: calculate displacement of broken pieces when severity > 0.4
  const fragmentDisplacement = severity > 0.4 ? (severity - 0.35) * 24 : 0;
  const isSpasming = isViolentShock || hoverTwitch || (severity > 0.75);

  return (
    <div
      id={`corrupted-specimen-${specimen.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full my-3 overflow-visible select-none group ${
        isSpasming ? 'animate-artifact-spasm' : ''
      }`}
    >
      {/* Specimen Header Metadata */}
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1 px-1">
        <span className="text-red-400 font-bold uppercase tracking-wider">
          {specimen.sourceOrigin}
        </span>
        <span className="text-neutral-500 tracking-widest">
          DECAY: {(severity * 100).toFixed(0)}%
        </span>
      </div>

      {/* Primary Corrupted Image Frame */}
      <div
        className={`relative w-full rounded border overflow-hidden transition-all duration-200 ${
          severity > 0.6
            ? 'border-red-600/80 shadow-lg shadow-red-950/60 bg-black'
            : severity > 0.25
            ? 'border-neutral-700 bg-neutral-950'
            : 'border-neutral-800 bg-neutral-900'
        } ${hoverTwitch ? 'ring-2 ring-red-500 scale-[1.01]' : ''}`}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={260}
          className="w-full h-48 sm:h-56 object-cover block"
        />

        {/* Scanline CRT shimmer line */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-12 animate-pulse"
          style={{ animationDuration: '2.5s' }}
        />

        {/* Severity-based color cast overlay */}
        {severity > 0.5 && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color-burn bg-red-900/30"
          />
        )}
      </div>

      {/* Floating Fragmented Shards for High Degradation */}
      {severity > 0.45 && (
        <>
          {/* Shard 1: Displaced upper strip */}
          <div
            style={{
              transform: `translate(${fragmentDisplacement * 1.2}px, -${fragmentDisplacement * 0.6}px) rotate(${fragmentDisplacement * 0.4}deg)`,
              clipPath: 'polygon(0 0, 100% 0, 95% 35%, 5% 35%)'
            }}
            className={`absolute inset-x-0 top-0 h-48 sm:h-56 pointer-events-none opacity-80 mix-blend-difference overflow-hidden border border-red-500/40 ${
              isSpasming ? 'animate-artifact-spasm' : ''
            }`}
          >
            <div className="w-full h-full bg-red-600/20 backdrop-invert" />
          </div>

          {/* Shard 2: Displaced lower-right jagged fragment */}
          <div
            style={{
              transform: `translate(-${fragmentDisplacement * 0.9}px, ${fragmentDisplacement * 0.8}px) rotate(-${fragmentDisplacement * 0.6}deg)`,
              clipPath: 'polygon(55% 65%, 100% 55%, 90% 100%, 45% 95%)'
            }}
            className={`absolute inset-0 pointer-events-none opacity-90 mix-blend-screen overflow-hidden border border-cyan-400/50 ${
              isSpasming ? 'animate-artifact-spasm' : ''
            }`}
          >
            <div className="w-full h-full bg-cyan-900/30" />
          </div>
        </>
      )}

      {/* Specimen Caption Footer */}
      <div className="mt-1.5 px-1 font-mono text-[11px] text-neutral-400 leading-snug flex items-baseline justify-between gap-2">
        <span className="italic">{specimen.caption}</span>
        <span className="text-[9px] uppercase text-red-500 font-bold whitespace-nowrap">
          {severity > 0.6 ? '[chewed]' : '[taped over]'}
        </span>
      </div>
    </div>
  );
};
