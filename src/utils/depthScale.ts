/**
 * Single-purpose module: Canonical depth / corruption / tier / BPM scale.
 * Single source of truth for all depth math — fixes HUD vs banner mismatch
 * (e.g. 19756m live vs 3555M fictional).
 *
 * - 1px scrolled = 0.4m (from useDepthTracker)
 * - Corruption caps at 100% around 4000m
 * - Tiers: surface <150, decay <600, breakdown <1800, nightmare <3500, abyss >=3500
 */

import type { DepthTier } from '../types/horror';

export const PX_TO_M = 0.4;
export const MAX_DEPTH_M = 4000;

export const TIER_THRESHOLDS = {
  decay: 150,
  breakdown: 600,
  nightmare: 1800,
  abyss: 3500,
} as const;

export function scrollYToMeters(scrollY: number): number {
  return Math.floor(Math.max(0, scrollY) * PX_TO_M);
}

export function getDepthTier(depthMeters: number): DepthTier {
  if (depthMeters >= TIER_THRESHOLDS.abyss) return 'abyss';
  if (depthMeters >= TIER_THRESHOLDS.nightmare) return 'nightmare';
  if (depthMeters >= TIER_THRESHOLDS.breakdown) return 'breakdown';
  if (depthMeters >= TIER_THRESHOLDS.decay) return 'decay';
  return 'surface';
}

/** 0-100 integer, caps at 100 (maxes around 4000m). */
export function getCorruption(depthMeters: number): number {
  return Math.min(100, Math.floor((Math.max(0, depthMeters) / MAX_DEPTH_M) * 100));
}

/** 0-1 fraction for visual scaling. */
export function getCorruptionFraction(depthMeters: number): number {
  return Math.min(1, Math.max(0, depthMeters) / MAX_DEPTH_M);
}

/** Visual-only fraction that may exceed 1 (up to 1.2) for chaos/glitch intensity. */
export function getVisualIntensity(depthMeters: number): number {
  return Math.min(1.2, Math.max(0, depthMeters) / MAX_DEPTH_M);
}

/** Canonical heart-rate curve: 70 surface → 185 abyss. */
export function getBPM(corruptionLevel: number): number {
  const c = Math.min(100, Math.max(0, corruptionLevel));
  return 70 + Math.floor((c / 100) * 115);
}

/** Canonical depth label: "1,975m" — always lowercase m, locale-grouped. */
export function formatDepth(depthMeters: number): string {
  return `${Math.floor(Math.max(0, depthMeters)).toLocaleString('en-US')}m`;
}
