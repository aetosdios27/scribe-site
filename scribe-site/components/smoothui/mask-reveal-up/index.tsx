"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useSyncExternalStore } from "react";

export interface MaskRevealUpProps {
  lines: readonly string[];
  className?: string;
  delay?: number;
  stagger?: number;
}

const VISIBLE = { opacity: 1, y: 0 };
const HIDDEN = { opacity: 0, y: 18 };
const EASE = [0.22, 1, 0.36, 1] as const;
const subscribe = () => () => undefined;

export default function MaskRevealUp({
  lines,
  className,
  delay = 0,
  stagger = 0.08,
}: MaskRevealUpProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(rootRef, { amount: 0.25, once: true });
  const shouldReduceMotion = useReducedMotion();
  // Server markup stays visible without JavaScript. React switches to the
  // animated snapshot only after hydration, without an effect-driven render.
  const motionReady = useSyncExternalStore(subscribe, () => true, () => false);

  const staticText = !motionReady || shouldReduceMotion;

  return (
    <span className={className} ref={rootRef}>
      {lines.map((line, index) => (
        <span className="mask-reveal-line" key={line}>
          <motion.span
            animate={staticText || isInView ? VISIBLE : HIDDEN}
            initial={false}
            transition={
              staticText
                ? { duration: 0 }
                : {
                    delay: delay + index * stagger,
                    duration: 0.62,
                    ease: EASE,
                  }
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
