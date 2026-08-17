"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/* vendored from interior.dev (ddoemonn/interior, MIT) — behaviour kept,
   styling reskinned to scribe tokens. upstream patterns: latest-ref writes
   during render and setState-in-effect are intentional there. */
/* eslint-disable react-hooks/refs */

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const CROSSFADE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const INSTANT = { duration: 0 } as const;

export type CopyStatus = "idle" | "copied" | "error";

export type UseCopyToClipboardOptions = {
  timeout?: number;
  onCopy?: (value: string) => void;
  onError?: (reason: unknown) => void;
};

function writeFallback(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);

  const selection = document.getSelection();
  const previous =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  document.body.removeChild(area);
  if (selection && previous) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }
  return ok;
}

export function useCopyToClipboard({
  timeout = 2400,
  onCopy,
  onError,
}: UseCopyToClipboardOptions = {}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [ticket, setTicket] = useState(0);

  const mounted = useRef(true);
  const copied = useRef(onCopy);
  copied.current = onCopy;
  const failed = useRef(onError);
  failed.current = onError;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setTicket(0);
  }, []);

  const copy = useCallback(async (text: string) => {
    if (!text) return false;

    let ok = false;
    let reason: unknown = null;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      } else {
        ok = writeFallback(text);
      }
    } catch (error) {
      reason = error;
      try {
        ok = writeFallback(text);
      } catch {
        ok = false;
      }
    }

    if (!mounted.current) return ok;

    setStatus(ok ? "copied" : "error");
    setTicket((t) => t + 1);

    if (ok) copied.current?.(text);
    else failed.current?.(reason);

    return ok;
  }, []);

  useEffect(() => {
    if (ticket === 0 || status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), timeout);
    return () => clearTimeout(id);
  }, [ticket, status, timeout]);

  return { copy, reset, status, copied: status === "copied" };
}

export type CopyButtonProps = {
  value: string;
  label?: React.ReactNode;
  copiedLabel?: React.ReactNode;
  errorLabel?: React.ReactNode;
  ariaLabel?: string;
  copiedAnnounce?: string;
  errorAnnounce?: string;
  timeout?: number;
  onCopy?: (value: string) => void;
  onError?: (reason: unknown) => void;
  disabled?: boolean;
  className?: string;
};

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Failed",
  ariaLabel,
  copiedAnnounce,
  errorAnnounce,
  timeout = 2400,
  onCopy,
  onError,
  disabled = false,
  className = "",
}: CopyButtonProps) {
  const { copy, status } = useCopyToClipboard({ timeout, onCopy, onError });
  const reduced = useReducedMotion();

  const fade = reduced ? INSTANT : CROSSFADE;

  const labels: Array<[CopyStatus, React.ReactNode]> = [
    ["idle", label],
    ["copied", copiedLabel],
    ["error", errorLabel],
  ];

  return (
    <motion.button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      data-copy-state={status === "error" ? "failed" : status}
      onClick={() => {
        void copy(value);
      }}
      whileTap={disabled || reduced ? undefined : { y: 1 }}
      transition={CELL}
      style={{ touchAction: "manipulation" }}
      className={`inline-flex select-none items-center gap-2 rounded-xs border border-scribe-cobalt bg-scribe-cobalt px-3 font-mono text-[13px] font-semibold tracking-tight text-scribe-paper outline-none transition-colors duration-150 hover:border-scribe-cobalt-dark hover:bg-scribe-cobalt-dark focus-visible:border-scribe-ink focus-visible:outline-2 focus-visible:outline-scribe-cobalt disabled:opacity-50 ${className}`}
    >
      <span aria-hidden="true" className="relative grid">
        {labels.map(([key, text]) => (
          <motion.span
            key={key}
            initial={false}
            animate={
              key === status
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 3, filter: "blur(3px)" }
            }
            transition={fade}
            className="col-start-1 row-start-1 whitespace-nowrap"
          >
            {text}
          </motion.span>
        ))}
      </span>

      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied"
          ? copiedAnnounce ?? (typeof copiedLabel === "string" ? copiedLabel : "")
          : status === "error"
            ? errorAnnounce ?? (typeof errorLabel === "string" ? errorLabel : "")
            : ""}
      </span>
    </motion.button>
  );
}
