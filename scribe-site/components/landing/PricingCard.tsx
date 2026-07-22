import { ButtonLink } from "./ButtonLink";
import type { PricingTier } from "./content";

/* pricing reads as a technical product specification. hover uses the same
   stacked dual-layer architecture as the pain cards: a flat-cobalt pixel
   duplicate crossfades in without reflow (phase 3 replaces the flat fill
   with the dithered fill). pro stays distinct through its ink outline and
   the badge strip, which inverts on hover instead of blending in. */

export function PricingCard({ tier }: { tier: PricingTier }) {
  const { name, price, period, blurb, features, cta, popular } = tier;

  return (
    <article
      className={`group relative flex flex-col rounded-xs border bg-scribe-paper-raised ${
        popular
          ? "order-first border-2 border-scribe-ink sm:col-span-2 xl:order-none xl:col-span-1 xl:-my-4"
          : "border-scribe-rule"
      }`}
    >
      {popular && (
        <p className="border-b-2 border-scribe-ink bg-scribe-cobalt px-5 py-1.5 text-center font-pixel text-xs text-scribe-white transition-colors duration-150 group-hover:bg-scribe-paper group-hover:text-scribe-cobalt">
          most popular
        </p>
      )}

      <div className="grid flex-1">
        {/* default layer */}
        <div className="flex [grid-area:1/1] flex-col p-6 transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0">
          <h3 className="font-sans text-[1.75rem] font-bold tracking-tight">
            {name}
          </h3>
          <p className="mt-1 font-mono text-[13px] text-scribe-muted">
            {blurb}
          </p>

          <p className="mt-5 flex items-baseline gap-1.5">
            <span className="font-sans text-6xl font-bold tracking-tight tabular-nums">
              {price}
            </span>
            <span className="font-mono text-xs text-scribe-muted">
              {period}
            </span>
          </p>

          <ul className="mt-6 flex-1 space-y-2.5 border-t border-scribe-rule pt-5 font-mono text-[13px]">
            {features.map((feature) => (
              <li
                key={feature.label}
                className={`flex items-center gap-2.5 ${
                  feature.soon ? "text-scribe-muted" : "text-scribe-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={popular ? "text-scribe-cobalt" : "text-scribe-ink"}
                >
                  +
                </span>
                <span>{feature.label}</span>
                {feature.soon && (
                  <span className="ml-auto rounded-xs border border-dashed border-scribe-rule-strong px-1.5 py-0.5 font-pixel text-[11px] text-scribe-muted">
                    soon
                  </span>
                )}
              </li>
            ))}
          </ul>

          <ButtonLink
            href={cta.href}
            variant={popular ? "primary" : "outline"}
            className="mt-8 w-full"
          >
            {cta.label}
          </ButtonLink>
        </div>

        {/* hover layer - cobalt dither rim with a flat field behind the
            text. pro gets the denser grain so it never matches neighbours */}
        <div
          aria-hidden="true"
          className={`flex [grid-area:1/1] flex-col p-6 text-scribe-white opacity-0 transition-opacity duration-150 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 ${
            popular ? "dither-pricing-field" : "dither-card-field"
          }`}
        >
          <div className="flex flex-1 flex-col bg-scribe-cobalt">
            <p className="font-pixel text-[2rem] tracking-tight">{name}</p>
            <p className="mt-1 font-pixel text-[13px] text-scribe-white/70">
              {blurb}
            </p>

            {/* the price keeps its heros spine on hover - pixel turns it twiggy */}
            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="font-sans text-6xl font-bold tracking-tight text-scribe-white tabular-nums">
                {price}
              </span>
              <span className="font-pixel text-xs text-scribe-white/70">
                {period}
              </span>
            </p>

            <ul className="mt-6 flex-1 space-y-2.5 border-t border-scribe-white/30 pt-5 font-pixel text-[13px] text-scribe-white/90">
              {features.map((feature) => (
                <li
                  key={feature.label}
                  className={`flex items-center gap-2.5 ${
                    feature.soon ? "text-scribe-white/60" : ""
                  }`}
                >
                  <span aria-hidden="true">+</span>
                  <span>{feature.label}</span>
                  {feature.soon && (
                    <span className="ml-auto rounded-xs border border-dashed border-scribe-white/50 px-1.5 py-0.5 font-pixel text-[11px] text-scribe-white/80">
                      soon
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* visual replica of the real cta below - same box, inverted skin */}
            <span className="mt-8 inline-flex h-10 w-full items-center justify-center rounded-xs border border-scribe-white bg-scribe-white px-5 font-mono text-sm font-semibold text-scribe-cobalt">
              {cta.label}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
