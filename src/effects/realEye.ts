/**
 * Realistic eye renderer — photo-sprite style without network cost.
 * Layered: sclera with noise + veins, iris fibers, limbal ring,
 * pupil, dual highlights, bloodshot lerp by corruption.
 * All gradients cached per radius bucket for 60fps.
 */

const irisCache = new Map<string, HTMLCanvasElement>();

function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildIrisSprite(radius: number, seed: number, bloodshot: number): HTMLCanvasElement {
  const key = `${Math.round(radius)}-${seed}-${Math.round(bloodshot * 4)}`;
  const hit = irisCache.get(key);
  if (hit) return hit;
  if (irisCache.size > 24) irisCache.clear();

  const size = Math.ceil(radius * 2 + 8);
  const cv = document.createElement('canvas');
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext('2d');
  if (!ctx) return cv;
  const c = size / 2;
  const rand = seededRand(seed * 7919 + 13);

  // Sclera — warm gray with blotches, not flat white
  const sclera = ctx.createRadialGradient(c, c, radius * 0.1, c, c, radius);
  sclera.addColorStop(0, '#e8e2d6');
  sclera.addColorStop(0.7, '#cfc8b8');
  sclera.addColorStop(0.92, '#8f867a');
  sclera.addColorStop(1, 'rgba(40,10,10,0.9)');
  ctx.fillStyle = sclera;
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.fill();

  // Sclera mottling
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2;
    const r = rand() * radius * 0.9;
    ctx.fillStyle = `rgba(${120 + rand() * 60},${100 + rand() * 40},${85 + rand() * 30},0.12)`;
    ctx.beginPath();
    ctx.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 1 + rand() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Veins — thin branching red, density by bloodshot
  const veins = Math.floor(8 + bloodshot * 22);
  for (let v = 0; v < veins; v++) {
    const a = rand() * Math.PI * 2;
    ctx.strokeStyle = `rgba(${150 + rand() * 60},${10 + rand() * 25},${10 + rand() * 20},${0.25 + bloodshot * 0.55})`;
    ctx.lineWidth = 0.6 + rand() * 1.1;
    ctx.beginPath();
    const x0 = c + Math.cos(a) * radius * 0.98;
    const y0 = c + Math.sin(a) * radius * 0.98;
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(
      c + Math.cos(a + 0.2) * radius * 0.6,
      c + Math.sin(a - 0.15) * radius * 0.6,
      c + Math.cos(a + 0.05) * radius * (0.35 + rand() * 0.2),
      c + Math.sin(a + 0.05) * radius * (0.35 + rand() * 0.2)
    );
    ctx.stroke();
  }

  irisCache.set(key, cv);
  return cv;
}

export function drawRealisticEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  targetX: number,
  targetY: number,
  bloodshotIntensity = 0.5,
  seed = 7,
  blink01 = 0, // 0 open, 1 shut
): void {
  const blood = Math.min(1, Math.max(0, bloodshotIntensity));
  ctx.save();

  // Blink squash
  if (blink01 > 0.02) {
    ctx.translate(cx, cy);
    ctx.scale(1, Math.max(0.08, 1 - blink01));
    ctx.translate(-cx, -cy);
  }

  // Base sprite (sclera + veins)
  const sprite = buildIrisSprite(radius, seed, blood);
  const s = sprite.width;
  ctx.drawImage(sprite, cx - s / 2, cy - s / 2);

  // Iris placement toward target
  const dx = targetX - cx;
  const dy = targetY - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const maxOff = radius * 0.34;
  const px = cx + (dx / dist) * Math.min(dist * 0.08, maxOff);
  const py = cy + (dy / dist) * Math.min(dist * 0.08, maxOff);
  const irisR = radius * 0.46;

  // Iris fibers
  const rand = seededRand(seed * 31 + 5);
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2 + rand() * 0.06;
    const inner = irisR * (0.35 + rand() * 0.1);
    const outer = irisR * (0.92 + rand() * 0.06);
    const brown = 60 + rand() * 70;
    ctx.strokeStyle = i % 7 === 0
      ? `rgba(180,30,20,${0.5 + blood * 0.4})`
      : `rgba(${brown},${brown * 0.45},${brown * 0.3},0.85)`;
    ctx.lineWidth = 1 + rand() * 1.2;
    ctx.beginPath();
    ctx.moveTo(px + Math.cos(a) * inner, py + Math.sin(a) * inner);
    ctx.lineTo(px + Math.cos(a) * outer, py + Math.sin(a) * outer);
    ctx.stroke();
  }

  // Iris base wash + limbal ring
  const wash = ctx.createRadialGradient(px, py, irisR * 0.2, px, py, irisR);
  wash.addColorStop(0, 'rgba(120,40,20,0.55)');
  wash.addColorStop(0.7, 'rgba(60,15,10,0.5)');
  wash.addColorStop(0.92, 'rgba(10,0,0,0.9)');
  wash.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = wash;
  ctx.beginPath();
  ctx.arc(px, py, irisR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(5,0,0,0.95)';
  ctx.lineWidth = Math.max(2, radius * 0.09);
  ctx.beginPath();
  ctx.arc(px, py, irisR, 0, Math.PI * 2);
  ctx.stroke();

  // Pupil + inner shadow
  const pupilR = irisR * (0.52 - blood * 0.08);
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(px, py, pupilR, 0, Math.PI * 2);
  ctx.fill();

  // Dual catchlights — what sells "real"
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(px - pupilR * 0.35, py - pupilR * 0.4, pupilR * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath();
  ctx.arc(px + pupilR * 0.4, py + pupilR * 0.45, pupilR * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Wet lower-lid line
  ctx.strokeStyle = 'rgba(255,240,230,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.97, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  ctx.restore();
}
