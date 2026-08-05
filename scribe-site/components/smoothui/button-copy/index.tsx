"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "failed";
type WriteText = (value: string) => Promise<void>;

export async function copyToClipboard(
  value: string,
  writeText: WriteText = (text) => navigator.clipboard.writeText(text),
): Promise<Exclude<CopyState, "idle">> {
  try {
    await writeText(value);
    return "copied";
  } catch {
    return "failed";
  }
}

export interface ButtonCopyProps {
  value: string;
  idleLabel?: string;
  className?: string;
  resetAfter?: number;
}

const labels: Record<CopyState, string> = {
  idle: "copy",
  copied: "copied",
  failed: "copy failed",
};

export default function ButtonCopy({
  value,
  idleLabel = "copy",
  className,
  resetAfter = 2400,
}: ButtonCopyProps) {
  const [state, setState] = useState<CopyState>("idle");
  const pendingRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    try {
      setState(await copyToClipboard(value));
    } finally {
      pendingRef.current = false;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setState("idle"), resetAfter);
    }
  }, [resetAfter, value]);

  const visibleLabel = state === "idle" ? idleLabel : labels[state];
  const announcement =
    state === "copied"
      ? "Scribe install command copied"
      : state === "failed"
        ? "Copy failed. Select the install command and copy it manually."
        : "";

  return (
    <span className="button-copy-root">
      <button
        aria-label="Copy Scribe alpha install command"
        className={className}
        data-copy-state={state}
        onClick={handleCopy}
        type="button"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 3 }}
            initial={shouldReduceMotion ? false : { opacity: 0, y: -3 }}
            key={state}
            transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
          >
            {visibleLabel}
          </motion.span>
        </AnimatePresence>
      </button>
      <span aria-live="polite" className="sr-only" role="status">
        {announcement}
      </span>
    </span>
  );
}
