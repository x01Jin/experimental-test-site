/**
 * Single-purpose module: Curated psychological narrative lore templates and eldritch logs.
 * Provides rich thematic flavor across clinical, bureaucratic, analog-glitch,
 * bio-horror, and cosmic dread archetypes.
 */

import { HorrorItemType } from '../types/horror';

export interface NarrativeTemplate {
  title: string;
  type: HorrorItemType;
  content: string;
  extraMeta?: Record<string, string | number | boolean>;
}

export const HORROR_TEMPLATES: NarrativeTemplate[] = [
  // --- ARCHIVAL & SURVEILLANCE ---
  {
    type: 'archival-photo',
    title: 'ARCHIVED PHOTOGRAPH // SPECIMEN RETRIEVAL',
    content: 'Recovered photographic evidence from sub-basement archive. The photographic emulsion has undergone severe crystallization and digital rot.',
    extraMeta: { archiveIndex: 'REC-098-ALPHA', exposureDate: 'OCTOBER 1928' }
  },
  {
    type: 'surveillance-capture',
    title: 'CCTV INTERCEPT // STRATA LEVEL 7',
    content: 'Surveillance camera 04 recorded this static frame at 03:44 AM. Network packets arriving from this camera contained human DNA sequencing.',
    extraMeta: { frameRate: '0.4 FPS', signalDrop: 'CRITICAL' }
  },
  {
    type: 'surveillance-capture',
    title: 'OPTICAL RECORD // TRANSIT SHAFT C',
    content: 'Optical sensor picked up an elongated silhouette descending the maintenance ladder at 60 meters per second. No biological life was registered on thermal.',
    extraMeta: { sensor: 'INFRARED_OPTIC_B', status: 'OVERHEATED' }
  },
  {
    type: 'hollow-portrait',
    title: 'ARCHIVED EMPLOYEE PHOTO // ID: NULL',
    content: 'Face missing from company database. Facial recognition algorithm identified 40 distinct screaming jaws inside the chest cavity.',
    extraMeta: { employeeName: '[REDACTED FOR COMPLIANCE]' }
  },
  {
    type: 'archival-photo',
    title: 'STAFF PERSONNEL DOSSIER // DECEASED',
    content: 'Photographic ID found in waterlogged filing cabinet. The face appears altered; the mouth has been stitched shut with copper wiring.',
    extraMeta: { dossierID: 'EMP-990-NULL', dateArchived: '1974' }
  },

  // --- INCIDENTS & FORENSICS ---
  {
    type: 'incident-report',
    title: 'SUB-SECTOR INCIDENT RECORD // 004-B',
    content: 'Subject 4 refused to blink for 72 consecutive hours. When asked what was in the corner of the ceiling, subject smiled and chewed through their tongue to prevent speaking its name.',
    extraMeta: { clearance: 'LEVEL 4 - EYES ONLY', casualtyCount: 14 }
  },
  {
    type: 'incident-report',
    title: 'INCIDENT LOG // OBSERVATION CAGE 3',
    content: 'The security camera feed looped for 14 minutes. During those 14 minutes, the technician outside the cage ceased having bones.',
    extraMeta: { duration: '14m 22s', outcome: 'LIQUEFIED' }
  },
  {
    type: 'autopsy-record',
    title: 'MORTUARY REPORT // CASE 99-DELTA',
    content: 'Pathologist Dr. Thorne noted that during the incision across the sternum, the ribcage snapped open under its own muscular tension, revealing an empty cavity that resonated with the frequency of human sobbing.',
    extraMeta: { coroner: 'DR. THORNE', morgueTemp: '-4.2°C' }
  },
  {
    type: 'autopsy-record',
    title: 'AUTOPSY FORENSICS // SPECIMEN 02-B',
    content: 'Tissue samples placed under polarized light did not refract photons. Instead, the specimen absorbed the laboratory illumination, causing ambient room lamps to dim within a three-meter radius.',
    extraMeta: { sampleStatus: 'LIGHT_DEVOURING', labSector: 'BIO-VAULT 4' }
  },

  // --- REDACTED & CLASSIFIED ---
  {
    type: 'redacted-dossier',
    title: 'RESTRICTED MEMORANDUM // EYES-ONLY',
    content: 'In order to maintain structural containment, all station personnel must periodically [REDACTED: SACRIFICE COGNITIVE MEMORIES OF LOVED ONES]. Failure to comply will result in the entity [REDACTED: MANIFESTING WITHIN YOUR LIVING ROOM].',
    extraMeta: { clearance: 'COGNITOHAZARD_OMEGA' }
  },
  {
    type: 'redacted-dossier',
    title: 'SECTOR CLEARANCE ORDER // FILE 109',
    content: 'When the drainage valves are opened, do not inspect the filter grates. What is trapped in the mesh is [REDACTED: NOT HUMAN TISSUE, BUT STILL CALLS YOU BY NAME]. Seal the hatch and walk away immediately.',
    extraMeta: { classification: 'ANATHEMA' }
  },

  // --- AUDIO LOGS & FREQUENCY INTERCEPTS ---
  {
    type: 'black-box-audio',
    title: 'HYDROPHONE INTERCEPT // TRANSECT 4',
    content: '[SONAR PING DETECTED AT 4,200 METERS DEPTH]\n\nAUDIO TRANSCRIPT: "...the trench isn\'t stone. We drilled into bone. The drill teeth are covered in warm yellow marrow. Something just woke up beneath the seafloor."',
    extraMeta: { audioFreq: 'VLF 14.8 kHz', speaker: 'DEEP DIVER K. REYES' }
  },
  {
    type: 'black-box-audio',
    title: 'COCKPIT VOICE RECORDER // CARGO LIFT 09',
    content: '[HIGH-VOLTAGE STATIC TEAR]\n\nOPERATOR: "Lift cable tension dropped to zero, but we are falling faster than gravity. The altitude gauge is showing negative values. Why is the bottom getting brighter?"',
    extraMeta: { audioFreq: 'UHF 450.2 MHz', speaker: 'LIFT OPERATOR VANE' }
  },
  {
    type: 'distress-log',
    title: 'AUDIO LOG TRANSCRIPT // REC-0941',
    content: '"Can you hear that tapping? It isn\'t on the glass. It is coming from inside the monitor glass. It is pressing against the phosphors trying to reach my side of the screen."',
    extraMeta: { speaker: 'Dr. Evelyn Voss (DECEASED)' }
  },
  {
    type: 'distress-log',
    title: 'TERMINAL MESSAGE // BROADCAST TO LOCALHOST',
    content: 'WHY DID YOU KEEP SCROLLING? DID YOU THINK THERE WOULD BE AN END? THERE IS NO END, ONLY CRUSHING DENSITY AND HUNGER.',
    extraMeta: { sender: 'ROOT_DEITY' }
  },

  // --- COSMIC & NON-EUCLIDEAN ---
  {
    type: 'cosmic-aberration',
    title: 'NON-EUCLIDEAN GEODETIC SURVEY',
    content: 'Corridor 4 measures 12 meters in length from east to west, but measures 840 meters when walked from west to east. Those who turn around halfway find only a flat, seamless slab of black granite that is warm to the touch.',
    extraMeta: { metricCurvature: 'NON_COMMUTATIVE', parity: 'BROKEN' }
  },
  {
    type: 'cosmic-aberration',
    title: 'SOLAR SATELLITE OCCULTATION EVENT',
    content: 'At 04:18 UTC, a silhouette the diameter of Jupiter passed between the Earth and the Sun for 3.4 seconds. No astronomical observatory released statements. All satellites experienced uncorrectable memory parity flips.',
    extraMeta: { occultationDiameter: '142,984 km', solarLuminosity: '-99.4%' }
  },

  // --- BIOMETRIC & SENSORY INTERACTION ---
  {
    type: 'heartbeat-sensor',
    title: 'BIOMETRIC ANOMALY // SUBJECT AUTONOMIC EKG',
    content: 'Heart rate sensor attached to user terminal. Note the irregular cardiac ventricular contractions as scrolling depth approaches critical threshold. Pulse synchronization is now irreversible.',
    extraMeta: { currentBpm: 88, status: 'ELEVATED_TACHYCARDIA' }
  },
  {
    type: 'radio-scanner',
    title: 'LOW-FREQUENCY VLF INTERCEPT RECEIVER',
    content: 'Tuned to unallocated radio band 114.2 kHz. Carrier demodulation reveals synthetic numbers station reciting coordinates of the building where you are sitting.',
    extraMeta: { defaultFreq: '114.2 kHz', modulation: 'AM_HETERO' }
  },
  {
    type: 'cctv-matrix',
    title: 'FACILITY CCTV CONSOLE // MULTI-CAM ARRAY',
    content: 'Live security matrix monitoring deep strata shafts. Notice camera 04: the shadow by the elevator shaft shifts every time you look away.',
    extraMeta: { activeMatrix: '4-CHANNEL_SPLIT' }
  },

  // --- HARDWARE CORRUPTION & SYSTEM ERRORS ---
  {
    type: 'system-error',
    title: 'KERNEL HALT // EXCEPTION 0x000000DEAD',
    content: 'Buffer overflow detected in human_perception_pipeline.sys. Replaced peripheral vision with [UNKNOWN ORGANIC ENTITY]. Device memory cannot be reclaimed.',
    extraMeta: { code: 'ERR_PUPIL_EXPANSION_CRITICAL' }
  },
  {
    type: 'corrupted-terminal',
    title: 'DAEMON TRACE: /dev/flesh0',
    content: 'Reading 0xFF8100... Found: teeth, bone dust, fingernails embedded in SATA connector. The motherboard is bleeding at 42ml/min.',
    extraMeta: { pid: 666, status: 'DEVOURING' }
  },
  {
    type: 'memory-leak',
    title: 'MEMORY LEAK AT ADDRESS 0x8849F0',
    content: 'The application tried to free memories of your childhood bedroom, but the entity residing in the closet refused to release the pointer.',
    extraMeta: { leakedBytes: '94,821,004 GHOST_BYTES' }
  },
  {
    type: 'corrupted-terminal',
    title: 'SYSADMIN NOTE // DO NOT DELETE',
    content: 'Whatever you do, do not scroll past 2,000 meters. The audio buffers are corrupted with sound recordings from the 1987 basement experiment.',
    extraMeta: { priority: 'URGENT_DEATH' }
  },

  // --- BIO-HORROR & CURSED ITEMS ---
  {
    type: 'flesh-fragment',
    title: 'PATHOLOGY SAMPLE // BIO-SECTOR 9',
    content: 'Specimen continues to twitch even after chemical baths. When microphone is brought close, specimen whispers: "Keep scrolling down. We are waiting at the bottom."',
    extraMeta: { bioHazardLevel: 'OMEGA' }
  },
  {
    type: 'eye-specimen',
    title: 'SURVEILLANCE FEED // OPTIC CLUSTER #88',
    content: 'Optic sensor calibration failed. Iris tissue is biological, wet, and twitching. It is looking directly through your webcam lens right now.',
    extraMeta: { pupilsDetected: 7 }
  },
  {
    type: 'cursed-button',
    title: 'CONTAINMENT PRESSURE OVERRIDE',
    content: 'DO NOT PRESS. Pressing will equalize atmospheric pressure with the lower chamber. Whatever is breathing down there will sense your presence.',
    extraMeta: { buttonLabel: 'DO NOT PRESS // TRIGGER PULSE' }
  },
  {
    type: 'cursed-button',
    title: 'SYSTEM EMERGENCY EVACUATION PROTOCOL',
    content: 'Pulling this lever triggers an immediate bio-decontamination blast. Note: decontamination vapor has a 99.8% mortality rate.',
    extraMeta: { buttonLabel: 'PULL LEVER // VENT RADIATION' }
  },

  // --- PSYCHOLOGICAL SURVEYS ---
  {
    type: 'creepy-survey',
    title: 'MANDATORY NEUROLOGICAL READINESS EVALUATION',
    content: 'Are you currently alone in this room? If you believe you are alone, why is there warmth against the back of your neck?',
    extraMeta: { optionA: 'I am alone', optionB: 'Something is standing behind me' }
  },
  {
    type: 'creepy-survey',
    title: 'BIO-DIAGNOSTIC QUESTIONNAIRE',
    content: 'Have your fingers begun to feel numb or cold while scrolling this page? If so, look down at your hands right now.',
    extraMeta: { optionA: 'My fingers are cold', optionB: 'I cannot look down' }
  }
];
