/**
 * Single-purpose component: Structural Collapse Ribbon / Spatial Rupture Banner.
 * Renders an unruly, diagonal containment tape or corrupted telemetry tear
 * cutting across the stream, reinforcing the feeling of physical infrastructure breakdown.
 */

import React from 'react';
import { zalgoText } from '../utils/zalgo';
import { formatDepth } from '../utils/depthScale';

interface StructuralCollapseRibbonProps {
  thresholdMeters: number;
  corruptionLevel: number;
  variant?: 'hazard-tape' | 'memory-rupture' | 'biohazard-purge';
  seed?: number;
}

export const StructuralCollapseRibbon: React.FC<StructuralCollapseRibbonProps> = ({
  thresholdMeters,
  corruptionLevel,
  variant = 'hazard-tape',
  seed = 42
}) => {
  const corruptionFrac = corruptionLevel / 100;
  const angle = ((seed % 7) - 3.5) * 1.8; // e.g. -4.5deg to +4.5deg

  const textSamples = {
    'hazard-tape': "don't cross. floor soft here. back up",
    'memory-rupture': '0x00dead. wall gave. it bled dust',
    'biohazard-purge': 'leave it shut. it knows your step'
  };

  const rawText = textSamples[variant];
  const renderedText = zalgoText(rawText, Math.min(0.8, corruptionFrac * 0.7));

  return (
    <div
      className="relative z-30 my-8 py-2 w-[116%] -ml-[8%] overflow-hidden pointer-events-none select-none font-mono text-[11px] font-black uppercase tracking-widest shadow-2xl transition-transform"
      style={{
        transform: `rotate(${angle}deg)`,
        backgroundColor: variant === 'hazard-tape' ? '#7f1d1d' : '#171717',
        color: variant === 'hazard-tape' ? '#fecaca' : '#ef4444',
        borderTop: '2px dashed #dc2626',
        borderBottom: '2px dashed #dc2626',
        boxShadow: '0 0 25px rgba(220, 38, 38, 0.4)'
      }}
    >
      <div className="whitespace-nowrap flex gap-8 animate-pulse">
        <span>⚠ {renderedText} ⚠</span>
        <span>[{formatDepth(thresholdMeters)} down]</span>
        <span>⚠ {renderedText} ⚠</span>
        <span>[rot {Math.floor(corruptionLevel)}%]</span>
      </div>
    </div>
  );
};
