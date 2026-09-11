# Procedural Horror Content & Generation Mechanics

## Overview

**Experimental Test Site** mixes depth-tiered generation, found photos, crew notes, numbers, gibberish, and link cards (Archive.org / Gutenberg / Commons).

---

## Content Archetypes & Interactive Widgets

The system categorizes horror anomalies into specialized functional archetypes, each with custom UI components and audio integration:

| Archetype | Description | Interactive Component | Audio Linkage |
| :--- | :--- | :--- | :--- |
| `black-box-audio` | Cockpit and submersible voice transcripts | `InteractiveAudioLog` | Real-time animated oscilloscope canvas & tape start buzz |
| `redacted-dossier` | Classified directives with blacked-out segments | `RedactedText` | Hover/Click disclosure triggering static squeals and whispers |
| `radio-scanner` | Low-frequency RF receiver with frequency dial | `CursedRadioScanner` | Frequency slider with heterodyne sweeps & phantom signals |
| `heartbeat-sensor` | Real-time biometric autonomic stress monitor | `HeartbeatMonitor` | Continuous scanning EKG canvas & lub-dub pulse trigger |
| `cctv-matrix` | Multi-camera facility surveillance switcher | `CctvMatrixViewer` | Live channel buttons, CRT scanlines, and camera static snaps |
| `autopsy-record` | Forensic pathology records of impossible anatomy | Document layout | Anatomical finding tags and status indicators |
| `cosmic-aberration` | Non-Euclidean spatial breakdowns & eldritch math | Spatial document layout | Negative space curvature and metric formulas |
| `eye-specimen` | Biological ocular specimen tracking screen position | `HorrorCanvas` / canvas | Interactive eye pupil focusing on cursor |
| `cursed-button` | Hazardous facility override switch | Cursed button | High-intensity audio shock and localized spasm |
| `creepy-survey` | Sensory and psychological calibration questionnaire | Dual choice options | Psychological compliance tracking & audio shock |

---

## Combinatorial Procedural Generation (`proceduralNarrative.ts`)

Items in the stream are generated using combinatorial permutations of distinct architectural ingredients:
- **Facility Sectors**: Sub-Aquifer, Vault Omega, Cryo-Storage, Abyssal Shafts, Radiotelemetry Bunkers.
- **Clearance Levels**: Restricted Eyes Only, Cognitohazard Grade 4, Terminal Containment Breach, Anathema Level 5.
- **Forensic Anomalies**: Anatomical mutations (bone ash lungs, molar-filled stomachs, pulsating optic chiasms).
- **Audio Intercepts**: Radio carrier signals, deep diver distress transcripts, hydrophone captures.
- **Classified Redactions**: Protocol 99 purge directives, subterranean hollow surveys, bio-purges.
- **Non-Euclidean Formulations**: Negative thermal conductivities, Boötes void signals, micro-singularities.

---

## Depth Tiers

The generation engine scales both content and degradation across five distinct depth tiers:

1. **Surface Tier (0m - 500m)**:
   - Administrative memos, HVAC sensor glitches, perimeter CCTV motion alerts, and initial psychological surveys.
2. **Decay Tier (500m - 1200m)**:
   - Missing personnel dossiers, autopsy records with early calcifications, hydrophone soundings, and biometric pulse monitors.
3. **Breakdown Tier (1200m - 2400m)**:
   - Hardware kernel dumps, radio scanners tuning to unassigned bands, black-box audio logs, and classified redactions.
4. **Nightmare Tier (2400m - 4000m)**:
   - Non-Euclidean cosmic aberrations, living retinal specimens, cursed override levers, and memory leaks.
5. **Abyss Tier (4000m+)**:
   - Total systemic collapse, text dissolving into dense Zalgo glyphs, severe spatial displacement, and raw static.

---

## Specimen Repository (`internetImages.ts`)

The application integrates 32+ curated public web image specimens from verified high-reliability CDNs. Specimens are cataloged with contextual metadata:
- **Categories**: `portrait`, `surveillance`, `medical`, `architecture`, `specimen`, `liminal`, `cosmic`, `analog-glitch`.
- **Smart Correlation**: When an item is generated, `getSpecimenForNarrativeType` matches the specimen category to the narrative context (e.g., surveillance items receive CCTV imagery, autopsy logs receive medical radiography).
- **Filter Modes**: Automated CSS and canvas filters applying infrared, thermal, X-ray, or monochrome grain treatments.
