"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { NavItem } from "./content";
import { usePressDepth } from "../interior/press-depth";

const MotionLink = motion.create(Link);

type PublicNavLinkProps = {
  item: NavItem;
  variant: "desktop" | "mobile";
};

export function PublicNavLink({ item, variant }: PublicNavLinkProps) {
  const pathname = usePathname();
  const destination = item.href.split("#", 1)[0] || "/";
  const isCurrent = item.href.startsWith("/") && pathname === destination;
  const base =
    variant === "desktop"
      ? "block px-2.5 py-1.5"
      : "block px-3 py-2";
  const state = isCurrent
    ? "bg-scribe-cobalt text-scribe-white"
    : variant === "desktop"
      ? "text-scribe-ink hover:text-scribe-cobalt"
      : "hover:bg-scribe-paper hover:text-scribe-cobalt";

  const { pressed, ref, bind } = usePressDepth();

  return (
    <MotionLink
      ref={ref}
      href={item.href}
      aria-current={isCurrent ? "page" : undefined}
      animate={{ y: pressed ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.45 }}
      {...bind}
      className={`${base} ${state} transition-colors`}
    >
      {item.label}
    </MotionLink>
  );
}