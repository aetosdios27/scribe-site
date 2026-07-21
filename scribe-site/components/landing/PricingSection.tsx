import { PRICING_TIERS } from "./content";
import { FigurePlaceholder } from "./FigurePlaceholder";
import { PricingCard } from "./PricingCard";
import { SectionLabel } from "./SectionLabel";

export function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-16 border-t border-scribe-rule"
    >
      <div className="shell py-14 sm:py-20 lg:py-24">
        <SectionLabel>pricing</SectionLabel>
        <h2 id="pricing-heading" className="sr-only">
          pricing
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12 lg:gap-5 xl:col-span-9 xl:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>

          <div className="hidden xl:col-span-3 xl:block">
            <FigurePlaceholder
              label="fig. 4 — transparent pricing"
              note="piggy bank — dithered artwork"
              decorated
              compact
              className="h-full min-h-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
