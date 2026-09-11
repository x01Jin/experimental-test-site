/**
 * Single-purpose module: Dynamic image corruption pipeline.
 * Performs real-time pixelation, RGB channel displacement, horizontal glitch slicing,
 * solarization, demonic eye/vein overlays, and high-contrast color crushing
 * scaled directly to scroll depth and corruption severity.
 */

export interface CorruptionOptions {
  severity: number; // 0.0 (subtle) to 1.0+ (abyssal chaos)
  timeSeed: number;
  category?: 'portrait' | 'surveillance' | 'medical' | 'architecture' | 'specimen';
  enableDemonicFeatures?: boolean;
}

/**
 * Draws procedural horror artifact onto canvas when image loading or CORS restricts raw pixel access
 */
function renderProceduralFallback(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  severity: number,
  category: string,
  timeSeed: number
): void {
  // Dark vintage background
  ctx.fillStyle = severity > 0.6 ? '#150000' : '#080808';
  ctx.fillRect(0, 0, width, height);

  // Background static noise
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const noiseAmount = Math.min(255, 30 + severity * 120);

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * noiseAmount;
    data[i] = severity > 0.5 ? val * 1.3 : val; // R
    data[i + 1] = severity > 0.7 ? val * 0.2 : val * 0.8; // G
    data[i + 2] = severity > 0.7 ? val * 0.2 : val * 0.8; // B
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  // Silhouette / biometric wireframe
  ctx.save();
  ctx.strokeStyle = severity > 0.6 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(156, 163, 175, 0.6)';
  ctx.lineWidth = 2;

  const cx = width / 2;
  const cy = height / 2;

  if (category === 'portrait') {
    // Eerie head silhouette
    ctx.beginPath();
    ctx.ellipse(cx, cy - 10, width * 0.22, height * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#050505';
    ctx.fill();
    ctx.stroke();

    // Sunken eye sockets
    const eyeOffsetX = width * 0.09;
    const eyeY = cy - 18;
    ctx.fillStyle = severity > 0.5 ? '#7f1d1d' : '#000000';
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffsetX, eyeY, 8, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + eyeOffsetX, eyeY, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing needle pupils at high severity
    if (severity > 0.3) {
      ctx.fillStyle = '#ff2222';
      ctx.beginPath();
      ctx.arc(cx - eyeOffsetX + Math.sin(timeSeed) * 2, eyeY, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffsetX + Math.sin(timeSeed) * 2, eyeY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (category === 'surveillance') {
    // CCTV grid and timestamp overlay
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`CAM-0${(timeSeed % 8) + 1} // SIGNAL DECAY: ${(severity * 100).toFixed(1)}%`, 14, 20);
  } else {
    // Abstract geometric containment diagram
    ctx.beginPath();
    ctx.arc(cx, cy, width * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeRect(cx - width * 0.2, cy - height * 0.2, width * 0.4, height * 0.4);
  }

  ctx.restore();
}

/**
 * Main corruption rendering routine
 */
export function corruptImageOnCanvas(
  source: HTMLImageElement | null,
  canvas: HTMLCanvasElement,
  options: CorruptionOptions
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const { severity, timeSeed, category = 'portrait', enableDemonicFeatures = true } = options;
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  let pixelManipulationAllowed = false;

  if (source && source.complete && source.naturalWidth > 0) {
    try {
      // Step 1: Pixelation (Downsampling & Upscaling)
      // At low severity (0.05-0.2): subtle pixelation (down to 120-180px)
      // At medium severity (0.2-0.6): noticeable mosaic (down to 60-90px)
      // At abyssal severity (0.6-1.0+): heavy chunky pixelation (down to 25-45px)
      const pixelSteps = Math.max(
        20,
        Math.floor(width * (1 - Math.min(0.92, severity * 0.88)))
      );
      const pixelHeight = Math.max(
        15,
        Math.floor(height * (1 - Math.min(0.92, severity * 0.88)))
      );

      // Create offscreen buffer for pixelation downsample
      const offscreen = document.createElement('canvas');
      offscreen.width = pixelSteps;
      offscreen.height = pixelHeight;
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        offCtx.imageSmoothingEnabled = false;
        offCtx.drawImage(source, 0, 0, pixelSteps, pixelHeight);

        // Draw back scaled up with nearest-neighbor smoothing disabled
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offscreen, 0, 0, width, height);
      } else {
        ctx.drawImage(source, 0, 0, width, height);
      }

      // Test if pixel manipulation is permitted (CORS test)
      ctx.getImageData(0, 0, 1, 1);
      pixelManipulationAllowed = true;
    } catch {
      // CORS block encountered: Fall back to procedural nightmare with source as background
      pixelManipulationAllowed = false;
      renderProceduralFallback(ctx, width, height, severity, category, timeSeed);
    }
  } else {
    // No source image yet: render procedural creepy visual
    renderProceduralFallback(ctx, width, height, severity, category, timeSeed);
    return;
  }

  // If pixel manipulation is allowed, apply advanced channel manipulation and block corruptions
  if (pixelManipulationAllowed) {
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const totalPixels = width * height;

      // 1. RGB Channel Splitting & Color Distortion
      if (severity > 0.12) {
        const offsetPixels = Math.floor(severity * 14);
        const copy = new Uint8ClampedArray(data);

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;

            // Shift red channel left
            const rx = Math.max(0, x - offsetPixels);
            const ri = (y * width + rx) * 4;
            data[i] = copy[ri]; // Red from left

            // Shift blue channel right
            const bx = Math.min(width - 1, x + offsetPixels);
            const bi = (y * width + bx) * 4;
            data[i + 2] = copy[bi + 2]; // Blue from right

            // At deeper levels, crush green channel and boost red
            if (severity > 0.5) {
              data[i + 1] = Math.floor(copy[i + 1] * (1 - (severity - 0.5) * 0.8));
              data[i] = Math.min(255, Math.floor(data[i] * (1 + (severity - 0.5) * 0.9)));
            }
          }
        }
      }

      // 2. Solarized / Inverted Random Patches
      if (severity > 0.35) {
        const patchCount = Math.floor(severity * 4);
        for (let p = 0; p < patchCount; p++) {
          const patchX = Math.floor(Math.random() * (width - 60));
          const patchY = Math.floor(Math.random() * (height - 40));
          const patchW = Math.floor(30 + Math.random() * 50);
          const patchH = Math.floor(20 + Math.random() * 30);

          for (let py = patchY; py < Math.min(height, patchY + patchH); py++) {
            for (let px = patchX; px < Math.min(width, patchX + patchW); px++) {
              const idx = (py * width + px) * 4;
              data[idx] = 255 - data[idx];         // Invert Red
              data[idx + 1] = 255 - data[idx + 1]; // Invert Green
              data[idx + 2] = 255 - data[idx + 2]; // Invert Blue
            }
          }
        }
      }

      // 3. Digital Compression Macroblock / Void Dropouts
      if (severity > 0.55) {
        const blockDrops = Math.floor(severity * 5);
        for (let b = 0; b < blockDrops; b++) {
          const bx = Math.floor(Math.random() * (width - 50));
          const by = Math.floor(Math.random() * (height - 30));
          const bw = Math.floor(20 + Math.random() * 60);
          const bh = Math.floor(8 + Math.random() * 25);
          const isMagenta = Math.random() < 0.3;

          for (let y = by; y < Math.min(height, by + bh); y++) {
            for (let x = bx; x < Math.min(width, bx + bw); x++) {
              const idx = (y * width + x) * 4;
              if (isMagenta) {
                data[idx] = 255;
                data[idx + 1] = 0;
                data[idx + 2] = 220;
              } else {
                // Total black void dropout
                data[idx] = 10;
                data[idx + 1] = 0;
                data[idx + 2] = 0;
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
    } catch {
      // Ignore if putImageData fails
    }
  }

  // 4. Horizontal Glitch Slice Displacements (Canvas slice & blit)
  if (severity > 0.25) {
    const sliceCount = Math.floor(severity * 9);
    for (let s = 0; s < sliceCount; s++) {
      const sliceY = Math.floor(Math.random() * height);
      const sliceH = Math.floor(4 + Math.random() * (12 + severity * 20));
      const sliceDisp = (Math.random() - 0.5) * (severity * 36);

      ctx.drawImage(
        canvas,
        0, sliceY, width, sliceH,
        sliceDisp, sliceY, width, sliceH
      );
    }
  }

  // 5. Demonic Feature Overlays (Sunken Eye Cavities & Blood Tears)
  if (enableDemonicFeatures && severity > 0.45) {
    ctx.save();
    const cx = width / 2;
    const cy = height * 0.42;

    // Weeping blood tears running down
    ctx.strokeStyle = 'rgba(185, 28, 28, 0.85)';
    ctx.lineWidth = 2 + severity * 1.5;
    ctx.beginPath();
    // Left eye tear
    ctx.moveTo(cx - 30, cy);
    ctx.quadraticCurveTo(cx - 32, cy + 40, cx - 28, cy + 80 + severity * 30);
    // Right eye tear
    ctx.moveTo(cx + 30, cy);
    ctx.quadraticCurveTo(cx + 34, cy + 35, cx + 32, cy + 85 + severity * 30);
    ctx.stroke();

    // Hollow eye void cavities
    ctx.fillStyle = '#0a0000';
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy, 10 + severity * 4, 14 + severity * 5, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 30, cy, 10 + severity * 4, 14 + severity * 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing pinpoint red pupils
    ctx.fillStyle = '#ff1111';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx - 30 + Math.sin(timeSeed * 0.05) * 3, cy, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 30 + Math.sin(timeSeed * 0.05) * 3, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 6. Scanline Cuts & Film Grain Overlays
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1.5);
  }

  // Red border burn at high severity
  if (severity > 0.5) {
    ctx.strokeStyle = `rgba(220, 38, 38, ${Math.min(0.9, (severity - 0.4) * 1.5)})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);
  }
  ctx.restore();
}
