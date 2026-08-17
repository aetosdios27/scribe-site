"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePressDepth } from "../interior/press-depth";

/* shared link-button. variants cover the three button contexts on the page:
   cobalt primary, ink outline on paper, and paper on the cobalt cta band.
   press feedback via the vendored interior usePressDepth hook. */

type Variant = "primary" | "outline" | "onCobalt";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "border border-scribe-cobalt bg-scribe-cobalt text-scribe-white hover:bg-scribe-cobalt-dark hover:border-scribe-cobalt-dark",
  outline:
    "border border-scribe-rule-strong text-scribe-ink hover:bg-scribe-ink hover:text-scribe-paper hover:border-scribe-ink",
  onCobalt:
    "border border-scribe-paper bg-scribe-paper text-scribe-ink hover:bg-scribe-white",
};

const MotionLink = motion.create(Link);

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  const { pressed, ref, bind } = usePressDepth();

  return (
    <MotionLink
      ref={ref}
      href={href}
      data-pressed={pressed ? "" : undefined}
      animate={{ y: pressed ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.45 }}
      {...bind}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xs px-5 font-mono text-sm font-semibold transition-colors ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </MotionLink>
  );
}