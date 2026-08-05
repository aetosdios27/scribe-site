"use client";

import ButtonCopy from "@/components/smoothui/button-copy";
import { SCRIBE_INSTALL_COMMAND } from "./install-command";

export interface InstallCommandCopyProps {
  variant: "nav" | "full";
}

export function InstallCommandCopy({ variant }: InstallCommandCopyProps) {
  if (variant === "nav") {
    return (
      <ButtonCopy
        className="install-copy-button install-copy-button--nav"
        idleLabel="install alpha"
        value={SCRIBE_INSTALL_COMMAND}
      />
    );
  }

  return (
    <div className="install-copy install-copy--full">
      <p className="install-copy-label">install the public alpha</p>
      <div className="install-copy-field">
        <code className="install-copy-command">{SCRIBE_INSTALL_COMMAND}</code>
        <ButtonCopy
          className="install-copy-button install-copy-button--full"
          value={SCRIBE_INSTALL_COMMAND}
        />
      </div>
    </div>
  );
}
