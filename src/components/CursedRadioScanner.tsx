/**
 * Single-purpose component: Cursed electromagnetic radio frequency tuner.
 * Allows user to slide across VLF/HF frequency bands to discover phantom signals,
 * trigger synthesized heterodyne radio sweeps, and decode uncanny subterranean broadcasts.
 */

import React, { useState } from 'react';
import { Radio, Signal, VolumeX, AlertTriangle } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';

interface CursedRadioScannerProps {
  initialFreq?: string;
  isViolentShock?: boolean;
}

const PHANTOM_SIGNALS: Record<number, { title: string; transcript: string }> = {
  38: {
    title: '38.0 kHz // SUBTERRANEAN CARRIER',
    transcript: '...they are under the foundation... do not dig further... the earth has ribs...'
  },
  114: {
    title: '114.2 kHz // NUMBERS BEACON',
    transcript: '4 - 9 - 0 - 2 - 8 - 1 ... REPEAT: NO ESCAPE FOR OBSERVER ... 4 - 9 - 0 ...'
  },
  240: {
    title: '240.5 kHz // AIR TUBE WEAK MIC',
    transcript: '[HEAVY WET INHALES] ...can anyone hear me... my eyes are gone...'
  },
  388: {
    title: '388.0 kHz // GEODETIC HYDROPHONE',
    transcript: '[LOUD METALLIC GROAN] ...chamber pressure exceeding 500 atmospheres...'
  }
};

export const CursedRadioScanner: React.FC<CursedRadioScannerProps> = ({
  isViolentShock = false
}) => {
  const [frequency, setFrequency] = useState(114);
  const [signalLocked, setSignalLocked] = useState(true);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFrequency(val);

    // Audio frequency sweep feedback
    horrorAudioEngine.playRadioScannerDial(0.85);

    // Check if near any phantom signal within +/- 6 kHz
    const matched = Object.keys(PHANTOM_SIGNALS).some(
      freq => Math.abs(parseInt(freq, 10) - val) <= 6
    );
    setSignalLocked(matched);
  };

  // Find active broadcast if matched
  const activeBroadcast = Object.entries(PHANTOM_SIGNALS).find(
    ([freq]) => Math.abs(parseInt(freq, 10) - frequency) <= 6
  );

  return (
    <div
      id="cursed-radio-scanner-card"
      className={`my-3 p-3 rounded border border-amber-900/60 bg-neutral-950 font-mono text-xs ${
        isViolentShock ? 'animate-artifact-spasm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2 text-[10px] text-amber-400">
        <div className="flex items-center gap-1.5 font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>VLF RADIO TELEMETRY RECEIVER</span>
        </div>
        <div className="flex items-center gap-1">
          {signalLocked ? (
            <span className="flex items-center gap-1 text-emerald-400 text-[9px] font-bold">
              <Signal className="w-3 h-3 animate-bounce" /> SIGNAL LOCKED
            </span>
          ) : (
            <span className="flex items-center gap-1 text-neutral-500 text-[9px]">
              <VolumeX className="w-3 h-3" /> STATIC NOISE
            </span>
          )}
        </div>
      </div>

      {/* Tuner Dial Display */}
      <div className="p-2 mb-2 rounded bg-black border border-amber-950/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-500 block">TUNED FREQUENCY</span>
          <span className="text-sm font-bold text-amber-300 tracking-wider">
            {frequency.toFixed(1)} kHz
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 block">BAND</span>
          <span className="text-[10px] text-neutral-400 font-semibold">VERY LOW FREQ</span>
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
        </div>
      ) : (
        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-[10px] italic">
          [No intelligible broadcast on this band. White noise hiss and distant electromagnetic echoes...]
        </div>
      )}
    </div>
  );
};
