/**
 * Single-purpose module for generating Zalgo and demonic glitch text.
 * Injects combining unicode characters scaled by corruption level.
 */

const ZALGO_UP = [
  '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306',
  '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a',
  '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303',
  '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f',
  '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364'
];

const ZALGO_MID = [
  '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322',
  '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c',
  '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337'
];

const ZALGO_DOWN = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e',
  '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a',
  '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331',
  '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345',
  '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354'
];

const GLITCH_CHARS = ['█', '▓', '▒', '░', '§', '¶', 'ø', '¥', '†', '‡', 'µ', '§', 'Δ', 'Ω', '0', '1', '!', '?', '#', '¿', '¡', '†', 'Ø'];

/**
 * Corrupts text according to intensity (0 to 1)
 */
export function zalgoText(text: string, intensity: number): string {
  if (intensity <= 0.05) return text;

  const clamped = Math.min(Math.max(intensity, 0), 1);
  const upCount = Math.floor(clamped * 6);
  const midCount = Math.floor(clamped * 3);
  const downCount = Math.floor(clamped * 6);

  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ' || char === '\n') {
      result += char;
      continue;
    }

    // Random substitution with glitch characters at high intensity
    if (Math.random() < clamped * 0.18) {
      result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      continue;
    }

    result += char;

    for (let u = 0; u < upCount; u++) {
      if (Math.random() < clamped) {
        result += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
      }
    }
    for (let m = 0; m < midCount; m++) {
      if (Math.random() < clamped) {
        result += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
      }
    }
    for (let d = 0; d < downCount; d++) {
      if (Math.random() < clamped) {
        result += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
      }
    }
  }

  return result;
}
