import { InternetImageSpecimen } from '../utils/internetImages';
import type { LayoutChaosProfile } from '../utils/layoutChaos';

export type DepthTier = 'surface' | 'decay' | 'breakdown' | 'nightmare' | 'abyss';

export interface DepthState {
  scrollY: number;
  depthMeters: number;
  corruptionLevel: number; // 0 to 100+
  tier: DepthTier;
  scrollVelocity: number;
  isRapidScrolling: boolean;
}

export type JumpscareType =
  | 'loud-crash-noise'       // Loud sudden BSOD audio freeze + static shock + violent element shudder
  | 'corrupted-error-popup'  // Aggressive corrupted system crash error pop-up dialog
  | 'distorted-fetched-image'// Sudden violently distorted, stretched, warped internet image shock
  | 'abstract-signal-tear';  // High-frequency abstract scanline/RAM corruption tear flash

export interface JumpscareEvent {
  id: string;
  type: JumpscareType;
  intensity: number; // 1 to 5
  timestamp: number;
  durationMs: number;
  imageSpecimen?: InternetImageSpecimen;
  errorCode?: string;
  errorMessage?: string;
}

export type HorrorItemType =
  | 'incident-report'
  | 'distress-log'
  | 'corrupted-terminal'
  | 'cursed-button'
  | 'eye-specimen'
  | 'system-error'
  | 'creepy-survey'
  | 'flesh-fragment'
  | 'memory-leak'
  | 'hollow-portrait'
  | 'archival-photo'
  | 'surveillance-capture'
  | 'black-box-audio'
  | 'redacted-dossier'
  | 'radio-scanner'
  | 'heartbeat-sensor'
  | 'cosmic-aberration'
  | 'autopsy-record'
  | 'cctv-matrix';

export interface HorrorItem {
  id: string;
  depthThreshold: number;
  type: HorrorItemType;
  title: string;
  content: string;
  imageSpecimen?: InternetImageSpecimen;
  extraMeta?: Record<string, string | number | boolean>;
  offsetAngle?: number;
  displacementX?: number;
  displacementY?: number;
  scale?: number;
  rotation?: number;
  colorShift?: string;
  glitchSeverity: number;
  chaosProfile?: LayoutChaosProfile;
}
