"use client";

import { SCRIBE_BOOTSTRAP_COMMAND } from "./install-command";
import { CopyButton } from "../interior/copy-button";

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

export interface InstallCommandCopyProps {
  variant: "nav" | "full";
  command?: string;
  label?: string;
  idleLabel?: string;
  ariaLabel?: string;
  className?: string;
}

export function InstallCommandCopy({
  variant,
  command = SCRIBE_BOOTSTRAP_COMMAND,
  label,
  idleLabel,
  ariaLabel,
  className = "",
}: InstallCommandCopyProps) {
  const defaultAriaLabel = "Copy Scribe beta bootstrap command";
  const resolvedAriaLabel = ariaLabel ?? defaultAriaLabel;

  const navLabel =
    idleLabel ?? "install beta";

  if (variant === "nav") {
    return (
      <span className="install-copy-button-root">
        <CopyButton
          ariaLabel={resolvedAriaLabel}
          className="install-copy-button install-copy-button--nav"
          copiedAnnounce="Scribe install command copied"
          copiedLabel="copied"
          errorAnnounce="Copy failed. Select the install command and copy it manually."
          errorLabel="copy failed"
          label={
            <>
              <span className="install-copy-nav-label--narrow">install</span>
              <span className="install-copy-nav-label--wide">
                {navLabel}
              </span>
            </>
          }
          value={command}
        />
      </span>
    );
  }

  return (
    <div className={`install-copy install-copy--full ${className}`}>
      <p className="install-copy-label">
        {label ?? "install the public beta"}
      </p>
      <div className="install-copy-field">
        <code className="install-copy-command">{command}</code>
        <CopyButton
          ariaLabel={resolvedAriaLabel}
          className="install-copy-button install-copy-button--full"
          copiedAnnounce="Scribe install command copied"
          copiedLabel="copied"
          errorAnnounce="Copy failed. Select the install command and copy it manually."
          errorLabel="copy failed"
          label={idleLabel ?? "copy"}
          value={command}
        />
      </div>
    </div>
  );
}