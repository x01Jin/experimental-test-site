/**
 * Single-purpose component: Horror background canvas.
 * Renders twitching bloodshot eyes that track user pointer,
 * creeping veins on viewport boundaries, and shadow anomalies.
 */

import React, { useEffect, useRef } from 'react';
import { drawTrackingEye } from '../effects/nightmareFaces';

interface HorrorCanvasProps {
  corruptionLevel: number;
  depthMeters: number;
}

interface EyeInstance {
  id: number;
  xRatio: number; // 0 to 1 of screen width
  yRatio: number; // 0 to 1 of screen height
  radius: number;
  blinkOffset: number;
  isBlinking: boolean;
}

export const HorrorCanvas: React.FC<HorrorCanvasProps> = ({ corruptionLevel, depthMeters }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const eyesRef = useRef<EyeInstance[]>([]);
  const paramsRef = useRef({ corruptionLevel, depthMeters });

  useEffect(() => {
    paramsRef.current = { corruptionLevel, depthMeters };
  }, [corruptionLevel, depthMeters]);

  // Track mouse coordinates across the screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Update eyes in ref as corruption grows (no React state re-renders needed)
  useEffect(() => {
    const targetEyeCount = Math.floor(1 + (corruptionLevel / 100) * 13);
    const newEyes: EyeInstance[] = [];

    for (let i = 0; i < targetEyeCount; i++) {
      const angle = (i / targetEyeCount) * Math.PI * 2;
      const dist = 0.35 + ((i * 7) % 5) * 0.08;
      const x = 0.5 + Math.cos(angle) * dist;
      const y = 0.5 + Math.sin(angle) * dist;

      newEyes.push({
        id: i,
        xRatio: Math.max(0.08, Math.min(0.92, x)),
        yRatio: Math.max(0.08, Math.min(0.92, y)),
        radius: 14 + ((i * 13) % 18) + (corruptionLevel > 50 ? 6 : 0),
        blinkOffset: Math.random() * 5000,
        isBlinking: false
      });
    }

    eyesRef.current = newEyes;
  }, [corruptionLevel]);

  // Main canvas render loop - mounts once and continuously draws
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };

    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    resize();

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      const { corruptionLevel: currentCorruption, depthMeters: currentDepth } = paramsRef.current;

      // Draw Creeping Veins on edges if depth > 150m
      if (currentDepth > 150) {
        const veinOpacity = Math.min(0.8, (currentCorruption / 100) * 0.9);
        ctx.strokeStyle = `rgba(130, 0, 10, ${veinOpacity})`;
        ctx.lineWidth = 1.5;

        const pulse = Math.sin(time * 0.003) * 8;
        // Top and bottom margin tendrils
        for (let i = 0; i < 8; i++) {
          const startX = (w / 8) * i;
          ctx.beginPath();
          ctx.moveTo(startX, 0);
          ctx.bezierCurveTo(
            startX + 15,
            30 + pulse + (i % 3) * 10,
            startX - 20,
            60 + pulse,
            startX + 5,
            80 + (currentCorruption * 0.6)
          );
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(startX, h);
          ctx.bezierCurveTo(
            startX - 15,
            h - 30 - pulse,
            startX + 20,
            h - 60 - pulse,
            startX - 5,
            h - 80 - (currentCorruption * 0.6)
          );
          ctx.stroke();
        }
      }

      // Draw tracking eyes
      for (const eye of eyesRef.current) {
        const ex = eye.xRatio * w;
        const ey = eye.yRatio * h;

        // Random twitchy blinking
        const blinkCycle = (time + eye.blinkOffset) % 4000;
        const isBlink = blinkCycle < 140;

        if (isBlink) {
          // Closed eyelid crease
          ctx.strokeStyle = '#3a0808';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(ex, ey, eye.radius, 0.2, Math.PI - 0.2);
          ctx.stroke();
        } else {
          drawTrackingEye(
            ctx,
            ex,
            ey,
            eye.radius,
            mx,
            my,
            currentCorruption / 100
          );
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="horror-canvas-container"
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-80 transition-opacity duration-700"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};
