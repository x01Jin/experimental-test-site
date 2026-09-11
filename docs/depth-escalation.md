# Infinite Depth & Escalation System

## Depth Metrics

The application calculates virtual depth based on document scroll offset:
- **Depth (meters)** = `Math.floor(scrollY * 0.4)`
- **Corruption Index (%)** = `Math.min(100, Math.floor((depthMeters / 4000) * 100))`

---

## Depth Tiers

| Tier Name | Depth Range | Visual Characteristics | Audio Characteristics |
| :--- | :--- | :--- | :--- |
| **Surface** | `0m – 300m` | Clean terminal layout, subtle border glows, single-column stream, slight pixel softening on photographs. | Soft 38 Hz sub-drone, quiet tape hiss, glitches every 12s. |
| **Decay** | `300m – 1000m` | Pixelation blocks on photos, mild lateral glitch slices, faint Zalgo text marks, initial image shard detachments. | Drone filter opens to 250 Hz, tape hiss gains volume, sporadic computer clicks. |
| **Breakdown** | `1000m – 2500m` | Overlapping 2-column grid, aggressive chromatic text shadow, fragmented images with floating shards, moiré pattern breaks. | Random static bursts, bitcrush dropouts, glitches every 4-6s. |
| **Nightmare** | `2500m – 4500m` | Localized element tremors, severe Zalgo corruption, demonic eye overlays on photos, RAM corruption dumps. | Hardware coil whine, DMA buffer freezes, aggressive BSOD glitch sweeps. |
| **Abyss** | `4500m+` | Relentless localized spasms on elements, popups, and creepy artifacts; chromatic aberration splits; tearing hazard slashes. | Glitches every 1-2s, piercing static bursts, visceral hardware crash screeches. |

---

## Escalation Triggers & Jumpscare Pacing

To ensure jumpscares catch the user offguard, the system enforces intentional scarcity and sudden execution:

### 1. Infrequent Milestone Ambush
Rare, unpredictably spaced depth checkpoints (e.g., 520m, 1950m, 4300m, 7600m) trigger quick, non-blocking abstract shocks (220ms–320ms for tears and loud bursts; 2400ms auto-dismiss for shuddering error popups) accompanied by instantaneous element shocks and BSOD crash audio.

### 2. Global Jumpscare Cooldown
A strict 45-second minimum cooldown is enforced across all jumpscare triggers. This prevents sensory desensitization and allows psychological tension to rebuild in the quiet intervals between shocks.

### 3. Spontaneous Ambush Timer
Beyond 450 meters, a randomized ambush timer schedules surprise shocks at long, irregular intervals (50 to 95 seconds), catching the user offguard while reading corrupted incident logs or examining specimens.

### 4. Rapid Scroll Punishment
If scroll velocity exceeds frantic thresholds (`> 1.8 px/ms`) below 400 meters, the system applies a low-probability (2%) abstract signal tear or crash static burst penalty, disincentivizing speed-running past the corrupted specimens without blocking document navigation.

### 5. Endless Feed Replenishment
When the scroll position reaches within 1400 pixels of the document bottom, the stream procedurally instantiates and appends 8 additional corrupted items with escalating displacement and rotation attributes.
