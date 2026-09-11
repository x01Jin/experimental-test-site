/**
 * Main application component orchestrating the infinite horror descent.
 * Coordinates depth tracking, localized element/popup shaking, procedural BSOD audio synthesis,
 * background eye tracking canvas, CRT/VHS overlays, and abstract non-blocking jumpscares.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDepthTracker } from './effects/useDepthTracker';
import { useViolentShake } from './effects/useViolentShake';
import { horrorAudioEngine } from './audio/horrorAudioEngine';
import { JumpscareEvent, JumpscareType } from './types/horror';
import { WarningScreen } from './components/WarningScreen';
import { HudStatus } from './components/HudStatus';
import { CrtVhsOverlay } from './components/CrtVhsOverlay';
import { HorrorCanvas } from './components/HorrorCanvas';
import { InfiniteHorrorStream } from './components/InfiniteHorrorStream';
import { JumpscareOverlay } from './components/JumpscareOverlay';
import { getRandomInternetImage } from './utils/internetImages';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentJumpscare, setCurrentJumpscare] = useState<JumpscareEvent | null>(null);

  const depthState = useDepthTracker();
  const { shake, triggerShake } = useViolentShake(depthState.corruptionLevel);

  const randomJumpscareTimerRef = useRef<number | null>(null);

  // Sync depth and corruption with audio engine
  useEffect(() => {
    if (hasEntered) {
      horrorAudioEngine.updateDepth(depthState.depthMeters, depthState.corruptionLevel);
    }
  }, [hasEntered, depthState.depthMeters, depthState.corruptionLevel]);

  // Handler for triggering jumpscares
  const handleTriggerJumpscare = useCallback(
    (event: JumpscareEvent) => {
      setCurrentJumpscare(event);
      // Trigger violent localized shaking on elements & popups
      triggerShake(event.intensity * 1.5, event.durationMs + 300);
      horrorAudioEngine.triggerJumpscare(event.intensity, true);
    },
    [triggerShake]
  );

  const handleJumpscareEnd = useCallback(() => {
    setCurrentJumpscare(null);
  }, []);

  // Handler for manual panic button
  const handleManualPanic = useCallback(() => {
    const jumpscareTypes: JumpscareType[] = [
      'loud-crash-noise',
      'corrupted-error-popup',
      'distorted-fetched-image',
      'abstract-signal-tear'
    ];
    const randomType = jumpscareTypes[Math.floor(Math.random() * jumpscareTypes.length)];

    handleTriggerJumpscare({
      id: `manual-panic-${Date.now()}`,
      type: randomType,
      intensity: 3,
      timestamp: Date.now(),
      durationMs: randomType === 'corrupted-error-popup' ? 2400 : 280,
      imageSpecimen: randomType === 'distorted-fetched-image' ? getRandomInternetImage(depthState.depthMeters) : undefined
    });
  }, [depthState.depthMeters, handleTriggerJumpscare]);

  // Handler for individual aggressive shocks from items or user interactions
  const handleTriggerViolentShake = useCallback(
    (intensity: number) => {
      triggerShake(intensity, 500);
      horrorAudioEngine.triggerAggressiveEvent(intensity);
    },
    [triggerShake]
  );

  const depthStateRef = useRef(depthState);
  useEffect(() => {
    depthStateRef.current = depthState;
  }, [depthState]);

  // Infrequent, unpredictable surprise abstract jumpscares designed to catch the user offguard
  useEffect(() => {
    if (!hasEntered) return;

    const scheduleRandomAmbush = () => {
      if (randomJumpscareTimerRef.current !== null) {
        window.clearTimeout(randomJumpscareTimerRef.current);
      }

      // Infrequent intervals (50s to 95s) to allow tension to build and catch user offguard
      const currentDepth = depthStateRef.current;
      const corruptionFactor = currentDepth.corruptionLevel / 100;
      const minDelay = 50000 - corruptionFactor * 15000;
      const delay = minDelay + Math.random() * 45000;

      randomJumpscareTimerRef.current = window.setTimeout(() => {
        const latestDepth = depthStateRef.current;
        // Only trigger if descended past 450m
        if (latestDepth.depthMeters > 450) {
          const jumpscareTypes: JumpscareType[] = [
            'loud-crash-noise',
            'corrupted-error-popup',
            'distorted-fetched-image',
            'abstract-signal-tear'
          ];
          const randomType = jumpscareTypes[Math.floor(Math.random() * jumpscareTypes.length)];
          const intensity = 2 + (latestDepth.corruptionLevel / 100) * 2.5;

          handleTriggerJumpscare({
            id: `random-ambush-${Date.now()}`,
            type: randomType,
            intensity,
            timestamp: Date.now(),
            durationMs: randomType === 'corrupted-error-popup' ? 2400 : 260 + Math.floor(Math.random() * 60),
            imageSpecimen: randomType === 'distorted-fetched-image' ? getRandomInternetImage(latestDepth.depthMeters) : undefined
          });
        }
        scheduleRandomAmbush();
      }, delay);
    };

    scheduleRandomAmbush();

    return () => {
      if (randomJumpscareTimerRef.current !== null) {
        window.clearTimeout(randomJumpscareTimerRef.current);
      }
    };
  }, [hasEntered, handleTriggerJumpscare]);

  return (
    <div
      id="horror-app-root"
      className="relative min-h-screen w-full bg-black text-neutral-200 overflow-x-hidden select-none selection:bg-red-900 selection:text-white"
    >
      {!hasEntered ? (
        <WarningScreen onEnter={() => setHasEntered(true)} />
      ) : (
        /* The entire viewport wrapper is NOT transformed or rotated, preserving natural scrolling */
        <div className="min-h-screen w-full relative">
          {/* HUD Status Header with localized shaking */}
          <HudStatus
            depthState={depthState}
            isViolentShock={shake.isViolent}
            onTriggerManualJumpscare={handleManualPanic}
          />

          {/* Background Eye & Vein Canvas */}
          <HorrorCanvas
            corruptionLevel={depthState.corruptionLevel}
            depthMeters={depthState.depthMeters}
          />

          {/* Infinite Horror Procedural Stream with element-level shaking */}
          <InfiniteHorrorStream
            depthState={depthState}
            isViolentShock={shake.isViolent}
            onTriggerJumpscare={handleTriggerJumpscare}
            onTriggerViolentShake={handleTriggerViolentShake}
          />

          {/* CRT / VHS Overlay & Scanlines */}
          <CrtVhsOverlay
            corruptionLevel={depthState.corruptionLevel}
            isViolent={shake.isViolent}
          />

          {/* Abstract Non-Blocking Jumpscare Layer (loud noise, popup, distorted image, signal tear) */}
          <JumpscareOverlay
            currentJumpscare={currentJumpscare}
            onJumpscareEnd={handleJumpscareEnd}
            onTriggerAggressiveShock={handleTriggerViolentShake}
          />
        </div>
      )}
    </div>
  );
}
