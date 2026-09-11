/**
 * Single-purpose module: Violent aggressive shock state manager.
 * Tracks discrete shock states and triggers localized spasms on cards, popups,
 * and creepy visual artifacts without unneeded render loops.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface ShakeState {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  chromaticShift: number;
  isViolent: boolean;
}

export function useViolentShake(baselineCorruption: number) {
  const [isViolent, setIsViolent] = useState(false);
  const shockTimerRef = useRef<number | null>(null);

  /**
   * Adds sudden violent trauma to trigger localized element spasms
   */
  const triggerShake = useCallback((_intensity = 1.0, durationMs = 800) => {
    setIsViolent(true);

    if (shockTimerRef.current !== null) {
      window.clearTimeout(shockTimerRef.current);
    }

    shockTimerRef.current = window.setTimeout(() => {
      setIsViolent(false);
      shockTimerRef.current = null;
    }, durationMs);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (shockTimerRef.current !== null) {
        window.clearTimeout(shockTimerRef.current);
      }
    };
  }, []);

  // Backwards-compatible object for components consuming `shake`
  const shake: ShakeState = {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    chromaticShift: baselineCorruption > 60 ? 4 : 0,
    isViolent
  };

  return { shake, triggerShake, isViolent };
}
