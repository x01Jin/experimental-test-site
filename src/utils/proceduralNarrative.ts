/**
 * Single-purpose module: Combinatorial procedural horror content generator.
 * Produces endless non-repetitive horror anomalies by combining diverse architectural ingredients:
 * - Depth-tiered narrative classification (surface, decay, breakdown, nightmare, abyss)
 * - Autopsy and bio-pathology forensics
 * - Black box audio intercepts with multi-speaker dialog and static timestamps
 * - Redacted classified directives with interactive reveals
 * - Cosmic non-Euclidean anomalies and eldritch mathematics
 * - Creepy psychological and sensory calibration questionnaires
 * - Multi-channel CCTV surveillance intercepts
 */

import { HorrorItem, HorrorItemType, DepthTier } from '../types/horror';
import { getSpecimenForNarrativeType } from './internetImages';
import { generateLayoutChaos } from './layoutChaos';
import { getDepthTier as canonicalTier, getVisualIntensity, getBPM, formatDepth } from './depthScale';

const SECTOR_NAMES = [
  'SECTOR 04-G // SUB-AQUIFER',
  'SUB-BASEMENT VAULT OMEGA',
  'CRYO-STORAGE WARD 9',
  'ABYSSAL SHAFT #14',
  'RADIO TELEMETRY BUNKER',
  'QUARANTINE DOME DELTA',
  'SPECIMEN CORRIDOR 7',
  'GEODETIC DRILL HOLE 0x99',
  'PATHOLOGY WARD BETA',
  'FOUNDATION CORE // STRATA 8'
];

const CLEARANCE_LEVELS = [
  'RESTRICTED // EYES ONLY',
  'COGNITOHAZARD GRADE 4',
  'TERMINAL CONTAINMENT BREACH',
  'BIO-HAZARD CLASS OMEGA',
  'ANATHEMA DISCLOSURE LEVEL 5',
  'MANDATORY PSYCH-HOLD',
  'FATAL TELEMETRY ALERT'
];

const AUTOPSY_SUBJECTS = [
  'DR. JONAS VANE (BIO-LEAD)',
  'UNKNOWN CADAVER #009-X',
  'SECURITY OFFICER B. REED',
  'INFIRMARY PATIENT 441',
  'RECON DIVER M. CHEN',
  'FACILITY JANITOR T. CROSS',
  'ARCHIVIST ELENA ROSTOVA'
];

const ANATOMICAL_ANOMALIES = [
  'Lungs contained 340 grams of dry bone ash that reassembled into human finger joints when exposed to air.',
  'Stomach cavity filled with 48 adult molar teeth and six feet of magnetic cassette tape looping a scream.',
  'Optic chiasm has been replaced by twitching black filament threads that pulsate at precisely 38 Hz.',
  'Heart tissue was entirely calcified into a mirror-like black obsidian sphere that reflects a different room.',
  'Spinal cord branched into 16 distinct neural tendrils that had burrowed through the wooden examination table.',
  'Vocal cords were still vibrating and warm three weeks post-mortem, humming an unassigned radio carrier frequency.',
  'Brain cortex showed zero electrical decay; cellular respiration continues while emitting faint green phosphorescence.'
];

const COSMIC_FORMULAS = [
  'lim(x→∞) [ψ(flesh) ⊗ ∇²(void)] = 0x0000DEAD. Space within this chamber measures 4.8 meters on the outside, but 18,400 meters on the inside.',
  'Angular momentum vector J = ∮ (r × p) dV collapses into negative mass. Looking directly at the ceiling causes retinal burns of constellations that do not exist.',
  'The radio telescope intercepted a repeating 14-bit signal from the Boötes Void. Translated binary equates to the cellular structure of human marrow.',
  'Gravitational lensing detected around the patient\'s ribcage. Light rays curve backward into the sternum as if toward a microscopic singularity.',
  'Thermal conductivity k is negative: the entity grows colder as heat is applied, until ambient room air freezes into solid oxygen crystals.'
];

const BLACK_BOX_TRANSCRIPTS = [
  {
    title: 'BLACK BOX // TRANSIT CAGE 04',
    speaker: 'TECH CARTER',
    text: '"Control, the cable counter passed 3,000 meters. The winch stopped, but the cage is still dropping. The walls outside are made of soft skin. We just brushed against an eyelid."',
    freq: '142.85 MHz'
  },
  {
    title: 'VOICE RECOVERY // AIRLOCK 2',
    speaker: 'DR. S. MORROW',
    text: '"Tell my family not to look under the floorboards in the dining room. It followed me home three years ago and it\'s been waiting under the rug for me to stop breathing."',
    freq: '28.40 MHz'
  },
  {
    title: 'AUDIO TAPE INTERCEPT // LAB 09',
    speaker: 'RESEARCHER VOICEMAIL',
    text: '"Don\'t let them turn off the lights. When the lights go off, the ceiling comes down until it rests on your hair. It smells like copper and wet wool. It is whispering my childhood nickname."',
    freq: 'VLF 4.2 kHz'
  },
  {
    title: 'RADIO TELEMETRY // SUB-SHAFT',
    speaker: 'OUTPOST 3 AUTOMATED BEACON',
    text: '"ALL PERSONNEL ARE DECEASED. ALL PERSONNEL ARE SITTING AT THEIR DESKS. ALL PERSONNEL ARE SMILING AT THE DOORWAY. DO NOT SEND RESCUE. DO NOT LOOK AT US."',
    freq: 'AM 530 kHz'
  }
];

const REDACTED_DOSSIERS = [
  {
    title: 'CLASSIFIED DIRECTIVE // PROTOCOL 99',
    fullText: 'In the event that the entity in Sector 4 breaches primary seals, personnel are ordered to [REDACTED: CONSUME CYANIDE CAPSULES] immediately. Under no circumstances allow the entity to [REDACTED: RECORD YOUR VOCAL CADENCE], as it will use your voice to call your surviving children.',
    redactedSegments: ['CONSUME CYANIDE CAPSULES', 'RECORD YOUR VOCAL CADENCE']
  },
  {
    title: 'INCIDENT 08-ALPHA // DISCLOSURE STATEMENT',
    fullText: 'During the 1984 subterranean excavation, drill bit 4 struck a hollow subterranean cavity. Analysis of the sludge on the drill revealed [REDACTED: HUMAN CEREBROSPINAL FLUID] pressurized at 400 atmospheres. The cavity is [REDACTED: CURRENTLY EXPANDING TOWARDS THE SURFACE].',
    redactedSegments: ['HUMAN CEREBROSPINAL FLUID', 'CURRENTLY EXPANDING TOWARDS THE SURFACE']
  },
  {
    title: 'PERSONNEL PURGE ORDER // MEMORANDUM 12',
    fullText: 'All documentation regarding Dr. Thorne must be destroyed. His biological markers indicate he [REDACTED: CEASED BEING HUMAN IN 1971]. If you see him walking the hallway, [REDACTED: DO NOT BLINK AND DO NOT TURN YOUR BACK].',
    redactedSegments: ['CEASED BEING HUMAN IN 1971', 'DO NOT BLINK AND DO NOT TURN YOUR BACK']
  }
];

const PSYCH_SURVEYS = [
  {
    title: 'MANDATORY BIO-SENSORY READINESS QUESTIONNAIRE',
    question: 'How many people are currently breathing in the room where you are viewing this screen?',
    optionA: 'Only myself',
    optionB: 'There is a second breathing pattern behind my chair'
  },
  {
    title: 'OPTICAL CALIBRATION DRILL',
    question: 'Look at your hands resting on your keyboard or phone. Are the fingernails still growing in the correct direction?',
    optionA: 'Yes, they are normal',
    optionB: 'They have turned black and began curling inward'
  },
  {
    title: 'PSYCHO-ACOUSTIC EVALUATION #44',
    question: 'Listen to the room around you right now. Can you hear the faint metallic tapping inside the wall?',
    optionA: 'It is just ambient house noise',
    optionB: 'It is matching the rhythm of my heartbeat'
  },
  {
    title: 'NEUROLOGICAL COMPLIANCE SCREENING',
    question: 'If you close your eyes for four seconds, will you be able to open them again?',
    optionA: 'Yes, of course',
    optionB: 'Something is waiting for me to close them'
  }
];

/**
 * Computes depth tier from raw depth in meters (canonical — see depthScale.ts)
 */
export function getDepthTier(depthMeters: number): DepthTier {
  return canonicalTier(depthMeters);
}

/**
 * Generates a procedurally synthesized HorrorItem with high combinatorial variety.
 */
export function generateProceduralHorrorItem(
  depthMeters: number,
  index: number,
  uniqueSeed: number
): HorrorItem {
  const tier = getDepthTier(depthMeters);
  const corruptionFraction = getVisualIntensity(depthMeters);

  // Diverse rotation of archetypes based on depth tier
  const archetypePool: HorrorItemType[] = [];

  if (tier === 'surface') {
    archetypePool.push('incident-report', 'surveillance-capture', 'archival-photo', 'creepy-survey', 'redacted-dossier', 'cctv-matrix');
  } else if (tier === 'decay') {
    archetypePool.push('incident-report', 'distress-log', 'autopsy-record', 'black-box-audio', 'redacted-dossier', 'hollow-portrait', 'eye-specimen', 'heartbeat-sensor');
  } else if (tier === 'breakdown') {
    archetypePool.push('corrupted-terminal', 'autopsy-record', 'black-box-audio', 'radio-scanner', 'cursed-button', 'flesh-fragment', 'redacted-dossier', 'heartbeat-sensor');
  } else if (tier === 'nightmare') {
    archetypePool.push('cosmic-aberration', 'black-box-audio', 'creepy-survey', 'radio-scanner', 'eye-specimen', 'cursed-button', 'flesh-fragment', 'memory-leak');
  } else {
    // Abyss
    archetypePool.push('cosmic-aberration', 'corrupted-terminal', 'flesh-fragment', 'radio-scanner', 'cursed-button', 'eye-specimen', 'black-box-audio');
  }

  const selectedType = archetypePool[(index + uniqueSeed) % archetypePool.length];
  const sector = SECTOR_NAMES[(index + uniqueSeed) % SECTOR_NAMES.length];
  const clearance = CLEARANCE_LEVELS[(index * 3 + uniqueSeed) % CLEARANCE_LEVELS.length];

  let title = '';
  let content = '';
  let extraMeta: Record<string, string | number | boolean> = {
    sector,
    clearance,
    depthOffset: formatDepth(depthMeters)
  };

  switch (selectedType) {
    case 'autopsy-record': {
      const subject = AUTOPSY_SUBJECTS[(index + uniqueSeed) % AUTOPSY_SUBJECTS.length];
      const anomaly = ANATOMICAL_ANOMALIES[(index + uniqueSeed) % ANATOMICAL_ANOMALIES.length];
      title = `AUTOPSY PROTOCOL // ${subject}`;
      content = `PATHOLOGY RECORDING: Examination commenced at 03:15 AM under sealed negative pressure.\n\nFINDINGS: ${anomaly}\n\nCORONER CONCLUSION: Subject was declared biologically deceased 14 days ago, yet core temperature remains exactly 37.0°C and chest wall exhibits continuous shallow breathing.`;
      extraMeta.autopsyID = `MORT-${depthMeters}-${index}`;
      extraMeta.status = 'ACTIVE_CALCIFICATION';
      break;
    }

    case 'black-box-audio': {
      const log = BLACK_BOX_TRANSCRIPTS[(index + uniqueSeed) % BLACK_BOX_TRANSCRIPTS.length];
      title = log.title;
      content = `[CARRIER SIGNAL DETECTED ON ${log.freq}]\n\nSPEAKER IDENTIFICATION: ${log.speaker}\n\nTRANSCRIPT RECORD: ${log.text}\n\n[SIGNAL FADES INTO LOW-FREQUENCY VISCERAL HUMMING]`;
      extraMeta.audioFreq = log.freq;
      extraMeta.speaker = log.speaker;
      extraMeta.hasInteractiveWaveform = true;
      break;
    }

    case 'redacted-dossier': {
      const dossier = REDACTED_DOSSIERS[(index + uniqueSeed) % REDACTED_DOSSIERS.length];
      title = dossier.title;
      content = dossier.fullText;
      extraMeta.isRedacted = true;
      extraMeta.redactionsCount = dossier.redactedSegments.length;
      extraMeta.disclosureRisk = 'EXTREME';
      break;
    }

    case 'cosmic-aberration': {
      const formula = COSMIC_FORMULAS[(index + uniqueSeed) % COSMIC_FORMULAS.length];
      title = `NON-EUCLIDEAN ANOMALY // STRATA ${Math.floor(depthMeters / 100)}`;
      content = `TELESCOPIC TELEMETRY RECORD: Quantum geometry sensors have recorded spatial collapse.\n\nOBSERVATION: ${formula}\n\nWARNING: Do not calculate the roots of this polynomial. Four mathematicians who solved for x suffered bilateral cerebral hemorrhages.`;
      extraMeta.spacetimeCurvature = 'NEGATIVE_INFINITY';
      extraMeta.dimensionLoss = '4D -> 2D';
      break;
    }

    case 'creepy-survey': {
      const survey = PSYCH_SURVEYS[(index + uniqueSeed) % PSYCH_SURVEYS.length];
      title = survey.title;
      content = survey.question;
      extraMeta.optionA = survey.optionA;
      extraMeta.optionB = survey.optionB;
      break;
    }

    case 'radio-scanner': {
      title = `EM TELEMETRY RECEIVER // FREQ 0.${Math.floor(depthMeters * 1.7)} MHz`;
      content = `AUTOMATED RF SCANNER: Tuned to unassigned low-frequency spectrum. Dialing across the band picks up faint static bursts, phantom numbers stations, and whispering vocal formants echoing from the deep strata.`;
      extraMeta.defaultFreq = `${(100 + (depthMeters % 800) * 0.5).toFixed(1)} kHz`;
      extraMeta.isRadioScanner = true;
      break;
    }

    case 'heartbeat-sensor': {
      title = `BIOMETRIC TELEMETRY MONITOR // SUBJECT #0`;
      content = `REAL-TIME CARDIAC PULSE SENSOR: Continuous monitoring of user autonomic response. As depth increases, cardiac irregularity indices rise exponentially. Keep your fingers steady on the sensor.`;
      extraMeta.isHeartbeatSensor = true;
      extraMeta.currentBpm = getBPM(Math.min(100, Math.floor(corruptionFraction * 100)));
      break;
    }

    case 'cctv-matrix': {
      title = `SECURITY SURVEILLANCE FEED // CAM MULTIPLEXER`;
      content = `REMOTE CCTV CONTROL CONSOLE: Monitoring subterranean access points. Switch channels to inspect perimeter corridors, quarantine airlocks, and flooded elevator shafts. Notice the movement in the dark.`;
      extraMeta.isCctvMatrix = true;
      extraMeta.channel = 'CAM-04 [WARD B]';
      break;
    }

    case 'cursed-button': {
      title = `CONTAINMENT PRESSURE EQUALIZATION LEVER`;
      content = `EMERGENCY HAZARD OVERRIDE: Do not trigger under any circumstance. Engaging this valve equalizes atmosphere between your room and the abyssal trench below. Something is clawing at the vent.`;
      extraMeta.buttonLabel = 'ENGAGE PURGE // BREACH SEALS';
      break;
    }

    case 'eye-specimen': {
      title = `SPECIMEN VAULT // OCULAR CLUSTER #09`;
      content = `BIOMETRIC OCULAR SPECIMEN: Living biological retina recovered from air duct. The lens is unreactive to facility lighting, but focuses directly on the viewer's screen coordinates.`;
      extraMeta.pupilDiameter = '18.4mm';
      extraMeta.retinaState = 'WATCHING';
      break;
    }

    case 'corrupted-terminal': {
      title = `KERNEL PANIC // /dev/flesh0 CORE DUMP`;
      content = `Reading 0x0000DEAD... Stack pointer overflow: 0xFF8100. The kernel driver attempted to dereference memory belonging to an unbaptized child. The motherboard temperature is 108°C and leaking spinal fluid.`;
      extraMeta.pid = 666;
      extraMeta.faultAddress = '0x8849F000';
      break;
    }

    case 'flesh-fragment': {
      title = `ORGANIC PATHOLOGY SAMPLE #411`;
      content = `BIO-SPECIMEN ARCHIVE: Tissue continues to spasm 18 months after removal from donor. When audio microphone is placed in proximity, sample emits sub-audible whisper: "Keep scrolling. We are hungry at the bottom."`;
      extraMeta.cellDivision = 'UNCONTROLLED';
      extraMeta.biomass = 'INCREASING';
      break;
    }

    case 'surveillance-capture':
    case 'archival-photo':
    case 'hollow-portrait':
    case 'incident-report':
    case 'distress-log':
    default: {
      title = `INCIDENT LOG // STRATA LEVEL ${formatDepth(depthMeters)}`;
      content = `FACILITY TELEMETRY: Pressure gauges have shattered. Atmospheric condensation is warm, red, and smells of copper. The security team sent to investigate the bottom shaft has ceased using words and now communicates only in teeth grinding.`;
      extraMeta.casualtyCount = 14 + Math.floor(depthMeters / 100);
      extraMeta.airQuality = 'SUFFOCATING';
      break;
    }
  }

  // Get visually coherent, high-variety specimen for this item
  const imageSpecimen = getSpecimenForNarrativeType(selectedType, depthMeters + index * 17);

  // Scaled displacement and chaotic rotation
  const maxDisp = Math.pow(corruptionFraction, 1.3) * 38;
  const maxRot = Math.pow(corruptionFraction, 1.4) * 4.5;
  const dispX = (Math.random() * 2 - 1) * maxDisp;
  const dispY = (Math.random() * 2 - 1) * (maxDisp * 0.35);
  const rot = (Math.random() * 2 - 1) * maxRot;
  const scale = 1 + (Math.random() - 0.5) * (corruptionFraction * 0.06);
  const chaosProfile = generateLayoutChaos(depthMeters, index, uniqueSeed);

  return {
    id: `item-${depthMeters}-${index}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    depthThreshold: depthMeters,
    type: selectedType,
    title,
    content,
    imageSpecimen,
    extraMeta,
    displacementX: dispX,
    displacementY: dispY,
    rotation: rot,
    scale,
    glitchSeverity: Math.min(1.2, corruptionFraction + (index * 0.08)),
    chaosProfile
  };
}
