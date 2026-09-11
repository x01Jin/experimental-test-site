/**
 * Single-purpose module: Procedural horrific face and eye rendering algorithms.
 * Renders grotesque uncanny grinning faces, dilated staring eyes, and
 * glitch-sliced nightmarish entities directly to Canvas.
 */

export interface NightmareFaceOptions {
  width: number;
  height: number;
  intensity: number;
  variant: 'screaming-void' | 'bloody-grin' | 'corrupted-husk' | 'skull-demon';
  seed?: number;
  time?: number;
}

/**
 * Draws an intense procedural jumpscare face onto a canvas 2D context
 */
export function drawNightmareFace(
  ctx: CanvasRenderingContext2D,
  options: NightmareFaceOptions
): void {
  const { width, height, intensity, variant, time = performance.now() } = options;
  const cx = width / 2;
  const cy = height / 2;

  ctx.save();

  // Dark or inverted bloody backdrop
  if (variant === 'screaming-void') {
    ctx.fillStyle = '#050002';
    ctx.fillRect(0, 0, width, height);
  } else if (variant === 'bloody-grin') {
    ctx.fillStyle = '#1a0003';
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, width, height);
  }

  // Draw asynchronous pulsing veins in background
  ctx.strokeStyle = `rgba(180, 10, 10, ${0.2 + (Math.sin(time * 0.01) * 0.15)})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    const angle = (i / 12) * Math.PI * 2;
    const startR = Math.min(width, height) * 0.25;
    const sx = cx + Math.cos(angle) * startR;
    const sy = cy + Math.sin(angle) * startR;
    ctx.moveTo(sx, sy);
    const endX = cx + Math.cos(angle + (Math.random() - 0.5) * 0.4) * (width * 0.8);
    const endY = cy + Math.sin(angle + (Math.random() - 0.5) * 0.4) * (height * 0.8);
    ctx.quadraticCurveTo(
      sx + (Math.random() - 0.5) * 80,
      sy + (Math.random() - 0.5) * 80,
      endX,
      endY
    );
    ctx.stroke();
  }

  // Face head oval (elongated, uncanny, distorted)
  const faceW = Math.min(width, height) * 0.48;
  const faceH = Math.min(width, height) * 0.72;

  const skinGrad = ctx.createRadialGradient(cx, cy, faceW * 0.2, cx, cy, faceH * 0.7);
  if (variant === 'bloody-grin') {
    skinGrad.addColorStop(0, '#ece5d8');
    skinGrad.addColorStop(0.7, '#6b2020');
    skinGrad.addColorStop(1, '#0c0002');
  } else {
    skinGrad.addColorStop(0, '#f2f2f2');
    skinGrad.addColorStop(0.6, '#555555');
    skinGrad.addColorStop(1, '#000000');
  }

  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + faceH * 0.05, faceW * 0.5, faceH * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye Sockets (Deep hollow cavities)
  const eyeOffsetY = cy - faceH * 0.12;
  const eyeSpacing = faceW * 0.26;
  const eyeRadiusX = faceW * 0.14;
  const eyeRadiusY = faceH * 0.18;

  // Left Eye Socket
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(cx - eyeSpacing, eyeOffsetY, eyeRadiusX, eyeRadiusY, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Right Eye Socket
  ctx.beginPath();
  ctx.ellipse(cx + eyeSpacing, eyeOffsetY, eyeRadiusX, eyeRadiusY, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Bleeding Red Eyes / Pupils
  const jitterX = (Math.random() - 0.5) * 6 * intensity;
  const jitterY = (Math.random() - 0.5) * 6 * intensity;

  // Tiny pinprick glowing pupils
  ctx.fillStyle = '#ff1111';
  ctx.beginPath();
  ctx.arc(cx - eyeSpacing + jitterX, eyeOffsetY + jitterY, 5 + Math.random() * 4, 0, Math.PI * 2);
  ctx.arc(cx + eyeSpacing + jitterX, eyeOffsetY + jitterY, 5 + Math.random() * 4, 0, Math.PI * 2);
  ctx.fill();

  // Tears of blood pouring from eyes
  ctx.fillStyle = 'rgba(180, 0, 0, 0.85)';
  for (let side of [-1, 1]) {
    const eyeX = cx + side * eyeSpacing;
    for (let t = 0; t < 3; t++) {
      const dropX = eyeX + (t - 1) * 8 + (Math.random() - 0.5) * 4;
      const dropLen = 50 + Math.random() * 120 * intensity;
      ctx.beginPath();
      ctx.moveTo(dropX, eyeOffsetY + eyeRadiusY * 0.7);
      ctx.lineTo(dropX + (Math.random() - 0.5) * 6, eyeOffsetY + dropLen);
      ctx.lineWidth = 3 + Math.random() * 2;
      ctx.strokeStyle = '#990000';
      ctx.stroke();
    }
  }

  // Mouth: Stretched, gaping screaming void OR grotesque wide smile with needle teeth
  const mouthY = cy + faceH * 0.26;
  const mouthW = faceW * (0.45 + (Math.sin(time * 0.02) * 0.05 + 0.05));
  const mouthH = faceH * (variant === 'screaming-void' ? 0.32 : 0.22);

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(cx, mouthY, mouthW, mouthH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#550000';
  ctx.stroke();

  // Needle Sharp Jagged Teeth
  ctx.fillStyle = '#ffeedd';
  const toothCount = 18;
  // Top teeth
  for (let i = 0; i < toothCount; i++) {
    const tx = cx - mouthW * 0.9 + (i / (toothCount - 1)) * (mouthW * 1.8);
    const ty = mouthY - mouthH * 0.6;
    const toothLength = (15 + Math.random() * 20) * (1 - Math.abs(i - toothCount / 2) / (toothCount * 0.7));
    ctx.beginPath();
    ctx.moveTo(tx - 3, ty);
    ctx.lineTo(tx + 3, ty);
    ctx.lineTo(tx, ty + toothLength);
    ctx.closePath();
    ctx.fill();
  }

  // Bottom teeth
  for (let i = 0; i < toothCount; i++) {
    const tx = cx - mouthW * 0.9 + (i / (toothCount - 1)) * (mouthW * 1.8);
    const ty = mouthY + mouthH * 0.6;
    const toothLength = (14 + Math.random() * 18) * (1 - Math.abs(i - toothCount / 2) / (toothCount * 0.7));
    ctx.beginPath();
    ctx.moveTo(tx - 3, ty);
    ctx.lineTo(tx + 3, ty);
    ctx.lineTo(tx, ty - toothLength);
    ctx.closePath();
    ctx.fill();
  }

  // Glitch Slices: Displace random horizontal bands across the face
  const sliceCount = Math.floor(6 + intensity * 8);
  for (let s = 0; s < sliceCount; s++) {
    const sliceY = Math.random() * height;
    const sliceH = 4 + Math.random() * 20;
    const sliceShift = (Math.random() - 0.5) * 45 * intensity;

    const imgData = ctx.getImageData(0, Math.floor(sliceY), width, Math.floor(sliceH));
    ctx.putImageData(imgData, Math.floor(sliceShift), Math.floor(sliceY));
  }

  // Random static noise overlay on top of face
  const noiseCount = Math.floor(width * height * 0.008 * intensity);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let n = 0; n < noiseCount; n++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  ctx.restore();
}

/**
 * Draws a single tracking bloodshot eye on a canvas
 */
export function drawTrackingEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  targetX: number,
  targetY: number,
  bloodshotIntensity = 0.5
): void {
  ctx.save();

  // Sclera (eyeball white, slightly yellowed/gray)
  ctx.fillStyle = '#f0ede6';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Eye shadow contour
  const eyeGrad = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius);
  eyeGrad.addColorStop(0, 'rgba(0,0,0,0)');
  eyeGrad.addColorStop(1, 'rgba(60,10,10,0.7)');
  ctx.fillStyle = eyeGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Red Capillaries / Veins branching into sclera
  const veinCount = Math.floor(6 + bloodshotIntensity * 10);
  ctx.strokeStyle = 'rgba(190, 20, 20, 0.75)';
  ctx.lineWidth = 1.2;
  for (let v = 0; v < veinCount; v++) {
    const angle = (v / veinCount) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    const midR = radius * (0.4 + Math.random() * 0.3);
    ctx.lineTo(
      cx + Math.cos(angle + (Math.random() - 0.5) * 0.3) * midR,
      cy + Math.sin(angle + (Math.random() - 0.5) * 0.3) * midR
    );
    ctx.stroke();
  }

  // Calculate pupil offset pointing towards target (mouse or touch)
  const dx = targetX - cx;
  const dy = targetY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxPupilOffset = radius * 0.42;
  const pupilAngle = Math.atan2(dy, dx);
  const pupilDistance = Math.min(dist * 0.08, maxPupilOffset);

  const pupilX = cx + Math.cos(pupilAngle) * pupilDistance;
  const pupilY = cy + Math.sin(pupilAngle) * pupilDistance;

  // Iris
  const irisRadius = radius * 0.44;
  const irisGrad = ctx.createRadialGradient(pupilX, pupilY, 2, pupilX, pupilY, irisRadius);
  irisGrad.addColorStop(0, '#ff1a1a');
  irisGrad.addColorStop(0.5, '#7a0505');
  irisGrad.addColorStop(1, '#1a0000');

  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.arc(pupilX, pupilY, irisRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pupil (Hollow, black)
  const pupilRadius = irisRadius * 0.5;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2);
  ctx.fill();

  // Glint reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.arc(pupilX - pupilRadius * 0.35, pupilY - pupilRadius * 0.35, pupilRadius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
