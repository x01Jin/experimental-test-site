/**
 * Single-purpose module: Curated repository and fetcher of public internet images
 * for horror degradation, surveillance feeds, archival specimens, and psychological decay.
 * Utilizes reliable CDN images (Unsplash, Wikimedia Commons, and Picsum) with rich metadata.
 */

export interface InternetImageSpecimen {
  id: string;
  url: string;
  fallbackSeed: number;
  category: 'portrait' | 'surveillance' | 'medical' | 'architecture' | 'specimen' | 'liminal' | 'cosmic' | 'analog-glitch';
  title: string;
  caption: string;
  sourceOrigin: string;
  filterMode?: 'normal' | 'infrared' | 'xray' | 'thermal' | 'monochrome-grain';
}

export const INTERNET_HORROR_IMAGES: InternetImageSpecimen[] = [
  // =================== PORTRAITS & BIO-ARCHIVES ===================
  {
    id: 'specimen-portrait-1',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 101,
    category: 'portrait',
    title: 'SUBJECT 09-B // DAGUERREOTYPE',
    caption: 'Archived portrait recovered from basement vault. Biometric facial markers have distorted over time.',
    sourceOrigin: 'CIVIL ARCHIVES VOL. 14'
  },
  {
    id: 'specimen-portrait-2',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 102,
    category: 'portrait',
    title: 'PATIENT #441 // ADMISSION RECORD',
    caption: 'Subject reported persistent auditory hum at 38 Hz. Pupil dilation remained unreactive to ambient light.',
    sourceOrigin: 'VALLEY SANATORIUM 1974'
  },
  {
    id: 'specimen-portrait-3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 103,
    category: 'portrait',
    title: 'STAFF LOG: DR. ARIS THORNE',
    caption: 'Senior researcher logged last entry prior to perimeter breach. Eyes in photograph appear to watch observer.',
    sourceOrigin: 'PERSONNEL FILE 8820'
  },
  {
    id: 'specimen-portrait-4',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 104,
    category: 'portrait',
    title: 'DOSSIER #77 // VEILED APPARITION',
    caption: 'Emulsion plate taken during 1912 séances in Sub-Level 3. Skin tone registers negative temperature.',
    sourceOrigin: 'PARANORMAL CENSUS 1912'
  },
  {
    id: 'specimen-portrait-5',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 105,
    category: 'portrait',
    title: 'IDENTIFICATION FILE // UNCLAIMED CADAVER',
    caption: 'Found behind plaster partition in boiler chamber. Jaw muscles locked in post-mortem grimace.',
    sourceOrigin: 'COUNTY CORONER REGISTER'
  },
  {
    id: 'specimen-portrait-6',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 106,
    category: 'portrait',
    title: 'NURSE MARGARET ELM // SHIFT REPORT',
    caption: 'Entered Ward 9 at 02:15. When discovered, subject stated she could hear teeth grinding behind every brick.',
    sourceOrigin: 'PSYCHIATRIC ADMISSIONS 1968'
  },

  // =================== SURVEILLANCE & NIGHT CCTV ===================
  {
    id: 'specimen-surveillance-1',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 107,
    category: 'surveillance',
    title: 'CORRIDOR 4 // WARD B MONITOR',
    caption: 'Low-light CCTV capture. Motion sensor triggered repeatedly despite empty facility manifest.',
    sourceOrigin: 'CCTV RECORDER 0x99A',
    filterMode: 'infrared'
  },
  {
    id: 'specimen-surveillance-2',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 108,
    category: 'surveillance',
    title: 'ELEVATOR CAGE CAM // STRATA 5',
    caption: 'Digital artifacting caused by high-voltage leakage along elevator cable well.',
    sourceOrigin: 'TRANSIT MONITOR 04',
    filterMode: 'thermal'
  },
  {
    id: 'specimen-surveillance-3',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 109,
    category: 'surveillance',
    title: 'EXTERIOR GATE // PERIMETER POLE 12',
    caption: 'Infrared feed at 03:33. Optical sensors recorded human-height silhouette dissolving into mist.',
    sourceOrigin: 'BOUNDARY SECURITY CAM',
    filterMode: 'infrared'
  },
  {
    id: 'specimen-surveillance-4',
    url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 110,
    category: 'surveillance',
    title: 'UNDERGROUND PARKING // SUB-3',
    caption: 'Surveillance feed dropped frame rate to 0.1 FPS as ambient carbon monoxide alarms sounded.',
    sourceOrigin: 'AUTOMATED VMS 900'
  },
  {
    id: 'specimen-surveillance-5',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 111,
    category: 'surveillance',
    title: 'QUARANTINE AIRLOCK // SENSOR ARRAY',
    caption: 'Pressure breach indicators flashed green even though atmospheric pressure exceeded 4.2 bar.',
    sourceOrigin: 'SECTOR GATE TELEMETRY',
    filterMode: 'thermal'
  },

  // =================== MEDICAL & RADIOLOGY ===================
  {
    id: 'specimen-medical-1',
    url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 112,
    category: 'medical',
    title: 'CRANIAL SCAN 11-DELTA',
    caption: 'Transverse radiograph showing anomalous calcification in retro-orbital nerve pathways.',
    sourceOrigin: 'NEUROLOGY LAB ARCHIVE',
    filterMode: 'xray'
  },
  {
    id: 'specimen-medical-2',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 113,
    category: 'medical',
    title: 'HISTOLOGY SECTION // CELL COLONY 9',
    caption: 'Cultured cellular tissue exhibiting continuous cell division in complete absence of oxygen.',
    sourceOrigin: 'PATHOLOGY DEPT 02'
  },
  {
    id: 'specimen-medical-3',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 114,
    category: 'medical',
    title: 'SURGICAL THEATER 4 // EMERGENCY CESSATION',
    caption: 'Operation terminated abruptly when patient vocal cords continued chanting while under complete general anesthesia.',
    sourceOrigin: 'CLINICAL INCIDENT LOG 1983'
  },
  {
    id: 'specimen-medical-4',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 115,
    category: 'medical',
    title: 'BIO-VIAL #882 // AMNIOTIC SEDIMENT',
    caption: 'Liquid inside vial has developed its own pulse at precisely 44 beats per minute.',
    sourceOrigin: 'BIO-CONTAINMENT VAULT'
  },

  // =================== LIMINAL SPACES & CONCRETE VOIDS ===================
  {
    id: 'specimen-liminal-1',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 116,
    category: 'liminal',
    title: 'CORRIDOR OF THE UNSLEEPING',
    caption: 'Infinite hallway documented in Level -42. Doors open into identical empty brick-lined cavities.',
    sourceOrigin: 'STRUCTURAL RECON 2019'
  },
  {
    id: 'specimen-liminal-2',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 117,
    category: 'liminal',
    title: 'STAIRWELL NEGATIVE ELEVATION',
    caption: 'Staircase continues 2,400 meters past foundation blueprints. Echo returns are human whispers.',
    sourceOrigin: 'GEODETIC SURVEY'
  },
  {
    id: 'specimen-liminal-3',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 118,
    category: 'architecture',
    title: 'SUB-LEVEL SUBSTATION SHAFT',
    caption: 'Structural beam collapse at -420m. Concrete walls display organic capillary patterning.',
    sourceOrigin: 'MAINTENANCE TELEMETRY'
  },
  {
    id: 'specimen-liminal-4',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 119,
    category: 'liminal',
    title: 'THE DROWNED MONOLITH',
    caption: 'Subterranean foundation pillar found submerged in black alkaline fluid. Depth gauges fail to find bottom.',
    sourceOrigin: 'DEEP DRAINAGE CORE'
  },
  {
    id: 'specimen-liminal-5',
    url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 120,
    category: 'liminal',
    title: 'ABANDONED VENTILATION INTERCEPT',
    caption: 'Ductwork produces rhythmic acoustic inhales and exhales every 6 seconds.',
    sourceOrigin: 'HVAC TELEMETRY STATION'
  },

  // =================== SPECIMENS & ORGANIC ENTITIES ===================
  {
    id: 'specimen-specimen-1',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 121,
    category: 'specimen',
    title: 'ORGANIC TISSUE SAMPLE 8',
    caption: 'Microscopic slide of unidentified fibrous cellular structure proliferating in the ventilation ducts.',
    sourceOrigin: 'PATHOLOGY UNIT 3'
  },
  {
    id: 'specimen-specimen-2',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 122,
    category: 'specimen',
    title: 'ANOMALOUS STATIC EMISSION',
    caption: 'Electromagnetic scan of cathode tube receiver tuned to unassigned frequency channel 0.',
    sourceOrigin: 'RF TELEMETRY ARRAY'
  },
  {
    id: 'specimen-specimen-3',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 123,
    category: 'specimen',
    title: 'BENTHIC TRENCH ABOMINATION',
    caption: 'Sub-abyssal specimen dredged from 9,000 meters depth. Organic carapace is coated in human eye lenses.',
    sourceOrigin: 'DEEP OCEAN TRANSECT'
  },
  {
    id: 'specimen-specimen-4',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 124,
    category: 'specimen',
    title: 'MYCELIAL MASS // CRAWLING COLONY',
    caption: 'Fungal network that grows exclusively towards magnetic fields generated by human thought.',
    sourceOrigin: 'BOTANICAL RESEARCH SEC 8'
  },
  {
    id: 'specimen-specimen-5',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 125,
    category: 'specimen',
    title: 'PETRIFIED RETINAL CLUSTER',
    caption: 'Calcified biological clump recovered from drainage pipe. Microscopes reveal 14 iris pupil apertures.',
    sourceOrigin: 'SPECIMEN JAR #002-X'
  },

  // =================== COSMIC & NON-EUCLIDEAN VOIDS ===================
  {
    id: 'specimen-cosmic-1',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 126,
    category: 'cosmic',
    title: 'GRAVITATIONAL ANOMALY SPECTROGRAM',
    caption: 'Radio telescope scan focused at celestial coordinates 00h 42m. Radiation signature matches human screams.',
    sourceOrigin: 'DEEP SKY OBSERVATORY'
  },
  {
    id: 'specimen-cosmic-2',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 127,
    category: 'cosmic',
    title: 'ATMOSPHERIC ENTRY DISTORTION',
    caption: 'Orbital satellite recorded unexplained planetary distortion. Landmasses beneath cloud layer appeared to breathe.',
    sourceOrigin: 'EARTH OBSERVATION TELEMETRY'
  },
  {
    id: 'specimen-cosmic-3',
    url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 128,
    category: 'cosmic',
    title: 'SOLAR CORONAL GAP // BLACK FLARE',
    caption: 'A 400,000 kilometer void opened in the solar photosphere for 12 seconds. All radios on Earth emitted weeping sounds.',
    sourceOrigin: 'HELIOPHYSICS ARRAY 09'
  },

  // =================== ANALOG GLITCH & HARDWARE FAILURE ===================
  {
    id: 'specimen-analog-1',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 129,
    category: 'analog-glitch',
    title: 'INTEGRATED CIRCUIT BLEED-THROUGH',
    caption: 'Microscopic inspection of silicon wafer. Silicon traces have fused into organic vascular capillaries.',
    sourceOrigin: 'HARDWARE FORENSICS'
  },
  {
    id: 'specimen-analog-2',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 130,
    category: 'analog-glitch',
    title: 'PHOSPHOR BURN-IN RESIDUE',
    caption: 'CRT monitor turned off for 30 years still projects the silhouette of a face screaming behind the glass.',
    sourceOrigin: 'OBSOLESCENCE VAULT'
  },
  {
    id: 'specimen-analog-3',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 131,
    category: 'analog-glitch',
    title: 'HEXADECIMAL MEMORY PARASITE',
    caption: 'Memory dump visualizer at address 0x0000DEAD. Hex byte distributions form distinct human spinal cord shapes.',
    sourceOrigin: 'KERNEL LOG TRACE'
  },
  {
    id: 'specimen-analog-4',
    url: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=600&q=80',
    fallbackSeed: 132,
    category: 'analog-glitch',
    title: 'HIGH-VOLTAGE BUS CORONA',
    caption: 'Dielectric breakdown across 100kV transformer bushings. Ionized air smelled of burnt flesh.',
    sourceOrigin: 'POWER SUBSTATION 4'
  }
];

/**
 * Returns a random internet image specimen from the curated repository
 */
export function getRandomInternetImage(seedIndex?: number, category?: InternetImageSpecimen['category']): InternetImageSpecimen {
  let pool = INTERNET_HORROR_IMAGES;
  if (category) {
    const filtered = INTERNET_HORROR_IMAGES.filter(img => img.category === category);
    if (filtered.length > 0) pool = filtered;
  }

  if (typeof seedIndex === 'number') {
    const idx = Math.abs(Math.floor(seedIndex)) % pool.length;
    return pool[idx];
  }
  const randomIdx = Math.floor(Math.random() * pool.length);
  return pool[randomIdx];
}

/**
 * Smart specimen selection correlated to the narrative horror archetype
 */
export function getSpecimenForNarrativeType(type: string, seed: number): InternetImageSpecimen {
  switch (type) {
    case 'surveillance-capture':
      return getRandomInternetImage(seed, 'surveillance');
    case 'archival-photo':
    case 'hollow-portrait':
      return getRandomInternetImage(seed, 'portrait');
    case 'incident-report':
    case 'distress-log':
      return getRandomInternetImage(seed, Math.random() > 0.5 ? 'liminal' : 'architecture');
    case 'system-error':
    case 'corrupted-terminal':
    case 'memory-leak':
      return getRandomInternetImage(seed, 'analog-glitch');
    case 'flesh-fragment':
    case 'eye-specimen':
      return getRandomInternetImage(seed, Math.random() > 0.5 ? 'specimen' : 'medical');
    case 'cosmic-aberration':
      return getRandomInternetImage(seed, 'cosmic');
    default:
      return getRandomInternetImage(seed);
  }
}

/**
 * Returns a specimen filtered by category or completely random
 */
export function getRandomSpecimen(category?: InternetImageSpecimen['category']): InternetImageSpecimen {
  return getRandomInternetImage(undefined, category);
}
