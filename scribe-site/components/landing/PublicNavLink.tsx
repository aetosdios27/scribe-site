"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./content";

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

  return (
    <Link
      href={item.href}
      aria-current={isCurrent ? "page" : undefined}
      className={`${base} ${state} transition-colors`}
    >
      {item.label}
    </Link>
  );
}
