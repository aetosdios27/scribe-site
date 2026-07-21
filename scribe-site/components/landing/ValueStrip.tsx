import { VALUES } from "./content";
import { IconPlaceholder } from "./IconPlaceholder";
import { SectionLabel } from "./SectionLabel";

export function ValueStrip() {
  return (
    <section
      aria-labelledby="values-heading"
      className="border-t border-scribe-rule"
    >
      <div className="shell py-16 sm:py-20 lg:py-24">
        <SectionLabel>why scribe</SectionLabel>
        <h2 id="values-heading" className="sr-only">
          why scribe
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-px border border-scribe-rule bg-scribe-rule sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {VALUES.map((value) => (
            <div key={value.title} className="bg-scribe-paper p-6">
              <IconPlaceholder
                name={value.icon}
                className="size-5 text-scribe-ink"
              />
              <h3 className="mt-4 text-sm font-semibold tracking-tight">
                {value.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-scribe-muted">
                {value.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
