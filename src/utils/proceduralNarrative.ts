/**
 * Random destruction feed. Every choice is Math.random() at creation time —
 * type, excerpt, clip, image, displacement. Depth only sets the threshold
 * and the corruption curve. All prose is verbatim (foundVerbatim);
 * the only non-verbal texture is numbers-station / hex / morse runs.
 */

import { HorrorItem, HorrorItemType, DepthTier } from '../types/horror';
import { getSpecimenForNarrativeType } from './internetImages';
import { generateLayoutChaos } from './layoutChaos';
import { getDepthTier as canonicalTier, getVisualIntensity, getBPM, formatDepth } from './depthScale';
import { NUMBERS_RUNS, GIBBERISH_BLOCKS } from './foundHorror';
import { TEXT_EXCERPTS, AUDIO_CLIPS, VIDEO_LOOPS } from './foundVerbatim';

const rand = <T,>(pool: T[]): T => pool[Math.floor(Math.random() * pool.length)];

/** video-heavy: ~40% of everything is a film loop */
function rollType(): HorrorItemType {
  const r = Math.random();
  if (r < 0.40) return 'found-film';
  const rest: HorrorItemType[] = [
    'found-audio', 'link-card', 'black-box-audio', 'radio-scanner',
    'eye-specimen', 'heartbeat-sensor', 'cctv-matrix', 'creepy-survey',
    'incident-report', 'distress-log', 'archival-photo', 'surveillance-capture',
    'hollow-portrait', 'autopsy-record', 'redacted-dossier', 'flesh-fragment',
    'corrupted-terminal', 'system-error', 'memory-leak', 'cursed-button',
    'cosmic-aberration',
  ];
  return rand(rest);
}

export function getDepthTier(depthMeters: number): DepthTier {
  return canonicalTier(depthMeters);
}

export function generateProceduralHorrorItem(
  depthMeters: number,
  index: number,
  uniqueSeed: number
): HorrorItem {
  const corruptionFraction = getVisualIntensity(depthMeters);
  const c = Math.min(1, depthMeters / 4000);
  const selectedType = rollType();
  const excerpt = rand(TEXT_EXCERPTS);

  let title = excerpt.title;
  let content = excerpt.text;
  let extraMeta: Record<string, string | number | boolean> = {
    source: excerpt.source,
    sourceUrl: excerpt.url,
    depthOffset: formatDepth(depthMeters),
  };

  switch (selectedType) {
    case 'found-film': {
      const loop = rand(VIDEO_LOOPS);
      title = loop.label;
      content = excerpt.text;
      extraMeta.loopSrc = loop.src;
      extraMeta.pageUrl = loop.pageUrl;
      extraMeta.loopCredit = loop.credit;
      break;
    }
    case 'found-audio':
    case 'black-box-audio': {
      const clip = rand(AUDIO_CLIPS);
      title = clip.label;
      content = excerpt.text;
      extraMeta.audioUrl = clip.url;
      extraMeta.audioCredit = clip.credit;
      extraMeta.audioFreq = rand(['VLF 14.8 kHz', '114.2 kHz', '142.85 MHz']);
      extraMeta.speaker = excerpt.source.split('—')[0].trim();
      break;
    }
    case 'link-card': {
      title = excerpt.title;
      content = excerpt.text;
      extraMeta.linkUrl = excerpt.url;
      extraMeta.linkLabel = excerpt.source;
      break;
    }
    case 'radio-scanner': {
      const clip = rand(AUDIO_CLIPS);
      title = clip.label;
      content = excerpt.text;
      extraMeta.defaultFreq = `${(100 + Math.random() * 800 * 0.5).toFixed(1)} kHz`;
      extraMeta.isRadioScanner = true;
      extraMeta.audioUrl = clip.url;
      extraMeta.audioCredit = clip.credit;
      break;
    }
    case 'heartbeat-sensor': {
      title = excerpt.title;
      content = excerpt.text;
      extraMeta.isHeartbeatSensor = true;
      extraMeta.currentBpm = getBPM(Math.min(100, Math.floor(corruptionFraction * 100)));
      break;
    }
    case 'cctv-matrix': {
      title = excerpt.title;
      content = excerpt.text;
      extraMeta.isCctvMatrix = true;
      break;
    }
    case 'cursed-button': {
      title = excerpt.title;
      content = excerpt.text;
      extraMeta.buttonLabel = 'open it';
      break;
    }
    case 'creepy-survey': {
      title = excerpt.title;
      content = excerpt.text;
      extraMeta.optionA = 'yes';
      extraMeta.optionB = 'no';
      break;
    }
    default: {
      title = excerpt.title;
      content = excerpt.text;
      break;
    }
  }

  // deep water chews the quote: numbers-station / signal texture only, never new prose
  if (c > 0.55 && Math.random() < 0.5) {
    content += `\n${Math.random() < 0.5 ? rand(NUMBERS_RUNS) : rand(GIBBERISH_BLOCKS)}`;
  }

  const imageSpecimen = getSpecimenForNarrativeType(
    selectedType === 'found-film' ? 'surveillance' : selectedType === 'found-audio' ? 'analog-glitch' : selectedType === 'link-card' ? 'liminal' : selectedType,
    Math.floor(Math.random() * 100000)
  );

  const maxDisp = Math.pow(corruptionFraction, 1.3) * 38;
  const maxRot = Math.pow(corruptionFraction, 1.4) * 4.5;

  return {
    id: `item-${depthMeters}-${index}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    depthThreshold: depthMeters,
    type: selectedType,
    title,
    content,
    imageSpecimen,
    extraMeta,
    displacementX: (Math.random() * 2 - 1) * maxDisp,
    displacementY: (Math.random() * 2 - 1) * (maxDisp * 0.35),
    rotation: (Math.random() * 2 - 1) * maxRot,
    scale: 1 + (Math.random() - 0.5) * (corruptionFraction * 0.06),
    glitchSeverity: Math.min(1.2, corruptionFraction + (Math.random() * 0.25)),
    chaosProfile: generateLayoutChaos(depthMeters, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 100000)),
  };
}
