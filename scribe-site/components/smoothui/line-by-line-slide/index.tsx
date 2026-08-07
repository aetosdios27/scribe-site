"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useSyncExternalStore } from "react";

export interface LineByLineSlideProps {
  children?: string;
  className?: string;
  delay?: number;
  lines?: string[];
  stagger?: number;
  triggerOnView?: boolean;
}

const DURATION_S = 0.9;
const MS = 1000;
const EASE = [0.22, 1, 0.36, 1] as const;
const VISIBLE = { opacity: 1, x: 0 };
const HIDDEN = { opacity: 0, x: -48 };
const subscribe = () => () => undefined;

export default function LineByLineSlide({
  children,
  lines: linesProp,
  className,
  delay = 0,
  stagger = 120,
  triggerOnView = false,
}: LineByLineSlideProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const shouldReduceMotion = useReducedMotion();
  // Server markup stays visible without JavaScript. React switches to the
  // animated snapshot only after hydration, without an effect-driven render.
  const motionReady = useSyncExternalStore(subscribe, () => true, () => false);

  const lines = linesProp ?? (children ? children.split("\n") : []);
  const label = lines.join(" ");
  const staticText = !motionReady || shouldReduceMotion;
  const play = staticText || !triggerOnView || inView;

  return (
    <span aria-label={label} className={className} ref={ref}>
      {lines.map((line, index) => (
        <motion.span
          animate={play ? VISIBLE : HIDDEN}
          aria-hidden="true"
          initial={false}
          key={line}
          style={{ display: "block" }}
          transition={
            staticText
              ? { duration: 0 }
              : {
                  delay: delay / MS + (index * stagger) / MS,
                  duration: DURATION_S,
                  ease: EASE,
                }
          }
        >
          {line}
        </motion.span>
      ))}
    </span>
  );
}
