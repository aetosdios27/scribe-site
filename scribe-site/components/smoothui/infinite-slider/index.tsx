"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";

export interface InfiniteSliderProps {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  reverse?: boolean;
  speed?: number;
}

export default function InfiniteSlider({
  children,
  className,
  gap = 32,
  reverse = false,
  speed = 18,
}: InfiniteSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [sequenceRef, { width }] = useMeasure();
  const translation = useMotionValue(0);
  const isInView = useInView(viewportRef, { amount: 0.05 });
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const distance = width + gap;
    if (!distance || shouldReduceMotion || isPaused || !isInView) return;

    if (reverse && translation.get() === 0) translation.set(-distance);

    const boundary = reverse ? 0 : -distance;
    const remaining = Math.abs(boundary - translation.get());
    const controls = animate(translation, boundary, {
      duration: remaining / speed,
      ease: "linear",
      onComplete: () => {
        translation.set(reverse ? -distance : 0);
        setCycle((value) => value + 1);
      },
    });

    return () => controls.stop();
  }, [cycle, gap, isInView, isPaused, reverse, shouldReduceMotion, speed, translation, width]);

  return (
    <div
      className={className}
      ref={viewportRef}
      onBlurCapture={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="infinite-slider-track"
        style={{ gap, x: translation }}
      >
        <div className="infinite-slider-sequence" ref={sequenceRef}>
          {children}
        </div>
        <div aria-hidden="true" className="infinite-slider-sequence">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
