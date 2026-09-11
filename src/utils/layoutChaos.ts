/**
 * Single-purpose module: Procedural Layout Chaos & Structural Breakdown Engine.
 * Generates chaotic, inconsistent layout profiles, non-Euclidean transforms,
 * jagged polygonal clip-paths, variable card widths, negative-margin collisions,
 * asymmetric borders, and erratic padding as depth and corruption escalate.
 */

import { DepthTier } from '../types/horror';

export type LayoutAlignment =
  | 'center'
  | 'flush-left'
  | 'flush-right'
  | 'drift-left'
  | 'drift-right'
  | 'overhang-left'
  | 'overhang-right'
  | 'full-bleed'
  | 'compressed-narrow';

export interface BorderAsymmetry {
  topWidth: number;
  rightWidth: number;
  bottomWidth: number;
  leftWidth: number;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double';
  borderColorClass: string;
}

export interface DetachedStampConfig {
  label: string;
  top: string;
  left?: string;
  right?: string;
  rotationDeg: number;
}

export interface GhostDuplicateConfig {
  offsetX: number;
  offsetY: number;
  color: string;
  opacity: number;
}

export interface LayoutChaosProfile {
  alignment: LayoutAlignment;
  widthPercent: number;        // 45% to 118% (inconsistent widths)
  marginLeftOffsetPx: number;  // Lateral drift displacement
  marginTopOffsetPx: number;   // Negative for collision/overlap, positive for ominous void gaps
  rotationDeg: number;         // Severe tilting
  skewXDeg: number;            // Structural diagonal shear
  skewYDeg: number;            // Perspective warping
  scaleX: number;              // Asymmetric horizontal stretch
  scaleY: number;              // Asymmetric vertical squeeze
  zIndex: number;              // Dynamic stacking layer for visual collision
  clipPolygon?: string;        // Jagged torn polygon edge
  borderAsymmetry: BorderAsymmetry;
  paddingTopRem: number;       // Inconsistent padding
  paddingBottomRem: number;
  paddingLeftRem: number;
  paddingRightRem: number;
  hasVerticalHeader: boolean;  // Header positioned vertically on the left edge
  detachedStamp?: DetachedStampConfig;
  ghostDuplicate?: GhostDuplicateConfig;
}

/**
 * Pre-calculated jagged and torn polygonal clipping paths simulating
 * shattered CRT monitors, torn paper archives, and cracked casing.
 */
const TORN_POLYGONS = [
  // Top-right corner bite
  'polygon(0% 0%, 88% 0%, 93% 5%, 87% 8%, 100% 14%, 100% 93%, 94% 100%, 0% 100%)',
  // Fractured diagonal wedge
  'polygon(4% 0%, 100% 0%, 96% 92%, 100% 100%, 0% 100%, 0% 9%)',
  // Bottom torn edge
  'polygon(0% 0%, 100% 0%, 100% 89%, 94% 93%, 89% 88%, 83% 96%, 76% 89%, 0% 95%)',
  // Jagged bite on left edge
  'polygon(0% 6%, 95% 0%, 100% 5%, 98% 92%, 89% 100%, 8% 97%, 0% 91%, 4% 52%, 0% 48%)',
  // Multi-facet deep shatter
  'polygon(2% 2%, 26% 0%, 54% 3%, 86% 0%, 100% 7%, 97% 44%, 93% 48%, 98% 53%, 96% 91%, 82% 100%, 54% 97%, 18% 100%, 0% 92%, 3% 49%, 0% 45%)'
];

/**
 * Deterministic pseudo-random seed helper
 */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999 + 1) * 10000;
  return x - Math.floor(x);
}

/**
 * Calculates a unique, highly inconsistent and chaotic layout profile for an anomaly card.
 */
export function generateLayoutChaos(
  depthThreshold: number,
  itemIndex: number,
  batchIndex: number
): LayoutChaosProfile {
  const seed = depthThreshold * 13 + itemIndex * 37 + batchIndex * 101;
  const corruptionFrac = Math.min(1.2, depthThreshold / 4000);

  // Surface Tier (0 - 400m): Orderly, clinical, uniform structure
  if (corruptionFrac < 0.1) {
    return {
      alignment: 'center',
      widthPercent: 100,
      marginLeftOffsetPx: 0,
      marginTopOffsetPx: 0,
      rotationDeg: 0,
      skewXDeg: 0,
      skewYDeg: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: 10,
      borderAsymmetry: {
        topWidth: 1,
        rightWidth: 1,
        bottomWidth: 1,
        leftWidth: 1,
        borderStyle: 'solid',
        borderColorClass: 'border-neutral-800/80'
      },
      paddingTopRem: 1.25,
      paddingBottomRem: 1.25,
      paddingLeftRem: 1.25,
      paddingRightRem: 1.25,
      hasVerticalHeader: false
    };
  }

  // Decay Tier (400m - 1200m): Initial slippage, variable widths and slight tilt
  if (corruptionFrac < 0.3) {
    const widthVariants = [94, 98, 88, 92, 100, 86];
    const widthPercent = widthVariants[itemIndex % widthVariants.length];
    const rot = (pseudoRandom(seed + 1) * 2 - 1) * 3.5;
    const marginLeft = (pseudoRandom(seed + 2) * 2 - 1) * 16;
    const marginTop = (itemIndex % 3 === 0) ? -12 : 0;

    return {
      alignment: itemIndex % 2 === 0 ? 'flush-left' : 'flush-right',
      widthPercent,
      marginLeftOffsetPx: marginLeft,
      marginTopOffsetPx: marginTop,
      rotationDeg: rot,
      skewXDeg: (pseudoRandom(seed + 3) * 2 - 1) * 1.5,
      skewYDeg: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: 10 + (itemIndex % 5),
      borderAsymmetry: {
        topWidth: 1,
        rightWidth: 1,
        bottomWidth: 1 + (itemIndex % 2),
        leftWidth: 1 + (itemIndex % 3),
        borderStyle: 'solid',
        borderColorClass: 'border-neutral-700/80'
      },
      paddingTopRem: 1.2,
      paddingBottomRem: 1.2,
      paddingLeftRem: 1.3,
      paddingRightRem: 1.1,
      hasVerticalHeader: false
    };
  }

  // Breakdown Tier (1200m - 2500m): Pronounced disorder, collisions, overlapping layers
  if (corruptionFrac < 0.65) {
    const alignments: LayoutAlignment[] = [
      'flush-left',
      'flush-right',
      'overhang-left',
      'compressed-narrow',
      'drift-right',
      'full-bleed'
    ];
    const alignment = alignments[itemIndex % alignments.length];

    // High width variance: from thin compressed cards (55%) to overhanging cards (106%)
    let widthPercent = 90;
    if (alignment === 'compressed-narrow') widthPercent = 60 + Math.floor(pseudoRandom(seed + 4) * 14);
    else if (alignment === 'overhang-left' || alignment === 'full-bleed') widthPercent = 104 + Math.floor(pseudoRandom(seed + 4) * 6);
    else if (alignment === 'flush-left' || alignment === 'drift-left') widthPercent = 78 + Math.floor(pseudoRandom(seed + 4) * 12);
    else widthPercent = 82 + Math.floor(pseudoRandom(seed + 4) * 15);

    // Negative vertical margins causing real overlapping collisions
    const overlapVariants = [-36, -22, 0, -48, 18, -28];
    const marginTop = overlapVariants[itemIndex % overlapVariants.length];

    // Lateral drift
    const driftVariants = [-28, 34, -18, 42, 0, -36];
    const marginLeft = driftVariants[itemIndex % driftVariants.length];

    // Rotations and skews
    const rot = (pseudoRandom(seed + 5) * 2 - 1) * 7.5;
    const skewX = (pseudoRandom(seed + 6) * 2 - 1) * 5.2;

    // Polygon clipping on select cards
    const clipPolygon = (itemIndex % 3 === 0) ? TORN_POLYGONS[itemIndex % TORN_POLYGONS.length] : undefined;

    return {
      alignment,
      widthPercent,
      marginLeftOffsetPx: marginLeft,
      marginTopOffsetPx: marginTop,
      rotationDeg: rot,
      skewXDeg: skewX,
      skewYDeg: (pseudoRandom(seed + 7) * 2 - 1) * 2.5,
      scaleX: 0.97 + pseudoRandom(seed + 8) * 0.08,
      scaleY: 0.96 + pseudoRandom(seed + 9) * 0.08,
      zIndex: 10 + (itemIndex % 15) * 2,
      clipPolygon,
      borderAsymmetry: {
        topWidth: (itemIndex % 4 === 0) ? 3 : 1,
        rightWidth: (itemIndex % 3 === 0) ? 0 : 1,
        bottomWidth: 2,
        leftWidth: (itemIndex % 2 === 0) ? 4 : 1,
        borderStyle: (itemIndex % 3 === 0) ? 'dashed' : 'solid',
        borderColorClass: 'border-red-900/80'
      },
      paddingTopRem: 1.0 + pseudoRandom(seed + 10) * 0.8,
      paddingBottomRem: 0.8 + pseudoRandom(seed + 11) * 0.7,
      paddingLeftRem: 1.1 + pseudoRandom(seed + 12) * 1.0,
      paddingRightRem: 0.8 + pseudoRandom(seed + 13) * 0.8,
      hasVerticalHeader: (itemIndex % 5 === 0)
    };
  }

  // Nightmare & Abyss Tiers (2500m+): Extreme chaos, severe collisions, erratic shapes
  const alignments: LayoutAlignment[] = [
    'overhang-left',
    'overhang-right',
    'compressed-narrow',
    'full-bleed',
    'drift-left',
    'drift-right',
    'flush-left',
    'flush-right'
  ];
  const alignment = alignments[(itemIndex * 3 + batchIndex) % alignments.length];

  // Wildly erratic width: from slender shards (46%) to massive bleeding slabs (116%)
  let widthPercent = 85;
  if (alignment === 'compressed-narrow') {
    widthPercent = 48 + Math.floor(pseudoRandom(seed + 14) * 16);
  } else if (alignment === 'overhang-left' || alignment === 'overhang-right' || alignment === 'full-bleed') {
    widthPercent = 108 + Math.floor(pseudoRandom(seed + 14) * 10);
  } else if (alignment === 'drift-left') {
    widthPercent = 72 + Math.floor(pseudoRandom(seed + 14) * 18);
  } else {
    widthPercent = 68 + Math.floor(pseudoRandom(seed + 14) * 24);
  }

  // Severe overlapping and colliding vertical margins (-75px) or terrifying voids (+85px)
  const marginVariants = [-65, -42, 85, -78, -32, 60, -55, -85];
  const marginTop = marginVariants[(itemIndex + batchIndex) % marginVariants.length];

  // Radical lateral offsets
  const lateralVariants = [-48, 64, -60, 52, -38, 70, -75, 45];
  const marginLeft = lateralVariants[(itemIndex * 2) % lateralVariants.length];

  // Intense angular rotations & diagonal skews
  const rot = (pseudoRandom(seed + 15) * 2 - 1) * 14.5;
  const skewX = (pseudoRandom(seed + 16) * 2 - 1) * 9.5;
  const skewY = (pseudoRandom(seed + 17) * 2 - 1) * 5.0;

  // Polygonal edge fractures on most elements
  const clipPolygon = (itemIndex % 2 === 0) ? TORN_POLYGONS[itemIndex % TORN_POLYGONS.length] : undefined;

  // Detached stamp hanging off the card boundary
  const hasDetachedStamp = (itemIndex % 3 === 0);
  const detachedStamp: DetachedStampConfig | undefined = hasDetachedStamp
    ? {
        label: ['CORRUPTED MEMORY', 'CONTAINMENT FAULT', 'BIO-HAZARD OMEGA', 'FATAL EXCEPTION'][itemIndex % 4],
        top: '-18px',
        left: (itemIndex % 2 === 0) ? '-12px' : undefined,
        right: (itemIndex % 2 !== 0) ? '-14px' : undefined,
        rotationDeg: (pseudoRandom(seed + 18) * 2 - 1) * 18
      }
    : undefined;

  // Ghost duplicate silhouette that wanders behind the card
  const hasGhostDuplicate = (itemIndex % 4 === 0);
  const ghostDuplicate: GhostDuplicateConfig | undefined = hasGhostDuplicate
    ? {
        offsetX: (pseudoRandom(seed + 19) * 2 - 1) * 18,
        offsetY: (pseudoRandom(seed + 20) * 2 - 1) * 16,
        color: (itemIndex % 2 === 0) ? 'rgba(220, 38, 38, 0.4)' : 'rgba(6, 182, 212, 0.35)',
        opacity: 0.6
      }
    : undefined;

  return {
    alignment,
    widthPercent,
    marginLeftOffsetPx: marginLeft,
    marginTopOffsetPx: marginTop,
    rotationDeg: rot,
    skewXDeg: skewX,
    skewYDeg: skewY,
    scaleX: 0.94 + pseudoRandom(seed + 21) * 0.16,
    scaleY: 0.93 + pseudoRandom(seed + 22) * 0.16,
    zIndex: 10 + (itemIndex % 20) * 2,
    clipPolygon,
    borderAsymmetry: {
      topWidth: [1, 4, 0, 2][itemIndex % 4],
      rightWidth: [0, 1, 3, 1][itemIndex % 4],
      bottomWidth: [3, 2, 4, 1][itemIndex % 4],
      leftWidth: [5, 2, 6, 3][itemIndex % 4],
      borderStyle: ['dashed', 'solid', 'dotted', 'double'][itemIndex % 4] as any,
      borderColorClass: 'border-red-700'
    },
    paddingTopRem: 0.8 + pseudoRandom(seed + 23) * 1.5,
    paddingBottomRem: 0.6 + pseudoRandom(seed + 24) * 1.2,
    paddingLeftRem: 1.0 + pseudoRandom(seed + 25) * 1.6,
    paddingRightRem: 0.6 + pseudoRandom(seed + 26) * 1.2,
    hasVerticalHeader: (itemIndex % 4 === 1),
    detachedStamp,
    ghostDuplicate
  };
}
