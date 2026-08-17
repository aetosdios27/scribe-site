"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { NAV_ITEMS } from "./content";
import { IconPlaceholder } from "./IconPlaceholder";
import { InstallCommandCopy } from "./InstallCommandCopy";
import { PublicNavLink } from "./PublicNavLink";
import { useHideOnScroll } from "../interior/hide-on-scroll";

const MotionLink = motion.create(Link);

const SLIDE = { type: "spring", stiffness: 150, damping: 27, mass: 1 } as const;

export function Header() {
  const { ref, hidden } = useHideOnScroll<HTMLElement>({ topGuard: 16 });
  const reduced = useReducedMotion();

  return (
    <motion.header
      ref={ref}
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={reduced ? { duration: 0 } : SLIDE}
      className="sticky top-0 z-40 border-b border-scribe-rule bg-scribe-paper"
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-14 md:gap-6">
        <Link
          href="/"
          className="shrink-0"
          aria-label="scribe home"
        >
          <Image
            src="/brand/wordmarks/scribe-wordmark-transparent-1200x300.png"
            width={1200}
            height={300}
            alt="Scribe"
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav aria-label="primary" className="hidden md:block">
          <ul className="flex items-center gap-7 font-mono text-[13px] tracking-tight">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <PublicNavLink item={item} variant="desktop" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <IconPlaceholder
            name="asterisk"
            className="hidden size-4 text-scribe-ink sm:block"
          />

          <MotionLink
            href="https://github.com/aetosdios27/scribe"
            target="_blank"
            rel="noreferrer"
            aria-label="star scribe on github"
            className="hidden h-9 items-center gap-2 rounded-xs border border-scribe-rule-strong px-3 font-mono text-[13px] text-scribe-ink transition-colors hover:bg-scribe-ink hover:text-scribe-paper md:inline-flex"
          >
            <IconPlaceholder name="star" className="size-4" />
            star
          </MotionLink>

          <InstallCommandCopy variant="nav" />

          <details className="group relative md:hidden">
            <summary
              aria-label="open navigation menu"
              className="flex h-9 cursor-pointer list-none items-center rounded-xs border border-scribe-rule-strong px-3 font-mono text-[13px] select-none"
            >
              menu
            </summary>
            <nav
              aria-label="mobile"
              className="absolute top-[calc(100%+0.75rem)] right-0 w-44 rounded-xs border border-scribe-rule-strong bg-scribe-paper-raised p-1"
            >
              <ul className="font-mono text-[13px]">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <PublicNavLink item={item} variant="mobile" />
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </motion.header>
  );
}