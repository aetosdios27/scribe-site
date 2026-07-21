import { STACK } from "./content";
import { SectionLabel } from "./SectionLabel";

export function CompatibilityStrip() {
  return (
    <section
      aria-labelledby="stack-heading"
      className="border-t border-scribe-rule"
    >
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:gap-10">
        <div className="shrink-0">
          <SectionLabel>works with</SectionLabel>
          <h2 id="stack-heading" className="sr-only">
            works with your stack
          </h2>
        </div>

        <ul className="grid flex-1 grid-cols-2 gap-px border border-scribe-rule bg-scribe-rule sm:grid-cols-5">
          {STACK.map((name) => (
            <li
              key={name}
              className="flex items-center justify-center gap-2.5 bg-scribe-paper px-4 py-3.5 font-mono text-sm last:col-span-2 sm:last:col-span-1"
            >
              {/* phase 3: framework mark mounts here */}
              <span
                aria-hidden="true"
                className="block size-3 border border-scribe-rule-strong"
              />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
