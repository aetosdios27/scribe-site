"use client";

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export interface ClickSparkProps {
  color?: string;
  size?: number;
  radius?: number;
  count?: number;
  duration?: number;
  extraScale?: number;
}

export default function ClickSpark({
  color = "#000000",
  size = 7,
  radius = 26,
  count = 10,
  duration = 480,
  extraScale = 1,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId: number | null = null;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = progress * (2 - progress);
        const distance = eased * radius * extraScale;
        const lineLength = size * (1 - progress);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animationId = requestAnimationFrame(draw);
      } else {
        animationId = null;
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const now = performance.now();
      const x = event.clientX;
      const y = event.clientY;
      for (let i = 0; i < count; i += 1) {
        sparksRef.current.push({
          x,
          y,
          angle: (2 * Math.PI * i) / count,
          startTime: now,
        });
      }
      if (animationId === null) {
        animationId = requestAnimationFrame(draw);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("pointerdown", handlePointerDown);
      if (animationId !== null) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [color, count, duration, extraScale, radius, size]);

  return (
    <canvas
      ref={canvasRef}
      className="click-spark-canvas"
      aria-hidden="true"
    />
  );
}
