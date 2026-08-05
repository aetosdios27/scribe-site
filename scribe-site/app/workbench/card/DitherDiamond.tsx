"use client";

import { useEffect, useRef } from "react";

export function DitherDiamond() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const pitch = Math.max(22, Math.min(30, rect.width * 0.065));
      const angle = Math.PI / 4;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // An oversized upper diamond: the apex and right corner both bleed
      // beyond the card, leaving only the crown visible in the frame.
      const centerX = rect.width * 0.68;
      const apexY = -rect.height * 0.1;
      const seamY = rect.height * 0.43;
      const halfWidth = seamY - apexY;

      const toneAt = (x: number, y: number) => {
        if (y < apexY || y > seamY) return 0;

        const progress = (y - apexY) / (seamY - apexY);
        const span = progress * halfWidth;
        const offset = x - centerX;
        if (Math.abs(offset) > span) return 0;

        const position = span === 0 ? 0 : offset / span;

        if (position < -0.42) return 0.3;
        if (position < -0.08) return 0.72;
        if (position < 0.22) return 0.18;
        if (position < 0.62) return 0.56;
        return 0.88;
      };

      context.fillStyle = "#173bff";

      const diagonal = Math.hypot(rect.width, rect.height);
      for (let gridY = -diagonal; gridY <= diagonal; gridY += pitch) {
        for (let gridX = -diagonal; gridX <= diagonal; gridX += pitch) {
          const x = centerX + gridX * cos - gridY * sin;
          const y = seamY + gridX * sin + gridY * cos;
          const tone = toneAt(x, y);
          if (tone === 0) continue;

          // AM halftone: screen spacing stays fixed while darker facets
          // receive larger dots. Area, rather than radius, tracks the tone.
          const radius = pitch * 0.47 * Math.sqrt(tone);
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="A zoomed cobalt dither pattern forming the cropped top half of a diamond"
      className="absolute inset-0 size-full"
    />
  );
}
