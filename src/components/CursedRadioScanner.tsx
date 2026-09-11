/**
 * Single-purpose component: Cursed electromagnetic radio frequency tuner.
 * Allows user to slide across VLF/HF frequency bands to discover phantom signals,
 * trigger synthesized heterodyne radio sweeps, and decode uncanny subterranean broadcasts.
 */

import React, { useRef, useState } from 'react';
import { Radio, Signal, VolumeX, AlertTriangle } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';
import { AUDIO_CLIPS } from '../utils/foundVerbatim';

interface CursedRadioScannerProps {
  initialFreq?: string;
  isViolentShock?: boolean;
}

const PHANTOM_SIGNALS: Record<number, { title: string; transcript: string; clip: number }> = {
  38: {
    title: '38.0 khz — pipe mic',
    transcript: '...drip... drip... then nothing... then dragging...',
    clip: 6
  },
  114: {
    title: '114.2 khz — numbers',
    transcript: '4 - 9 - 0 - 2 ... repeat ... your street ... 4 - 9 - 0 ...',
    clip: 0
  },
  240: {
    title: '240.5 khz — lift shaft',
    transcript: '[wet inhale] ...hello? ...cable humming... is anyone up?',
    clip: 3
  },
  388: {
    title: '388.0 khz — sump',
    transcript: '[groan] ...pressure up... wall sweating... get out of B...',
    clip: 9
  }
};

export const CursedRadioScanner: React.FC<CursedRadioScannerProps> = ({
  isViolentShock = false
}) => {
  const [frequency, setFrequency] = useState(114);
  const [signalLocked, setSignalLocked] = useState(true);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tuneTo = (clipIdx: number, label: string) => {
    const audio = audioRef.current;
    const clip = AUDIO_CLIPS[clipIdx % AUDIO_CLIPS.length];
    if (!audio || !clip) return;
    if (audio.src !== clip.url) {
      audio.src = clip.url;
      audio.load();
    }
    const playFromRandom = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 15) {
        try {
          audio.currentTime = 5 + Math.random() * (audio.duration - 10);
        } catch { /* noop */ }
      }
      audio.volume = 0.5;
      audio.play().catch(() => { /* locked until gesture */ });
      setNowPlaying(label);
    };
    if (audio.readyState >= 1) playFromRandom();
    else audio.onloadedmetadata = playFromRandom;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFrequency(val);

    // Audio frequency sweep feedback
    horrorAudioEngine.playRadioScannerDial(0.85);

    // Check if near any phantom signal within +/- 6 kHz
    const matched = Object.entries(PHANTOM_SIGNALS).find(
      ([freq]) => Math.abs(parseInt(freq, 10) - val) <= 6
    );
    setSignalLocked(!!matched);
    if (matched) tuneTo(matched[1].clip, matched[1].title);
    else {
      audioRef.current?.pause();
      setNowPlaying(null);
    }
  };

  // Find active broadcast if matched
  const activeBroadcast = Object.entries(PHANTOM_SIGNALS).find(
    ([freq]) => Math.abs(parseInt(freq, 10) - frequency) <= 6
  );

  return (
    <div
      id="cursed-radio-scanner-card"
      className={`my-3 p-3 rounded border border-amber-900/60 bg-neutral-950 font-mono text-xs ${isViolentShock ? 'animate-artifact-spasm' : ''
        }`}
    >
      <div className="flex items-center justify-between mb-2 text-[10px] text-amber-400">
        <div className="flex items-center gap-1.5 font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>radio</span>
        </div>
        <div className="flex items-center gap-1">
          {signalLocked ? (
            <span className="flex items-center gap-1 text-emerald-400 text-[9px] font-bold">
              <Signal className="w-3 h-3 animate-bounce" /> caught something
            </span>
          ) : (
            <span className="flex items-center gap-1 text-neutral-500 text-[9px]">
              <VolumeX className="w-3 h-3" /> hiss
            </span>
          )}
        </div>
      </div>

      {/* Tuner Dial Display */}
      <div className="p-2 mb-2 rounded bg-black border border-amber-950/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-500 block">tuned</span>
          <span className="text-sm font-bold text-amber-300 tracking-wider">
            {frequency.toFixed(1)} kHz
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 block">BAND</span>
          <span className="text-[10px] text-neutral-400 font-semibold">very low</span>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="mb-2">
        <input
          type="range"
          min="20"
          max="450"
          value={frequency}
          onChange={handleSliderChange}
          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[9px] text-neutral-500 mt-1 font-mono">
          <span>20 kHz</span>
          <span>150 kHz</span>
          <span>300 kHz</span>
          <span>450 kHz</span>
        </div>
      </div>

      {/* Intercepted Signal Transcript Display */}
      {activeBroadcast ? (
        <div className="p-2 rounded bg-amber-950/30 border border-amber-800/60 text-amber-200 text-[11px] animate-pulse">
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px] mb-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{activeBroadcast[1].title}</span>
          </div>
          <p className="leading-snug italic font-mono text-[10px]">
            &quot;{activeBroadcast[1].transcript}&quot;
          </p>
          {nowPlaying && (
            <p className="mt-1 font-mono text-[9px] not-italic text-amber-400/70">
              playing: {AUDIO_CLIPS[activeBroadcast[1].clip % AUDIO_CLIPS.length]?.label} — LibriVox
            </p>
          )}
        </div>
      ) : (
        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-[10px] italic">
          [nothing.]
        </div>
      )}
      <audio ref={audioRef} preload="none" />
    </div>
  );
};
