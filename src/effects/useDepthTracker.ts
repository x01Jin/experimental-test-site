/**
 * Single-purpose module: Scroll depth tracker, corruption tier calculator,
 * and velocity monitor.
 */

import { useState, useEffect, useRef } from 'react';
import { DepthState, DepthTier } from '../types/horror';

export function useDepthTracker() {
  const [depthState, setDepthState] = useState<DepthState>({
    scrollY: 0,
    depthMeters: 0,
    corruptionLevel: 0,
    tier: 'surface',
    scrollVelocity: 0,
    isRapidScrolling: false,
  });

  const lastScrollY = useRef<number>(0);
  const lastScrollTime = useRef<number>(performance.now());
  const velocityRef = useRef<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || document.documentElement.scrollTop || 0;
          const now = performance.now();
          const dt = Math.max(now - lastScrollTime.current, 1);
          const dy = Math.abs(currentY - lastScrollY.current);

          // Velocity in pixels per millisecond
          const currentVelocity = dy / dt;
          velocityRef.current = currentVelocity;
          lastScrollY.current = currentY;
          lastScrollTime.current = now;

          // Depth calculation: 1 px = 0.4 meters
          const meters = Math.floor(currentY * 0.4);

          // Corruption level from 0 to 100+ based on meters (maxes out around 5000m)
          const corruption = Math.min(100, Math.floor((meters / 4000) * 100));

          let tier: DepthTier = 'surface';
          if (meters >= 3500) {
            tier = 'abyss';
          } else if (meters >= 1800) {
            tier = 'nightmare';
          } else if (meters >= 600) {
            tier = 'breakdown';
          } else if (meters >= 150) {
            tier = 'decay';
          }

          const isRapid = currentVelocity > 1.8;

          setDepthState({
            scrollY: currentY,
            depthMeters: meters,
            corruptionLevel: corruption,
            tier,
            scrollVelocity: currentVelocity,
            isRapidScrolling: isRapid,
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return depthState;
}
