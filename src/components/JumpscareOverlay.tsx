/**
 * Single-purpose component: Abstract Non-Blocking Jumpscare & Shock Layer.
 * Renders unpredictable, abstract horror anomalies:
 * 1. "A loud noise": BSOD lockup buzz + pitch-stretched static shock with momentary horizontal tearing.
 * 2. "A pop up": Aggressive corrupted OS crash error window that shakes violently without blocking scrolling.
 * 3. "A distorted fetched image": Suddenly slammed, violently warped/stretched internet image specimen.
 * 4. "Abstract signal tear": High-frequency RAM hex tear and inverted signal slice.
 *
 * CRITICAL: NEVER covers the full screen with an opaque wall, NEVER blocks user scrolling.
 */

import React, { useEffect, useState, useRef } from 'react';
import { JumpscareEvent } from '../types/horror';
import { getRandomSpecimen, InternetImageSpecimen } from '../utils/internetImages';
import { AlertTriangle, X, Terminal, Cpu } from 'lucide-react';
import { corruptImageOnCanvas } from '../utils/imageCorruptor';

interface JumpscareOverlayProps {
  currentJumpscare: JumpscareEvent | null;
  onJumpscareEnd: () => void;
  onTriggerAggressiveShock?: (intensity: number) => void;
}

export const JumpscareOverlay: React.FC<JumpscareOverlayProps> = ({
  currentJumpscare,
  onJumpscareEnd,
  onTriggerAggressiveShock
}) => {
  const [activeSpecimen, setActiveSpecimen] = useState<InternetImageSpecimen | null>(null);
  const specimenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const onJumpscareEndRef = useRef(onJumpscareEnd);

  useEffect(() => {
    onJumpscareEndRef.current = onJumpscareEnd;
  }, [onJumpscareEnd]);

  const jumpscareId = currentJumpscare?.id;

  // When a jumpscare triggers, set up specimen if needed and handle cleanup timer
  useEffect(() => {
    if (!currentJumpscare) {
      return;
    }

    setPopupDismissed(false);

    // If type is distorted-fetched-image, select or use provided image specimen
    if (currentJumpscare.type === 'distorted-fetched-image') {
      const specimen = currentJumpscare.imageSpecimen || getRandomSpecimen(currentJumpscare.intensity > 3 ? 'surveillance' : 'portrait');
      setActiveSpecimen(specimen);
    } else {
      setActiveSpecimen(null);
    }

    // Auto-dismiss after duration
    // Pop-ups can linger slightly longer (2.4s) for eerie reading while allowing continuous scrolling
    const duration = currentJumpscare.type === 'corrupted-error-popup' ? 2400 : currentJumpscare.durationMs;

    const timer = window.setTimeout(() => {
      onJumpscareEndRef.current();
    }, duration);

    return () => clearTimeout(timer);
  }, [jumpscareId]);

  // Render corrupted canvas for distorted image jumpscare
  useEffect(() => {
    if (!activeSpecimen || !specimenCanvasRef.current || currentJumpscare?.type !== 'distorted-fetched-image') return;

    const canvas = specimenCanvasRef.current;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeSpecimen.url;

    const draw = () => {
      corruptImageOnCanvas(img, canvas, {
        severity: 1.1,
        timeSeed: Date.now(),
        category: activeSpecimen.category,
        enableDemonicFeatures: true
      });
    };

    img.onload = draw;
    img.onerror = () => {
      // Fallback procedural corrupted texture
      corruptImageOnCanvas(null, canvas, {
        severity: 1.2,
        timeSeed: Date.now(),
        category: activeSpecimen.category,
        enableDemonicFeatures: true
      });
    };
  }, [activeSpecimen?.id, jumpscareId]);

  if (!currentJumpscare) return null;

  return (
    <div
      id="abstract-jumpscare-container"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center select-none overflow-hidden"
    >
      {/* 1. LOUD CRASH NOISE / SHOCK: Thin horizontal tear slice (does NOT block screen) */}
      {currentJumpscare.type === 'loud-crash-noise' && (
        <div className="absolute w-full px-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl h-24 bg-red-950/80 border-y-2 border-red-500/90 mix-blend-difference flex items-center justify-between px-6 backdrop-blur-xs animate-pulse">
            <div className="flex items-center space-x-3 text-red-300 font-mono text-xs sm:text-sm tracking-widest uppercase">
              <Cpu className="w-5 h-5 text-red-500 animate-spin" />
              <span>[thread gave out :: 0x000000EF]</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              loop. loop. loop.
            </div>
          </div>
          {/* Subtle brief chromatic tear bar */}
          <div className="w-full h-1 bg-cyan-400 mix-blend-screen opacity-75 mt-1" />
        </div>
      )}

      {/* 2. POP UP: Aggressive Corrupted System Crash Error Pop-up Window */}
      {currentJumpscare.type === 'corrupted-error-popup' && !popupDismissed && (
        <div
          id="corrupted-crash-popup"
          className="relative max-w-md w-11/12 sm:w-full bg-neutral-950/95 border-2 border-red-600 shadow-2xl shadow-red-950/80 p-0 font-mono text-xs text-neutral-200 animate-popup-glitch select-text"
          style={{
            // Floating near center-right or center, shaking violently
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {/* Window Header */}
          <div className="bg-red-900/90 text-white px-3 py-1.5 flex items-center justify-between border-b border-red-700 font-bold tracking-wider text-xs">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>it broke</span>
            </div>
            <button
              id="close-corrupted-popup"
              onClick={() => {
                setPopupDismissed(true);
                onJumpscareEnd();
              }}
              className="pointer-events-auto text-neutral-300 hover:text-white p-0.5 rounded cursor-pointer"
              title="close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Window Body */}
          <div className="p-4 space-y-3 bg-neutral-950/90">
            <div className="text-red-400 font-black text-sm tracking-widest uppercase flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-red-500 inline" />
              <span>driver fell over</span>
            </div>

            <p className="text-neutral-300 text-[11px] leading-relaxed">
              thread died at{' '}
              <span className="text-yellow-400">0x00007FF8B4C02A11</span>. sound card full of dust.
            </p>

            <div className="bg-black/90 p-2.5 rounded border border-red-900/60 font-mono text-[10px] text-red-400/90 leading-tight space-y-0.5">
              <div>*** stop: 0x000000d1</div>
              <div>*** memory_bus_overflow.sys</div>
              <div className="text-neutral-500">dumping... 74%</div>
            </div>

            {/* Interactive Action Buttons (Does NOT prevent scrolling!) */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-800">
              <button
                id="popup-btn-dump"
                onClick={() => {
                  if (onTriggerAggressiveShock) onTriggerAggressiveShock(1.4);
                  setPopupDismissed(true);
                  onJumpscareEnd();
                }}
                className="pointer-events-auto px-3 py-1 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-[11px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                DUMP
              </button>
              <button
                id="popup-btn-abort"
                onClick={() => {
                  setPopupDismissed(true);
                  onJumpscareEnd();
                }}
                className="pointer-events-auto px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
              >
                leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISTORTED FETCHED IMAGE: Violently stretched, warped, solarized artifact frame */}
      {currentJumpscare.type === 'distorted-fetched-image' && activeSpecimen && (
        <div className="relative max-w-sm sm:max-w-md w-full p-2 animate-artifact-spasm flex flex-col items-center">
          <div
            className="relative w-full overflow-hidden border-2 border-red-600/90 bg-black/90 shadow-2xl shadow-red-900/80"
            style={{
              // Violent non-proportional stretching and perspective skew
              transform: 'scaleX(1.4) scaleY(0.7) skewX(-10deg)',
              filter: 'contrast(220%) invert(20%) drop-shadow(6px 0 0 rgba(255, 0, 0, 0.8)) drop-shadow(-6px 0 0 rgba(0, 240, 255, 0.8))'
            }}
          >
            <canvas
              ref={specimenCanvasRef}
              width={400}
              height={260}
              className="w-full h-48 object-cover mix-blend-hard-light"
            />
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.85)_50%)] bg-[length:100%_4px] pointer-events-none" />
          </div>

          <div className="mt-3 font-mono text-xs text-red-400 uppercase tracking-widest font-black bg-black/90 border border-red-800 px-3 py-0.5">
            [chewed up :: {activeSpecimen.sourceOrigin}]
          </div>
        </div>
      )}

      {/* 4. ABSTRACT SIGNAL TEAR: Momentary high-frequency RAM scanline slice */}
      {currentJumpscare.type === 'abstract-signal-tear' && (
        <div className="absolute inset-x-0 h-40 flex flex-col justify-between overflow-hidden opacity-90 mix-blend-difference pointer-events-none">
          <div className="w-full h-8 bg-red-600 mix-blend-screen translate-x-3" />
          <div className="w-full h-16 bg-neutral-900 border-y border-cyan-400 p-2 font-mono text-[9px] text-cyan-300 overflow-hidden leading-none tracking-tighter">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="truncate">
                0x00FF{i}9A44 deadbeef 00101100 fault :: trace gone :: hold
              </div>
            ))}
          </div>
          <div className="w-full h-6 bg-cyan-600 mix-blend-screen -translate-x-4" />
        </div>
      )}
    </div>
  );
};
