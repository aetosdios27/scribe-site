import Link from "next/link";
import { NAV_ITEMS } from "./content";
import { IconPlaceholder } from "./IconPlaceholder";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-scribe-rule bg-scribe-paper">
      <div className="shell flex h-14 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-1.5"
          aria-label="scribe home"
        >
          {/* isolated mark — replaced by the final vector mark in a later phase */}
          <span aria-hidden="true" className="brand-mark text-sm text-scribe-ink">
            {"{s}"}
          </span>
          <span className="font-sans text-base font-bold tracking-tight">
            scribe
          </span>
        </Link>

        <nav aria-label="primary" className="hidden md:block">
          <ul className="flex items-center gap-7 font-mono text-[13px] tracking-tight">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-scribe-ink transition-colors hover:text-scribe-cobalt"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <IconPlaceholder
            name="asterisk"
            className="hidden size-4 text-scribe-ink sm:block"
          />
          <Link
            href="#join-beta"
            className="inline-flex h-9 items-center gap-2 rounded-xs border border-scribe-cobalt bg-scribe-cobalt px-4 font-mono text-[13px] font-semibold text-scribe-white transition-colors hover:border-scribe-cobalt-dark hover:bg-scribe-cobalt-dark"
          >
            join beta
            <span aria-hidden="true">→</span>
          </Link>

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
                    <Link
                      href={item.href}
                      className="block px-3 py-2 transition-colors hover:bg-scribe-paper hover:text-scribe-cobalt"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
