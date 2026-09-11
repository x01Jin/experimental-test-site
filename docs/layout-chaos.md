# Layout Chaos & Structural Breakdown Engine

## Overview

The layout in **Experimental Test Site** falls apart as you go down. Cards drift, widths vary, borders go uneven.

Rather than constraining items to identical rows or columns, the feed operates as an **unconstrained fractured stream** governed by procedural layout chaos profiles (`layoutChaos.ts`). Individual anomaly records drift laterally, vary wildly in width, collide into adjacent cards via negative vertical margins, exhibit asymmetric borders and erratic padding, and suffer jagged polygonal fractures.

---

## The Chaos Progression Across Depth Tiers

The layout instability is mathematically tied to virtual depth (`depthThreshold`) and corruption:

### 1. Surface Strata (`0m – 400m`)
- **Visual Order**: Clean, clinical, uniform card alignment (`center`, `100%` width).
- **Margins & Spacing**: Standard vertical gutters, `0px` lateral offset, `0deg` rotation.
- **Borders & Padding**: Symmetric 1px borders, uniform padding (`1.25rem`).

### 2. Decay Strata (`400m – 1200m`)
- **Initial Slippage**: Modest width variations (`86%` to `100%`) alternating between `flush-left` and `flush-right`.
- **Lateral Drift**: ±16px horizontal drift displacement.
- **Subtle Tilting**: Slight angular offsets (±3.5deg) and minor negative vertical margins (`-12px`) initiating card overlap.
- **Border Inconsistency**: Subtle variation in top/bottom/left/right border widths.

### 3. Breakdown Strata (`1200m – 2500m`)
- **Pronounced Structural Disorder**: High variance in card widths, ranging from compressed narrow shards (`55% – 74%`) to wide overhanging banners (`104% – 110%`).
- **Physical Overlaps & Collisions**: Negative top margins (`-22px` to `-48px`) cause cards to physically collide and pile on top of preceding elements.
- **Dynamic Z-Index Stacking**: Varying z-indices (`10` to `40`) establish erratic visual layering where cards bite into one another.
- **Angular Shear & Skew**: Rotations up to ±7.5deg and horizontal skew up to ±5.2deg.
- **Polygonal Fractures**: Jagged CSS `clip-path` edge tears simulating broken CRT casing and torn dossier sheets.
- **Asymmetric Borders & Padding**: Heavy left or top borders (`border-left: 4px dashed`) paired with missing borders (`border-right: 0px`) and erratic padding.

### 4. Nightmare & Abyss Strata (`2500m+`)
- **Total Spatial Breakdown**: Maximum visual inconsistency where no two consecutive cards share identical dimensions, angles, padding, or borders.
- **Extreme Width Disparity**: Slender fractured shards (`48%`) juxtaposed against massive bleeding slabs (`116%`) that overhang beyond viewport container boundaries.
- **Severe Collisions & Abyssal Voids**: Negative margins reach `-85px`, causing deep structural overlap; alternately, abrupt gaping voids (`+85px` margin, plus desynchronized telemetry banners) interrupt the feed.
- **Non-Euclidean Distortions**: Severe angular tilting (up to ±14.5deg), diagonal skew (±9.5deg skewX, ±5deg skewY), and asymmetric scale distortions.
- **Detached Warning Stamps**: Irregular classified alert badges (`BIO-HAZARD OMEGA`, `CONTAINMENT FAULT`, `CORRUPTED MEMORY`) floating detached outside the perimeter of the cards.
- **Ghost Duplicate Silhouettes**: Chromatic red/cyan wireframe frames drifting behind cards with lateral coordinate offsets.
- **Vertical Header Spines**: Select anomalous cards flip their identification headers into vertical side spines along the left flank, breaking standard top-to-bottom layout monotony.

---

## Technical Architecture

### `LayoutChaosProfile` Interface (`src/utils/layoutChaos.ts`)

Each item in the feed receives a deterministic, seed-based chaos profile containing:

```typescript
export interface LayoutChaosProfile {
  alignment: LayoutAlignment;
  widthPercent: number;        // 45% to 118% (inconsistent card widths)
  marginLeftOffsetPx: number;  // Lateral drift displacement
  marginTopOffsetPx: number;   // Negative for collision/overlap, positive for ominous void gaps
  rotationDeg: number;         // Angular tilting
  skewXDeg: number;            // Structural diagonal shear
  skewYDeg: number;            // Perspective warping
  scaleX: number;              // Asymmetric horizontal stretch
  scaleY: number;              // Asymmetric vertical squeeze
  zIndex: number;              // Dynamic stacking layer for visual collision
  clipPolygon?: string;        // Jagged torn polygon edge
  borderAsymmetry: BorderAsymmetry;
  paddingTopRem: number;       // Erratic padding
  paddingBottomRem: number;
  paddingLeftRem: number;
  paddingRightRem: number;
  hasVerticalHeader: boolean;  // Header positioned vertically on the left edge
  detachedStamp?: DetachedStampConfig;
  ghostDuplicate?: GhostDuplicateConfig;
}
```

### Dynamic Stream Expansion (`InfiniteHorrorStream.tsx`)

The main stream container dynamically widens as depth increases:
- **Surface**: `max-w-3xl`
- **Decay**: `max-w-4xl`
- **Breakdown**: `max-w-5xl`
- **Abyss**: `max-w-7xl`

This widening provides the physical canvas area required for slender 50% cards to float asymmetrically on the left or right flank while massive 115% cards overhang into the peripheral margins.

---

## Structural Collapse Ribbons (`StructuralCollapseRibbon.tsx`)

At regular intervals across the deep stream, unruly full-bleed containment ribbons slash diagonally across the stream container (`w-[116%] -ml-[8%] rotate-[-4.5deg] to [+4.5deg]`).

Three procedural variants are generated:
1. **Hazard Tape**: Deep red backdrop with high-contrast warning text (`DO NOT CROSS // STRUCTURAL MEMORY COLLAPSE`).
2. **Memory Rupture**: Dark obsidian band with glowing crimson coordinate faults (`SEGMENTATION FAULT AT COORD 0x00DEAD`).
3. **Biohazard Purge**: Flashing critical purge directive (`CRITICAL PURGE IN PROGRESS // COGNITIVE CONTAINMENT FAULT`).

All ribbon text is processed through depth-sensitive Zalgo corruption algorithms.

---

## Jagged Polygonal Clip-Paths

Simulates physical damage and mechanical trauma across card edges using procedural CSS `polygon()` clipping:
- **Top-Right Corner Bite**: Rips out the upper right corner with sharp faceted notches.
- **Fractured Diagonal Wedge**: Shears the upper right corner while cutting inward on the bottom left.
- **Bottom Torn Edge**: Simulates torn archival paper along the lower perimeter.
- **Multi-Facet Deep Shatter**: 15-vertex irregular polygon fracturing all four corners of the container.
