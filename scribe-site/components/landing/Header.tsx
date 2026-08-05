import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "./content";
import { IconPlaceholder } from "./IconPlaceholder";
import { InstallCommandCopy } from "./InstallCommandCopy";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-scribe-rule bg-scribe-paper">
      <div className="shell flex h-14 items-center justify-between gap-6">
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
