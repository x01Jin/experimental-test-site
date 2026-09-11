/**
 * Signal texture only — numbers-station / hex / morse runs that get
 * spliced after verbatim quotes in deep water. No prose lives here;
 * all words on screen are pasted from sources (see foundVerbatim.ts).
 */

export interface LinkCard {
  label: string;
  url: string;
  kind: 'text' | 'audio' | 'video' | 'photo';
  note: string;
}

export const NUMBERS_RUNS: string[] = [
  '4 - 9 - 0 - 2 ... repeat',
  '409 409 409 ... pause',
  '12 88 12 04 ... lost under whistle',
  '804.8 FM 4AM-11PM then cut',
  '020 993 ... [tape hiss]',
  '6.210 MHz ... counting through static',
  '7 7 7 ... 0 ... silence',
];

export const GIBBERISH_BLOCKS: string[] = [
  'ksssh — ... — tktktk ... nnn ...',
  '0x00ff9a44 deadbeef 00101100 fault',
  '.-.. --- ... - ... ... signal gone',
  'ngai ygg n\u2019gha ... far is near',
  'th— ... —e w— ... —all ga— ... —ve',
  '[chair scrapes] ... [tape cuts] ...',
  '████ ... hum ... ████ ... drip',
  'light is dark and dark is light',
  'far is near and near is far',
  'rrrrip ... sssss ... thud ... quiet',
];

/** Public-domain / CC-clean link cards. Video/audio embed inline, click-to-play. */
export const LINK_CARDS: LinkCard[] = [
  {
    label: 'Nosferatu (1922) — full film, public domain',
    url: 'https://archive.org/embed/nosferatu-1922_202504',
    kind: 'video',
    note: 'gets chewed deeper down. leave the sound low.',
  },
  {
    label: 'Night of the Living Dead (1968) — public domain',
    url: 'https://archive.org/embed/Night_of_the_Living_Dead_AVI',
    kind: 'video',
    note: 'farmhouse. static eats the edges first.',
  },
  {
    label: 'Carnival of Souls (1962) — public domain',
    url: 'https://archive.org/embed/CarnivalofSouls',
    kind: 'video',
    note: 'watch the pavilion scene. then stop.',
  },
  {
    label: '12 Creepy Tales — Poe readings (LibriVox)',
    url: 'https://archive.org/details/12_creepytales_1206_librivox',
    kind: 'audio',
    note: 'tell-tale heart first. headphones.',
  },
  {
    label: 'Lovecraft readings (LibriVox)',
    url: 'https://archive.org/details/collected_lovecraft_0810_librivox',
    kind: 'audio',
    note: 'dunwich. the hill part.',
  },
  {
    label: 'Horror shelf — full texts (Gutenberg)',
    url: 'https://www.gutenberg.org/ebooks/bookshelf/42',
    kind: 'text',
    note: 'dracula, jekyll, turn of the screw. free.',
  },
  {
    label: 'Dunwich Horror — full text',
    url: 'https://www.gutenberg.org/files/50133/50133-h/50133-h.htm',
    kind: 'text',
    note: 'the hill noises reach arkham.',
  },
  {
    label: 'Spirit photos — Mumler, 1861 (public domain)',
    url: 'https://commons.wikimedia.org/wiki/File:Mumler_(Mumler).jpg',
    kind: 'photo',
    note: 'first ghost photo scam. still creepy.',
  },
  {
    label: 'Ectoplasm photo, 1912 (public domain)',
    url: 'https://commons.wikimedia.org/wiki/File:Medium-Eva-Carriere-1912.jpg',
    kind: 'photo',
    note: 'head thing. look quick.',
  },
  {
    label: 'Ghostly whispering (CC0, Freesound)',
    url: 'https://freesound.org/people/qubodup/sounds/194628/',
    kind: 'audio',
    note: 'layer under everything. low.',
  },
];
