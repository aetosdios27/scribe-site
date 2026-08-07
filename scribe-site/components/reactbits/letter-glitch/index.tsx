"use client";

import { useEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface GlitchLetter {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
}

export interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  smooth?: boolean;
  characters?: string;
}

const FONT_SIZE = 16;
const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 20;

export default function LetterGlitch({
  glitchColors = ["#f7f6f1", "#ffffff", "#c9d4ff"],
  glitchSpeed = 50,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lettersRef = useRef<GlitchLetter[]>([]);
  const gridRef = useRef({ columns: 0, rows: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTimeRef = useRef(0);

  const glyphs = Array.from(characters);

  const getRandomChar = () =>
    glyphs[Math.floor(Math.random() * glyphs.length)];

  const getRandomColor = () =>
    glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const hexToRgb = (hex: string) => {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const full = hex.replace(shorthand, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number,
  ) => {
    const rgb = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    };
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  };

  const initializeLetters = (columns: number, rows: number) => {
    gridRef.current = { columns, rows };
    lettersRef.current = Array.from({ length: columns * rows }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || lettersRef.current.length === 0) return;

    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.textBaseline = "top";

    lettersRef.current.forEach((letter, index) => {
      const x = (index % gridRef.current.columns) * CHAR_WIDTH;
      const y = Math.floor(index / gridRef.current.columns) * CHAR_HEIGHT;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = () => {
    if (lettersRef.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(lettersRef.current.length * 0.05));
    for (let i = 0; i < updateCount; i += 1) {
      const index = Math.floor(Math.random() * lettersRef.current.length);
      const letter = lettersRef.current[index];
      if (!letter) continue;

      letter.char = getRandomChar();
      letter.targetColor = getRandomColor();
      letter.colorProgress = smooth ? 0 : 1;
      if (!smooth) letter.color = letter.targetColor;
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    lettersRef.current.forEach((letter) => {
      if (letter.colorProgress >= 1) return;
      letter.colorProgress += 0.05;
      if (letter.colorProgress > 1) letter.colorProgress = 1;

      const startRgb = hexToRgb(letter.color);
      const endRgb = hexToRgb(letter.targetColor);
      if (startRgb && endRgb) {
        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
        needsRedraw = true;
      }
    });
    if (needsRedraw) drawLetters();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    contextRef.current = canvas.getContext("2d");

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initializeLetters(
        Math.max(1, Math.ceil(rect.width / CHAR_WIDTH)),
        Math.max(1, Math.ceil(rect.height / CHAR_HEIGHT)),
      );
      drawLetters();
    };

    resizeCanvas();

    const tick = () => {
      const now = Date.now();
      if (now - lastGlitchTimeRef.current >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTimeRef.current = now;
      }
      if (smooth) handleSmoothTransitions();
      animationRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!reducedMotion.matches && animationRef.current === null) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };
    const stopLoop = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    startLoop();

    const reducedMotionChanged = () => {
      if (reducedMotion.matches) {
        stopLoop();
      } else {
        startLoop();
      }
    };
    reducedMotion.addEventListener("change", reducedMotionChanged);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      stopLoop();
      reducedMotion.removeEventListener("change", reducedMotionChanged);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth]);

  return (
    <div className="letter-glitch">
      <canvas ref={canvasRef} />
    </div>
  );
}
