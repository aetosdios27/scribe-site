import { InstallCommandCopy } from "./InstallCommandCopy";
import ShimmerSweep from "@/components/smoothui/shimmer-sweep";

export function FinalCta() {
  return (
    <section
      id="install"
      aria-labelledby="cta-heading"
      className="scroll-mt-16 border-t border-scribe-rule bg-scribe-paper text-scribe-ink"
    >
      <div className="shell final-cta-inner">
        <div>
          <h2 id="cta-heading" className="final-cta-heading">
            <ShimmerSweep className="block" triggerOnView>
              stop fighting your frontend.
            </ShimmerSweep>
            <ShimmerSweep className="block" triggerOnView delay={140}>
              start publishing what matters.
            </ShimmerSweep>
          </h2>
        </div>

        <div className="final-cta-action">
          <InstallCommandCopy variant="full" />
        </div>
      </div>
    </section>
  );
}
