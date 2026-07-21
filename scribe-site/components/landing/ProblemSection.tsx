import { PAINS } from "./content";
import { FigurePlaceholder } from "./FigurePlaceholder";
import { PainCard } from "./PainCard";
import { SectionLabel } from "./SectionLabel";

export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="border-t border-scribe-rule"
    >
      <div className="shell py-14 sm:py-16 lg:py-20">
        <SectionLabel>the problem</SectionLabel>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <h2
              id="problem-heading"
              className="text-3xl leading-[1.08] font-semibold tracking-tight sm:text-4xl"
            >
              you wanted to write a blog post. instead, you inherited a
              frontend project.
            </h2>
            <p className="mt-6 max-w-[24ch] text-lg leading-snug font-semibold text-scribe-cobalt">
              you didn&rsquo;t sign up to debug this bullshit.
            </p>
            {/* phase 2: handwritten treatment */}
            <p className="mt-12 -rotate-2 text-scribe-muted">it&rsquo;s a lot.</p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px border border-scribe-rule bg-scribe-rule sm:grid-cols-2 xl:grid-cols-3">
              {PAINS.map((pain) => (
                <PainCard key={pain.index} pain={pain} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <FigurePlaceholder
              label="fig. 2 — overwhelm"
              note="illustration"
              compact
              className="h-48 lg:h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
