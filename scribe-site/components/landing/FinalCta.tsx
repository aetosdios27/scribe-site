import Link from "next/link";
import { DitherFigure } from "./DitherFigure";

export function FinalCta() {
  return (
    <section
      id="join-beta"
      aria-labelledby="cta-heading"
      className="scroll-mt-16 bg-scribe-cobalt text-scribe-paper"
    >
      <div className="shell grid grid-cols-1 gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="cta-heading" className="final-cta-heading">
            <span className="block">stop fighting your frontend.</span>
            <span className="block">start publishing what matters.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
          <Link
            href="#"
            className="inline-flex h-12 items-center gap-2 rounded-xs border border-scribe-paper bg-scribe-paper px-7 font-mono text-sm font-semibold text-scribe-ink transition-colors hover:bg-scribe-white"
          >
            join the beta
            <span aria-hidden="true">→</span>
          </Link>
          <p className="font-pixel text-xs text-scribe-paper/80">
            no credit card. just your email.
          </p>
          <DitherFigure
            src1x="/art/dither/final-mark-1x.png"
            src2x="/art/dither/final-mark-2x.png"
            width={180}
            height={126}
            className="mt-2"
            imgClassName="w-[124px] lg:w-[164px]"
          />
        </div>
      </div>
    </section>
  );
}
