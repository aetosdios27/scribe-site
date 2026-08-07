import { DitherField } from "./DitherField";

const STAGES = [
  {
    index: "01 / source",
    title: "YOUR CONTENT",
    facts: ["Markdown / MDX", "local files", "your repository"],
  },
  {
    index: "02 / transform",
    title: "SCRIBE",
    facts: [
      "integration + compile layer",
      "source remains authoritative",
      "compile-time output",
    ],
  },
  {
    index: "03 / destination",
    title: "YOUR WEBSITE",
    facts: ["your components", "Next.js / Vite", "your deployment"],
  },
] as const;

const OWNERSHIP = ["no hosted CMS", "no runtime lock-in", "your site stays yours"];

export function TechnicalProof() {
  return (
    <section
      id="technical-proof"
      aria-labelledby="technical-proof-heading"
      className="technical-proof-section scroll-mt-16"
    >
      <div className="shell technical-proof-inner">
        <h2 id="technical-proof-heading" className="technical-proof-heading">
          a publishing layer for the site you already own.
        </h2>

        <ol className="technical-proof-pipeline">
          {STAGES.map((stage, index) => (
            <li key={stage.title} className="technical-proof-stage">
              <DitherField
                variant={index === 1 ? "paper" : "cobalt"}
                geometry={index === 0 ? "flow-fine" : index === 1 ? "flow-soft" : "flow"}
                className="technical-proof-dither"
              />
              <p className="technical-proof-index">{stage.index}</p>
              <h3>{stage.title}</h3>
              <ul>
                {stage.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <ul className="technical-proof-ownership" aria-label="ownership facts">
          {OWNERSHIP.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
