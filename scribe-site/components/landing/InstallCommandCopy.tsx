"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SCRIBE_BOOTSTRAP_COMMAND } from "./install-command";

export type CopyState = "idle" | "copied" | "failed";

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

const stateLabels: Record<Exclude<CopyState, "idle">, string> = {
  copied: "copied",
  failed: "copy failed",
};

const announcements: Record<Exclude<CopyState, "idle">, string> = {
  copied: "Scribe install command copied",
  failed:
    "Copy failed. Select the install command and copy it manually.",
};

export interface InstallCommandCopyProps {
  variant: "nav" | "full";
  command?: string;
  label?: string;
  idleLabel?: string;
  ariaLabel?: string;
  className?: string;
}

function CopyButton({
  ariaLabel,
  className,
  idleLabel,
  navResponsive = false,
  value,
}: {
  ariaLabel: string;
  className: string;
  idleLabel: string;
  navResponsive?: boolean;
  value: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const pendingRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      resetTimerRef.current = setTimeout(() => setState("idle"), 2400);
    }
  }, [value]);

  const announcement = state === "idle" ? "" : announcements[state];

  return (
    <span className="install-copy-button-root">
      <button
        aria-label={ariaLabel}
        className={className}
        data-copy-state={state}
        onClick={handleCopy}
        type="button"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            initial={{ opacity: 0, y: -3 }}
            key={state}
            transition={{ duration: 0.14 }}
          >
            {state === "idle" ? (
              navResponsive ? (
                <>
                  <span className="install-copy-nav-label--narrow">
                    install
                  </span>
                  <span className="install-copy-nav-label--wide">
                    {idleLabel}
                  </span>
                </>
              ) : (
                idleLabel
              )
            ) : (
              stateLabels[state]
            )}
          </motion.span>
        </AnimatePresence>
      </button>
      <span aria-live="polite" className="sr-only" role="status">
        {announcement}
      </span>
    </span>
  );
}

export function InstallCommandCopy({
  variant,
  command = SCRIBE_BOOTSTRAP_COMMAND,
  label,
  idleLabel,
  ariaLabel,
  className = "",
}: InstallCommandCopyProps) {
  const defaultAriaLabel = "Copy Scribe alpha bootstrap command";
  const resolvedAriaLabel = ariaLabel ?? defaultAriaLabel;

  if (variant === "nav") {
    return (
      <CopyButton
        ariaLabel={resolvedAriaLabel}
        className="install-copy-button install-copy-button--nav"
        idleLabel={idleLabel ?? "install alpha"}
        navResponsive
        value={command}
      />
    );
  }

  return (
    <div className={`install-copy install-copy--full ${className}`}>
      <p className="install-copy-label">
        {label ?? "install the public alpha"}
      </p>
      <div className="install-copy-field">
        <code className="install-copy-command">{command}</code>
        <CopyButton
          ariaLabel={resolvedAriaLabel}
          className="install-copy-button install-copy-button--full"
          idleLabel={idleLabel ?? "copy"}
          value={command}
        />
      </div>
    </div>
  );
}
