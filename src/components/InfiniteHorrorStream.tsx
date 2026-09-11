/**
 * Single-purpose component: Infinite procedural horror stream generator.
 * Continuously appends increasingly crowded, corrupted, and displaced
 * horror artifacts, corrupted internet photographs, and abstract aggressive patterns
 * as the user scrolls downwards endlessly.
 *
 * Jumpscares are abstract, non-blocking (loud noises, popups, distorted fetched images, signal tears),
 * and shaking is localized strictly to elements, popups, and creepy visual artifacts.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HorrorItem, DepthState, JumpscareEvent, JumpscareType } from '../types/horror';
import { HORROR_TEMPLATES, NarrativeTemplate } from '../utils/scaryTexts';
import { getRandomInternetImage, getSpecimenForNarrativeType } from '../utils/internetImages';
import { generateProceduralHorrorItem } from '../utils/proceduralNarrative';
import { generateLayoutChaos } from '../utils/layoutChaos';
import { PX_TO_M, getCorruptionFraction, formatDepth } from '../utils/depthScale';
import { HorrorTile } from './HorrorTile';
import { AggressiveGlitchPattern, GlitchPatternType } from './AggressiveGlitchPattern';
import { StructuralCollapseRibbon } from './StructuralCollapseRibbon';

interface InfiniteHorrorStreamProps {
  depthState: DepthState;
  isViolentShock?: boolean;
  onTriggerJumpscare: (event: JumpscareEvent) => void;
  onTriggerViolentShake: (intensity: number) => void;
}

export const InfiniteHorrorStream: React.FC<InfiniteHorrorStreamProps> = ({
  depthState,
  isViolentShock = false,
  onTriggerJumpscare,
  onTriggerViolentShake
}) => {
  const [items, setItems] = useState<HorrorItem[]>([]);
  const batchCountRef = useRef(0);
  const lastTriggeredThresholdRef = useRef(0);
  const lastJumpscareTimeRef = useRef(0);
  const isLoadingRef = useRef(false);
  const onTriggerJumpscareRef = useRef(onTriggerJumpscare);

  useEffect(() => {
    onTriggerJumpscareRef.current = onTriggerJumpscare;
  }, [onTriggerJumpscare]);

  // Procedurally generate a batch of horror items with images and degradation attributes
  // Thresholds are anchored to live scroll depth so banners never lag the HUD.
  const generateBatch = useCallback((startThreshold: number, count = 8): HorrorItem[] => {
    const newItems: HorrorItem[] = [];
    const corruptionFrac = getCorruptionFraction(startThreshold);

    // Real-world tile cost: ~400-600px per card ≈ 160-240m. Step 45m/item lagged
    // 5x behind live depth. Use 200m/item so fictional depth tracks scrollY*0.4.
    const METERS_PER_ITEM = 200;

    for (let i = 0; i < count; i++) {
      const threshold = Math.floor(startThreshold + i * METERS_PER_ITEM);

      // everything random: 3 in 4 procedural rolls, 1 in 4 a verbatim template
      if (Math.random() < 0.75) {
        newItems.push(generateProceduralHorrorItem(threshold, i, batchCountRef.current));
      } else {
        const template: NarrativeTemplate = HORROR_TEMPLATES[Math.floor(Math.random() * HORROR_TEMPLATES.length)];

        // Displacement and chaos scale with depth
        const maxDisp = Math.pow(corruptionFrac, 1.3) * 42;
        const maxRot = Math.pow(corruptionFrac, 1.4) * 5.5;

        const dispX = (Math.random() * 2 - 1) * maxDisp;
        const dispY = (Math.random() * 2 - 1) * (maxDisp * 0.4);
        const rot = (Math.random() * 2 - 1) * maxRot;
        const scale = 1 + (Math.random() - 0.5) * (corruptionFrac * 0.08);

        // Fetch correlated internet image specimen based on horror archetype
        const imageSpecimen = getSpecimenForNarrativeType(template.type, Math.floor(Math.random() * 100000));
        const chaosProfile = generateLayoutChaos(threshold, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 100000));

        newItems.push({
          id: `item-${threshold}-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          depthThreshold: threshold,
          type: template.type,
          title: template.title,
          content: template.content,
          imageSpecimen,
          extraMeta: template.extraMeta,
          displacementX: dispX,
          displacementY: dispY,
          rotation: rot,
          scale,
          glitchSeverity: Math.min(1.2, corruptionFrac + Math.random() * 0.25),
          chaosProfile
        });
      }
    }

    batchCountRef.current += 1;
    return newItems;
  }, []);

  // Initial seed generation
  useEffect(() => {
    const initialBatch = generateBatch(0, 12);
    setItems(initialBatch);
  }, [generateBatch]);

  // Infinite scroll replenishment trigger — anchored to live depth
  useEffect(() => {
    const handleScrollReplenish = () => {
      if (isLoadingRef.current) return;

      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      // Replenish buffer when within 1400px of page bottom
      if (docHeight - scrollBottom < 1400) {
        isLoadingRef.current = true;
        setItems(prev => {
          const lastThreshold = prev.length > 0 ? prev[prev.length - 1].depthThreshold : 0;
          // Live depth estimate from actual document height — prevents 5x lag
          const liveEstimate = Math.floor(docHeight * PX_TO_M);
          const nextStart = Math.max(lastThreshold + 120, liveEstimate - 400);
          const nextBatch = generateBatch(nextStart, 8);
          return [...prev, ...nextBatch];
        });
        setTimeout(() => {
          isLoadingRef.current = false;
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScrollReplenish, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollReplenish);
  }, [generateBatch]);

  // Rare, unpredictable abstract jumpscares designed to catch the user offguard
  useEffect(() => {
    const currentM = depthState.depthMeters;
    const now = Date.now();

    // Minimum cooldown of 45 seconds between ANY jumpscares to prevent desensitization
    const JUMPSCARE_COOLDOWN = 45000;
    if (now - lastJumpscareTimeRef.current < JUMPSCARE_COOLDOWN) {
      return;
    }

    // Rare milestone checkpoints with randomized surprise offsets
    const rareMilestones = [520, 1950, 4300, 7600];
    for (const m of rareMilestones) {
      if (currentM >= m && lastTriggeredThresholdRef.current < m) {
        lastTriggeredThresholdRef.current = m;
        lastJumpscareTimeRef.current = now;

        const jumpscareTypes: JumpscareType[] = [
          'loud-crash-noise',
          'corrupted-error-popup',
          'distorted-fetched-image',
          'abstract-signal-tear'
        ];
        const selectedType = jumpscareTypes[Math.floor(Math.random() * jumpscareTypes.length)];
        const intensity = Math.min(5, Math.floor(2 + (m / 2000) * 1.5));

        onTriggerJumpscareRef.current({
          id: `jumpscare-depth-${m}`,
          type: selectedType,
          intensity,
          timestamp: now,
          durationMs: selectedType === 'corrupted-error-popup' ? 2400 : 260 + Math.floor(Math.random() * 80),
          imageSpecimen:
            selectedType === 'distorted-fetched-image'
              ? getRandomInternetImage(currentM, Math.random() > 0.5 ? 'specimen' : 'portrait')
              : undefined
        });
        return;
      }
    }

    // Subtle punishment for prolonged frantic scrolling: non-blocking audio static tear
    if (depthState.isRapidScrolling && depthState.depthMeters > 400) {
      if (Math.random() < 0.02) {
        lastJumpscareTimeRef.current = now;
        onTriggerJumpscareRef.current({
          id: `jumpscare-rapid-${now}`,
          type: Math.random() > 0.5 ? 'loud-crash-noise' : 'abstract-signal-tear',
          intensity: 3,
          timestamp: now,
          durationMs: 220
        });
      }
    }
  }, [depthState.depthMeters, depthState.isRapidScrolling]);

  const corruptionFrac = depthState.corruptionLevel / 100;

  return (
    <main
      id="infinite-horror-feed"
      className={`relative z-20 mx-auto px-3 sm:px-6 pt-20 pb-48 transition-all duration-700 ${
        corruptionFrac > 0.7
          ? 'max-w-7xl'
          : corruptionFrac > 0.4
          ? 'max-w-5xl'
          : corruptionFrac > 0.2
          ? 'max-w-4xl'
          : 'max-w-3xl'
      }`}
    >
      {/* Intro Header Section */}
      <section className="mb-12 text-center border-b border-neutral-800/80 pb-8 font-mono">
        <div className="inline-block bg-red-950/40 text-red-400 border border-red-900/60 px-3 py-1 rounded text-xs uppercase tracking-widest mb-3">
          old archive
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-3">
          Experimental Test Site
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          sector 00. telemetry left on. don't count the doors.
          <br />
          keep scrolling if you want.
        </p>
      </section>

      {/* Unconstrained Fractured Layout Stream with Organic Structural Breakdown */}
      <div className="relative w-full flex flex-col gap-6 transition-all duration-500">
        {items.map((item, idx) => {
          // Select an abstract aggressive pattern type if applicable
          const patternTypes: GlitchPatternType[] = [
            'ram-corruption-dump',
            'moire-lattice',
            'torn-hazard-slashes',
            'organic-void-bleed'
          ];
          const patternType = patternTypes[idx % patternTypes.length];
          const shouldRenderPattern = idx > 0 && idx % 6 === 0 && item.depthThreshold > 350;

          // Structural collapse caution ribbons slashing across the feed at depth
          const shouldRenderRibbon = idx > 0 && idx % 6 === 0 && item.depthThreshold > 450;
          const ribbonVariant = idx % 12 === 0 ? 'biohazard-purge' : idx % 18 === 0 ? 'memory-rupture' : 'hazard-tape';

          // Anomalous spatial voids with desynchronized telemetry gaps
          const shouldRenderVoid = idx > 0 && idx % 9 === 0 && corruptionFrac > 0.35;

          return (
            <React.Fragment key={item.id}>
              {shouldRenderRibbon && (
                <StructuralCollapseRibbon
                  thresholdMeters={Math.max(item.depthThreshold, depthState.depthMeters - 600)}
                  corruptionLevel={depthState.corruptionLevel}
                  variant={ribbonVariant}
                  seed={idx * 19}
                />
              )}

              {shouldRenderPattern && (
                <div className="w-full my-2">
                  <AggressiveGlitchPattern
                    type={patternType}
                    severity={Math.min(1.2, corruptionFrac * 1.1)}
                    seed={idx * 37}
                    isViolentShock={isViolentShock}
                  />
                </div>
              )}

              {shouldRenderVoid && (
                <div className="py-8 sm:py-14 text-center select-none font-mono text-[10px] sm:text-xs text-red-600/70 tracking-[0.25em] uppercase pointer-events-none">
                  <div className="border-t border-b border-red-900/50 py-3 animate-pulse bg-red-950/10">
                    --- [{formatDepth(depthState.depthMeters)} missing — tape cut] ---
                  </div>
                </div>
              )}

              <HorrorTile
                item={item}
                globalCorruption={depthState.corruptionLevel}
                isViolentShock={isViolentShock}
                onTriggerAggressiveShock={onTriggerViolentShake}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* Infinite Descent Beacon Marker */}
      <div className="mt-16 text-center font-mono">
        <div className="inline-flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>keeps going. keep scrolling if you want.</span>
        </div>
      </div>
    </main>
  );
};
