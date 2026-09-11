/**
 * Single-purpose component: HUD terminal overlay.
 * Displays real-time descent depth, corruption percentage, simulated heart rate,
 * anomaly threat index, and audio controls.
 *
 * Localized shaking: Threat indicators and panic button twitch and spasm during violent shocks.
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertTriangle, Skull, Activity } from 'lucide-react';
import { DepthState } from '../types/horror';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';
import { setMasterVolume, nudgeProximity } from '../audio/proximityBus';
import { setRadioMuted } from '../audio/globalRadio';
import { formatDepth, getBPM } from '../utils/depthScale';

interface HudStatusProps {
  depthState: DepthState;
  isViolentShock?: boolean;
}

export const HudStatus: React.FC<HudStatusProps> = ({
  depthState,
  isViolentShock = false
}) => {
  const [isMuted, setIsMuted] = useState(horrorAudioEngine.getIsMuted());
  const [volume, setVolume] = useState(horrorAudioEngine.getVolume());
  const [heartRate, setHeartRate] = useState(74);
  // Heart rate accelerates dynamically with depth and corruption (canonical curve)
  useEffect(() => {
    const baseBpm = getBPM(depthState.corruptionLevel);
    const interval = window.setInterval(() => {
      // Jitter heart rate by ±4
      setHeartRate(baseBpm + Math.floor(Math.random() * 8 - 4));
    }, 1200);

    return () => clearInterval(interval);
  }, [depthState.corruptionLevel]);

  // Master volume starts from the engine default so tapes, clips,
  // background radio, and synth agree from the first frame
  useEffect(() => {
    setMasterVolume(horrorAudioEngine.getVolume());
  }, []);

  const handleMuteToggle = () => {
    const muted = horrorAudioEngine.toggleMute();
    setIsMuted(muted);
    // one mute silences everything: synth engine + background bed + tapes/clips
    setRadioMuted(muted);
    nudgeProximity();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    horrorAudioEngine.setVolume(val);
    setMasterVolume(val);
    nudgeProximity();
    if (isMuted && val > 0) {
      horrorAudioEngine.toggleMute();
      setIsMuted(false);
      setRadioMuted(false);
    }
  };

  const getTierColor = () => {
    switch (depthState.tier) {
      case 'surface':
        return 'text-emerald-400 border-emerald-800/40 bg-emerald-950/20';
      case 'decay':
        return 'text-amber-400 border-amber-800/40 bg-amber-950/20';
      case 'breakdown':
        return 'text-orange-500 border-orange-800/40 bg-orange-950/30';
      case 'nightmare':
        return 'text-red-500 border-red-800/50 bg-red-950/40';
      case 'abyss':
      default:
        return 'text-red-400 border-red-600/80 bg-red-950/70 shadow-lg shadow-red-950 animate-pulse';
    }
  };

  return (
    <header
      id="horror-hud"
      className="fixed top-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-b border-white/10 px-4 py-2.5 font-mono text-xs select-none"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Depth and Sector Tier */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">down:</span>
            <span className="text-white font-bold tracking-wider text-sm">
              {formatDepth(depthState.depthMeters)}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] uppercase tracking-wider font-semibold ${getTierColor()} ${
              isViolentShock ? 'animate-artifact-spasm' : ''
            }`}
          >
            {depthState.tier === 'abyss' ? (
              <Skull className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>{depthState.tier}</span>
          </div>
        </div>

        {/* Center: Corruption & Vitals */}
        <div className="flex items-center gap-4">
          {/* Corruption Meter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">rot:</span>
            <div className="w-24 sm:w-32 h-2.5 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 transition-all duration-300"
                style={{ width: `${Math.min(100, depthState.corruptionLevel)}%` }}
              />
            </div>
            <span className="text-neutral-200 font-bold min-w-[32px]">
              {depthState.corruptionLevel}%
            </span>
          </div>

          {/* Heart Rate */}
          <div className="hidden md:flex items-center gap-1.5 text-red-400 bg-red-950/30 border border-red-900/40 px-2 py-0.5 rounded">
            <Activity className="w-3.5 h-3.5 animate-bounce" />
            <span>{heartRate} BPM</span>
          </div>
        </div>

        {/* Right: Audio Controls */}
        <div className="flex items-center gap-2.5">
          {/* Audio Mute & Slider */}
          <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 px-2 py-1 rounded">
            <button
              id="hud-mute-btn"
              onClick={handleMuteToggle}
              className="text-neutral-300 hover:text-white p-1 transition-colors cursor-pointer"
              title={isMuted ? 'sound on' : 'sound off'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-neutral-700 accent-red-500 cursor-pointer"
              title="loudness"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
