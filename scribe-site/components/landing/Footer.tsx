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
              className="flex items-center gap-2"
              aria-label="scribe — home"
            >
              <span aria-hidden="true" className="font-mono text-sm">
                {"{s}"}
              </span>
              <span className="font-mono text-sm font-semibold">scribe</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-scribe-muted">
              technical publishing infrastructure for developer-owned
              websites.
            </p>
            <p className="mt-8 font-mono text-xs text-scribe-muted">
              © {year} scribe, inc. all rights reserved.
            </p>
          </div>

          <nav
            aria-label="footer"
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-5"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="font-mono text-xs text-scribe-muted">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm">
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
          <p className="font-mono text-xs text-scribe-muted">
            write markdown. own everything.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-scribe-muted">
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
