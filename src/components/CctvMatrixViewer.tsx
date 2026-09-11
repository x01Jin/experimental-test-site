/**
 * Single-purpose component: Multi-channel CCTV matrix surveillance switcher.
 * Allows user to switch between security camera feeds, updates real-time surveillance timestamps,
 * and triggers authentic video switcher interference and electromagnetic static snaps.
 */

import React, { useState, useEffect } from 'react';
import { Camera, Radio, Eye } from 'lucide-react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';
import { InternetImageSpecimen, getRandomInternetImage } from '../utils/internetImages';

interface CctvMatrixViewerProps {
  initialSpecimen?: InternetImageSpecimen;
  isViolentShock?: boolean;
}

const CHANNELS = [
  { id: 'cam-01', label: 'CAM 01: CORRIDOR 4', category: 'surveillance' as const },
  { id: 'cam-04', label: 'CAM 04: WARD B', category: 'surveillance' as const },
  { id: 'cam-09', label: 'CAM 09: ELEVATOR CAGE', category: 'surveillance' as const },
  { id: 'cam-14', label: 'CAM 14: ABYSSAL SHAFT', category: 'liminal' as const }
];

export const CctvMatrixViewer: React.FC<CctvMatrixViewerProps> = ({
  initialSpecimen,
  isViolentShock = false
}) => {
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [currentSpecimen, setCurrentSpecimen] = useState<InternetImageSpecimen>(
    initialSpecimen || getRandomInternetImage(undefined, 'surveillance')
  );
  const [timestamp, setTimestamp] = useState('03:44:12');

  // Real-time CCTV clock simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setTimestamp(timeStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChannelSwitch = (idx: number) => {
    setActiveChannelIdx(idx);
    const newSpecimen = getRandomInternetImage(Date.now() + idx, CHANNELS[idx].category);
    setCurrentSpecimen(newSpecimen);
    horrorAudioEngine.triggerAggressiveEvent(0.7);
  };

  return (
    <div
      id="cctv-matrix-viewer-card"
      className={`my-3 p-3 rounded border border-neutral-800 bg-neutral-950 font-mono text-xs ${
        isViolentShock ? 'animate-artifact-spasm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-neutral-800 text-[10px] text-neutral-400">
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <Camera className="w-3.5 h-3.5" />
          <span>VMS MATRIX // {CHANNELS[activeChannelIdx].label}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <span className="flex items-center gap-1 text-red-500 animate-pulse font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" /> REC
          </span>
          <span>{timestamp}</span>
        </div>
      </div>

      {/* Feed Image Canvas Display with Scanlines */}
      <div className="relative aspect-video w-full overflow-hidden rounded border border-neutral-800 bg-black mb-2">
        <img
          src={currentSpecimen.url}
          alt={currentSpecimen.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
        />
        {/* Analog Scanline Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-70" />

        {/* Live Channel HUD Stamp */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 border border-neutral-700 text-[9px] text-emerald-300">
          {CHANNELS[activeChannelIdx].label}
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 border border-neutral-700 text-[9px] text-neutral-400 flex items-center gap-1">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>FPS: 14.8</span>
        </div>
      </div>

      {/* Channel Switcher Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {CHANNELS.map((ch, idx) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => handleChannelSwitch(idx)}
            className={`py-1.5 px-2 rounded text-[10px] font-bold border transition-all cursor-pointer ${
              activeChannelIdx === idx
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600 shadow-sm shadow-emerald-950'
                : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 border-neutral-800'
            }`}
          >
            [CAM 0{idx + 1}]
          </button>
        ))}
      </div>

      <div className="mt-2 text-[10px] text-neutral-400 flex items-center gap-1">
        <Eye className="w-3 h-3 text-red-500" />
        <span className="italic">{currentSpecimen.caption}</span>
      </div>
    </div>
  );
};
