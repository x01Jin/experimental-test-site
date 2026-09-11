/**
 * Single-purpose component: Interactive classified redaction blocks.
 * Renders blackout blocks ([REDACTED: ...]) that reveal forbidden text
 * upon user interaction (click/hover) accompanied by subtle audio feedback.
 */

import React, { useState } from 'react';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';

interface RedactedTextProps {
  text: string;
  onReveal?: () => void;
}

export const RedactedText: React.FC<RedactedTextProps> = ({ text, onReveal }) => {
  const [revealedSegments, setRevealedSegments] = useState<Record<number, boolean>>({});

  // Parse text looking for [REDACTED: ...] segments
  const parts = text.split(/(\[REDACTED:[^\]]+\])/g);

  const handleReveal = (index: number) => {
    if (!revealedSegments[index]) {
      setRevealedSegments(prev => ({ ...prev, [index]: true }));
      horrorAudioEngine.playRedactionReveal(0.9);
      if (onReveal) onReveal();
    }
  };

  return (
    <span className="leading-relaxed">
      {parts.map((part, idx) => {
        const isRedacted = part.startsWith('[REDACTED:') && part.endsWith(']');
        if (!isRedacted) {
          return <span key={idx}>{part}</span>;
        }

        const cleanContent = part.replace(/^\[REDACTED:\s*/, '').replace(/\]$/, '');
        const isRevealed = revealedSegments[idx];

        return (
          <button
            key={idx}
            type="button"
            onClick={() => handleReveal(idx)}
            onMouseEnter={() => handleReveal(idx)}
            title={isRevealed ? 'CLASSIFIED DISCLOSURE' : 'CLICK OR HOVER TO REVEAL CLASSIFIED TEXT'}
            className={`inline-block mx-1 px-1.5 py-0.5 rounded font-mono text-xs cursor-pointer transition-all duration-200 ${
              isRevealed
                ? 'bg-red-950/80 text-red-300 border border-red-700/80 underline decoration-red-500 font-semibold shadow-sm shadow-red-950'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-500 border border-neutral-700 select-none tracking-widest'
            }`}
          >
            {isRevealed ? cleanContent : '██████████'}
          </button>
        );
      })}
    </span>
  );
};
