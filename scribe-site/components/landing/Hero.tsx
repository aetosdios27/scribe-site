import Link from "next/link";
import { HERO_TRUTHS } from "./content";
import { HeroOrbit } from "./HeroOrbit";
import { IconPlaceholder } from "./IconPlaceholder";

export function Hero() {
  return (
    <section className="shell grid grid-cols-1 gap-12 pt-12 pb-14 sm:pt-16 sm:pb-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-16">
      <div className="flex flex-col lg:col-span-7">
        <p className="inline-flex w-fit items-center gap-2 rounded-xs border border-scribe-rule-strong px-2 py-1 font-pixel text-xs text-scribe-cobalt">
          <span aria-hidden="true" className="size-1.5 bg-scribe-cobalt" />
          v0.1.0 beta is live
        </p>

        {/* canonical b.1 composition: three deliberate lines, two voices */}
        <h1 className="hero-heading mt-7">
          <span className="block">your best</span>
          <span className="block">ideas belong</span>
          <span className="block">
            <span className="max-sm:block">on your&nbsp;</span>
            <span className="hero-pixel-word">website.</span>
          </span>
        </h1>

        <p className="mt-8 max-w-[42ch] text-[length:var(--type-body-lg)] leading-[1.55]">
          Scribe is the technical publishing platform that lets developers
          write, ship, and grow content without fighting their frontend.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="#join-beta"
            className="inline-flex h-11 items-center gap-2 rounded-xs border border-scribe-cobalt bg-scribe-cobalt px-6 font-mono text-sm font-semibold text-scribe-white transition-colors hover:border-scribe-cobalt-dark hover:bg-scribe-cobalt-dark"
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
              <span className="font-mono text-[13px] leading-relaxed">
                {truth.lines[0]}
                <br />
                {truth.lines[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center lg:col-span-5 lg:items-end">
        <HeroOrbit />
      </div>
    </section>
  );
}
