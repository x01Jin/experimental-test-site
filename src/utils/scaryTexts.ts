/**
 * Verbatim templates — every string below is copy-pasted from its source,
 * nothing generated. Titles are the source's own heads. extraMeta carries
 * the attribution + link so tiles can credit and link out.
 */

import { HorrorItemType } from '../types/horror';
import { TEXT_EXCERPTS } from './foundVerbatim';

export interface NarrativeTemplate {
  title: string;
  type: HorrorItemType;
  content: string;
  extraMeta?: Record<string, string | number | boolean>;
}

const TYPES: HorrorItemType[] = [
  'archival-photo', 'surveillance-capture', 'hollow-portrait',
  'incident-report', 'distress-log', 'autopsy-record',
  'redacted-dossier', 'black-box-audio', 'cosmic-aberration',
  'heartbeat-sensor', 'radio-scanner', 'cctv-matrix',
  'system-error', 'corrupted-terminal', 'memory-leak',
  'flesh-fragment', 'eye-specimen', 'cursed-button', 'creepy-survey',
];

function metaFor(i: number) {
  const e = TEXT_EXCERPTS[i % TEXT_EXCERPTS.length];
  return { source: e.source, sourceUrl: e.url };
}

export const HORROR_TEMPLATES: NarrativeTemplate[] = TEXT_EXCERPTS.map((e, i) => {
  const type = TYPES[i % TYPES.length];
  const extraMeta: Record<string, string | number | boolean> = metaFor(i);
  if (type === 'cursed-button') extraMeta.buttonLabel = 'open it';
  if (type === 'creepy-survey') {
    extraMeta.optionA = 'yes';
    extraMeta.optionB = 'no';
  }
  if (type === 'radio-scanner') extraMeta.defaultFreq = '114.2 kHz';
  if (type === 'heartbeat-sensor') extraMeta.currentBpm = 88;
  if (type === 'black-box-audio') {
    extraMeta.audioFreq = '142.85 MHz';
    extraMeta.speaker = e.source.split('—')[0].trim();
  }
  return { type, title: e.title, content: e.text, extraMeta };
});
