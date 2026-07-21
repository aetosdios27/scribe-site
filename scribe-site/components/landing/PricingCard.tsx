import { ButtonLink } from "./ButtonLink";
import type { PricingTier } from "./content";

export function PricingCard({ tier }: { tier: PricingTier }) {
  const { name, price, period, blurb, features, cta, popular } = tier;

  return (
    <article
      className={`relative flex flex-col rounded-xs border bg-scribe-paper-raised ${
        popular
          ? "order-first border-2 border-scribe-ink sm:col-span-2 xl:order-none xl:col-span-1 xl:-my-4"
          : "border-scribe-rule"
      }`}
    >
      {popular && (
        <p className="border-b-2 border-scribe-ink bg-scribe-cobalt px-5 py-1.5 text-center font-mono text-[10px] tracking-widest text-scribe-white uppercase">
          most popular
        </p>
      )}

      {/* phase 3: cobalt dither hover-fill mounts inside this card */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-mono text-sm text-scribe-muted">{name}</h3>
        <p className="mt-1 text-xs text-scribe-muted">{blurb}</p>

        <p className="mt-5 flex items-baseline gap-1.5">
          <span className="text-5xl font-semibold tracking-tight">{price}</span>
          <span className="font-mono text-xs text-scribe-muted">{period}</span>
        </p>

        <ul className="mt-6 flex-1 space-y-2.5 border-t border-scribe-rule pt-5 font-mono text-xs">
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
                <span className="ml-auto rounded-xs border border-dashed border-scribe-rule-strong px-1.5 py-0.5 text-[10px] text-scribe-muted">
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
    </article>
  );
}
