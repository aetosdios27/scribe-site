import Link from "next/link";
import { FOOTER_COLUMNS, FOOTER_UTILITY } from "./content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-scribe-rule-strong bg-scribe-paper">
      <div className="shell py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="flex items-baseline gap-1.5"
              aria-label="scribe home"
            >
              <span aria-hidden="true" className="brand-mark text-sm">
                {"{s}"}
              </span>
              <span className="font-sans text-base font-bold tracking-tight">
                scribe
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-scribe-muted">
              technical publishing infrastructure for developer-owned
              websites.
            </p>
            <p className="mt-8 font-mono text-[13px] text-scribe-muted lg:text-xs">
              © {year} scribe, inc. all rights reserved.
            </p>
          </div>

          <nav
            aria-label="footer"
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="font-mono text-xs font-medium text-scribe-muted">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5 font-mono text-[13px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-scribe-cobalt"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-scribe-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          {/* tiny branded interruption - the only pixel type in the footer */}
          <p className="font-pixel text-xs text-scribe-muted">
            write markdown. own everything.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[13px] text-scribe-muted lg:text-xs">
            {FOOTER_UTILITY.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-scribe-cobalt"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
