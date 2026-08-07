"use client";

import { motion, useInView } from "motion/react";
import { useRef, useSyncExternalStore } from "react";

export interface ShimmerSweepProps {
  children: string;
  className?: string;
  delay?: number;
  triggerOnView?: boolean;
}

const DURATION_S = 0.85;
const MS = 1000;
const EASE = [0.22, 1, 0.36, 1] as const;
const VISIBLE = { filter: "blur(0px)", opacity: 1, x: 0 };
const HIDDEN = { filter: "blur(8px)", opacity: 0, x: -22 };
const subscribe = () => () => undefined;

export default function ShimmerSweep({
  children,
  className,
  delay = 0,
  triggerOnView = false,
}: ShimmerSweepProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  // Server markup stays visible without JavaScript. React switches to the
  // animated snapshot only after hydration, without an effect-driven render.
  const motionReady = useSyncExternalStore(subscribe, () => true, () => false);

  const staticText = !motionReady;
  const play = staticText || !triggerOnView || inView;

  return (
    <span aria-label={children} className={className} ref={ref}>
      <motion.span
        animate={play ? VISIBLE : HIDDEN}
        aria-hidden="true"
        initial={false}
        style={{ display: "inline-block" }}
        transition={
          staticText
            ? { duration: 0 }
            : { delay: delay / MS, duration: DURATION_S, ease: EASE }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}
