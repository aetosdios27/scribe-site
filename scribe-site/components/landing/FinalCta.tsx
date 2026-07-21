import Link from "next/link";

export function FinalCta() {
  return (
    <section
      id="join-beta"
      aria-labelledby="cta-heading"
      className="scroll-mt-16 bg-scribe-cobalt text-scribe-paper"
    >
      <div className="shell grid grid-cols-1 gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2
            id="cta-heading"
            className="max-w-[16ch] text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.02] font-semibold tracking-tight"
          >
            stop fighting your frontend.
            <br />
            start publishing what matters.
          </h2>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
          <Link
            href="#"
            className="inline-flex h-12 items-center gap-2 rounded-xs border border-scribe-paper bg-scribe-paper px-7 font-mono text-sm text-scribe-ink transition-colors hover:bg-scribe-white"
          >
            join the beta
            <span aria-hidden="true">→</span>
          </Link>
          <p className="font-mono text-xs text-scribe-paper/80">
            no credit card. just your email.
          </p>
          {/* phase 3: pixel {S} mark mounts in this reserved block */}
          <span
            aria-hidden="true"
            className="mt-2 grid size-16 place-items-center border border-scribe-paper/40 font-mono text-xl text-scribe-paper/70 lg:size-20"
          >
            {"{s}"}
          </span>
        </div>
      </div>
    </section>
  );
}
