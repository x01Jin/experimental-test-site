/**
 * Radio dial tile. Stateless: the dial position and the sound itself live
 * in the global background radio (globalRadio.ts) — every tile shows the
 * same frequency, tuning any tile retunes the one shared station.
 *
 * Each mounted tile rolls its own phantom-signal map once: the frequencies
 * that carry audio are randomized per instance, so one tile's live channel
 * can be another tile's dead air. Signal texture comes from the
 * numbers-station runs pool — no prose, just signal.
 */

import React, { useMemo, useRef } from 'react';
import { Radio, Signal, VolumeX, AlertTriangle } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';
import { AUDIO_CLIPS } from '../utils/foundVerbatim';
import { NUMBERS_RUNS, GIBBERISH_BLOCKS } from '../utils/foundHorror';
import { registerProximity } from '../audio/proximityBus';
import { useRadioState, tuneRadio } from '../audio/globalRadio';
import { getCorruptionParams } from '../utils/corruptionCurve';

interface CursedRadioScannerProps {
  initialFreq?: string;
  depthMeters: number;
  isViolentShock?: boolean;
}

interface PhantomSignal {
  freq: number;
  title: string;
  texture: string;
  clip: number;
}

function rollMap(): PhantomSignal[] {
  const bands: Array<[number, number, string]> = [
    [20, 120, 'low band'],
    [120, 250, 'mid band'],
    [250, 360, 'high band'],
    [360, 450, 'top band'],
  ];
  return bands.map(([lo, hi, band]) => {
    const freq = Math.round(lo + Math.random() * (hi - lo));
    const clip = Math.floor(Math.random() * AUDIO_CLIPS.length);
    const pool = Math.random() < 0.6 ? NUMBERS_RUNS : GIBBERISH_BLOCKS;
    return {
      freq,
      title: `${freq.toFixed(1)} khz — ${band}`,
      texture: pool[Math.floor(Math.random() * pool.length)],
      clip,
    };
  });
}

export const CursedRadioScanner: React.FC<CursedRadioScannerProps> = ({
  depthMeters,
  isViolentShock = false
}) => {
  const shared = useRadioState();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const unregRef = useRef<(() => void) | null>(null);
  const signals = useMemo(rollMap, []);
  const params = getCorruptionParams(depthMeters);

  // presence sentinel so the background bed knows a dial is on screen
  React.useEffect(() => {
    const box = boxRef.current;
    if (box && !unregRef.current) {
      unregRef.current = registerProximity({ el: null, box, kind: 'radio', gate: { v: 1 } });
    }
    return () => {
      unregRef.current?.();
      unregRef.current = null;
    };
  }, []);

  const matched = signals.find(s => Math.abs(s.freq - shared.freq) <= 6);
  const signalLocked = !!matched;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    horrorAudioEngine.playRadioScannerDial(0.85);
    const hit = signals.find(s => Math.abs(s.freq - val) <= 6);
    tuneRadio(val, hit ? hit.clip : null);
  };

  React.useEffect(() => {
    const box = boxRef.current;
    if (box && !unregRef.current) {
      unregRef.current = registerProximity({ el: null, box, kind: 'radio', gate: { v: 1 } });
    }
    return () => {
      unregRef.current?.();
      unregRef.current = null;
    };
  }, []);

  const onAirClip = shared.liveClip >= 0 ? AUDIO_CLIPS[shared.liveClip % AUDIO_CLIPS.length] : null;

  return (
    <div
      id="cursed-radio-scanner-card"
      ref={boxRef}
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
            {shared.freq.toFixed(1)} kHz
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
          value={Math.round(shared.freq)}
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

      {/* Intercepted Signal Display */}
      {matched ? (
        <div className="p-2 rounded bg-amber-950/30 border border-amber-800/60 text-amber-200 text-[11px] animate-pulse">
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px] mb-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{matched.title}</span>
          </div>
          <p className="leading-snug italic font-mono text-[10px]">
            &quot;{matched.texture}&quot;
          </p>
          {onAirClip && (
            <p className="mt-1 font-mono text-[9px] not-italic text-amber-400/70">
              playing: {onAirClip.label} — LibriVox · rot {Math.round(params.c * 100)}%
            </p>
          )}
        </div>
      ) : (
        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800 text-neutral-500 text-[10px] italic">
          [nothing.]
        </div>
      )}
    </div>
  );
};
