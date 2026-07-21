import Link from "next/link";
import { HERO_TRUTHS } from "./content";
import { FigurePlaceholder } from "./FigurePlaceholder";
import { IconPlaceholder } from "./IconPlaceholder";

export function Hero() {
  return (
    <section className="shell grid grid-cols-1 gap-12 pt-14 pb-14 sm:pt-20 sm:pb-16 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-16">
      <div className="flex flex-col lg:col-span-7">
        <h1 className="max-w-[13ch] text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.95] font-semibold tracking-tight">
          your best ideas belong on your{" "}
          {/* phase 2: this word gets the pixel-type treatment */}
          <span data-pixel-word>website.</span>
        </h1>

        <p className="mt-8 max-w-md text-lg leading-relaxed">
          Scribe is the technical publishing platform that lets developers
          write, ship, and grow content — without fighting their frontend.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="#join-beta"
            className="inline-flex h-11 items-center gap-2 rounded-xs border border-scribe-cobalt bg-scribe-cobalt px-6 font-mono text-sm text-scribe-white transition-colors hover:border-scribe-cobalt-dark hover:bg-scribe-cobalt-dark"
          >
            join beta
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="#studio"
            className="inline-flex h-11 items-center gap-2 font-mono text-sm text-scribe-ink transition-colors hover:text-scribe-cobalt"
          >
            explore studio
            <IconPlaceholder name="braces" className="size-4" />
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-scribe-rule pt-8 lg:grid-cols-4">
          {HERO_TRUTHS.map((truth) => (
            <li key={truth.lines[0]} className="flex items-start gap-3">
              <IconPlaceholder
                name={truth.icon}
                className="mt-0.5 size-5 shrink-0 text-scribe-ink"
              />
              <span className="font-mono text-xs leading-relaxed">
                {truth.lines[0]}
                <br />
                {truth.lines[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-5">
        <FigurePlaceholder
          label="fig. 1 — publish orbit"
          note="hero object — dithered planet + orbit"
          decorated
          className="min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]"
        />
      </div>
    </section>
  );
}
