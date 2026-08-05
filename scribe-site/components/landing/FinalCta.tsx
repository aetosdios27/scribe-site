import { InstallCommandCopy } from "./InstallCommandCopy";

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
            <span className="block">stop fighting your frontend.</span>
            <span className="block">start publishing what matters.</span>
          </h2>
        </div>

        <div className="final-cta-action">
          <InstallCommandCopy variant="full" />
        </div>
      </div>
    </section>
  );
}
