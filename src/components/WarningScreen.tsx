/**
 * Single-purpose component: Initial atmospheric entry & audio unlock screen.
 * Complies with browser user-interaction policies for Web Audio API autoplay
 * while establishing psychological horror tension and photosensitivity warnings.
 */

import React, { useState } from 'react';
import { Skull, AlertTriangle, Volume2, ShieldAlert } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';

interface WarningScreenProps {
  onEnter: () => void;
}

export const WarningScreen: React.FC<WarningScreenProps> = ({ onEnter }) => {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    await horrorAudioEngine.initialize();
    // Play an introductory low click and drone
    horrorAudioEngine.triggerAggressiveEvent(0.8);
    onEnter();
  };

  return (
    <div
      id="horror-warning-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 px-4 py-8 text-neutral-200 font-mono select-none"
    >
      {/* Background static texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a0505_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      <div className="relative z-10 max-w-xl w-full border border-red-900/60 bg-black/90 p-6 sm:p-8 rounded-lg shadow-2xl shadow-red-950/50 backdrop-blur-md">
        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3 border-b border-red-950 pb-4 mb-5">
          <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse shrink-0" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-red-500 uppercase">
              Warning
            </h2>
            <p className="text-xs text-neutral-400">experimental test site — a place to test stuff</p>
          </div>
        </div>

        {/* Warning Content */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
          <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90">
              <strong>Content warning:</strong> this site contains loud sudden
              sounds, flashing and strobing visuals, screen shaking, horror
              imagery, readings, and texts. If you are sensitive to
              flashing lights, loud noise content, turn back now.
            </p>
          </div>

          <p>
            This is just an experimental website for testing things out —
            scrolling feeds, video and audio playback, canvas effects, and
            procedural layout. There is no story to follow and nothing here is
            real.
          </p>

          <p className="text-neutral-400 text-xs italic">
            Sound starts when you press the button below. You can mute at any
            time from the bar at the top.
          </p>
        </div>

        {/* Entry CTA */}
        <div className="pt-3 border-t border-neutral-800">
          <button
            id="btn-enter-abyss"
            onClick={handleStart}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded bg-red-900 hover:bg-red-800 active:scale-[0.99] text-white font-bold tracking-widest uppercase text-sm border border-red-700 shadow-lg shadow-red-950 transition-all cursor-pointer"
          >
            <Skull className="w-5 h-5" />
            <span>{loading ? 'loading...' : 'i understand — enter'}</span>
            <Volume2 className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
