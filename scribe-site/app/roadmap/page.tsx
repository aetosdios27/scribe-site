import type { Metadata } from "next";
import Link from "next/link";
import { DitherField } from "@/components/landing/DitherField";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { SectionLabel } from "@/components/landing/SectionLabel";
import { TextReveal } from "@/components/interior/text-reveal";
import ShimmerSweep from "@/components/smoothui/shimmer-sweep";

export const metadata: Metadata = {
  title: "Roadmap — Scribe",
  description:
    "The public direction for Scribe: reliable integrations, evidence-led extension points, and a durable publishing contract.",
};

const phases = [
  {
    number: "01",
    horizon: "near horizon",
    title: "Make real integrations boringly reliable",
    purpose:
      "Harden the public beta against the websites people actually bring us, without turning every edge case into another configuration system.",
    outcome:
      "A developer should be able to add Scribe to an established React site, understand any real limits, and trust the result across builds, browsers, and Studio.",
    goals: [
      "Turn adopter failures into small, permanent regression fixtures.",
      "Expand host-preservation coverage when a real styling architecture demands it.",
      "Strengthen browser, package, framework, and computed-style evidence.",
      "Make setup and compiler diagnostics precise enough to act on without reading Scribe internals.",
      "Harden Studio editing, tables, recovery, and source-safe refusal paths.",
      "Document integration patterns and limitations from verified behavior.",
    ],
  },
  {
    number: "02",
    horizon: "after the evidence",
    title:
      "Let established sites integrate deeply without surrendering their architecture",
    purpose:
      "Support sites whose identity lives in scoped classes or private semantic components, while keeping Scribe's publication machinery intact.",
    outcome:
      "Hosts gain narrow bridges for real integration gaps. Scribe keeps control of semantics, accessibility, code behavior, and responsive publishing mechanics.",
    goals: [
      "Derive each extension point from observed integrations, not imagined flexibility.",
      "Prefer additive class, style, and safe-attribute slots over element replacement.",
      "Define deterministic prop composition and useful invalid-configuration diagnostics.",
      "Add narrow semantic renderer overrides only where additive styling cannot solve a proven need.",
      "Prove Server and Client Component behavior, serialization, client islands, and bundle impact in production Next.js and Vite fixtures.",
      "Keep headings, code frames, and other machinery-heavy surfaces Scribe-owned until evidence says otherwise.",
    ],
  },
  {
    number: "03",
    horizon: "toward 1.0",
    title: "Make Scribe stable enough to depend on",
    purpose:
      "Turn a capable beta into a durable publishing contract that long-lived websites and outside contributors can reason about.",
    outcome:
      "Compatibility, change, migration, security, and maintenance expectations become explicit and backed by repeatable evidence.",
    goals: [
      "Declare compatibility ranges only where CI and real consumers support them.",
      "Audit public APIs and package exports before committing to 1.0 stability.",
      "Define versioning, deprecation, and migration rules for supported surfaces.",
      "Treat visual changes as reviewed compatibility work, with evidence and migration guidance where needed.",
      "Make content trust and security boundaries explicit; add safer modes only when real untrusted workflows exist.",
      "Keep improving the contributor front door without manufacturing foundation-scale governance.",
    ],
  },
] as const;

export default function RoadmapPage() {
  return (
    <>
      <Header />
      <main className="roadmap-page flex-1">
        <section className="roadmap-intro">
          <DitherField
            variant="roadmap"
            geometry="smoke"
            className="roadmap-intro-dither"
          />
          <div className="shell roadmap-intro-inner">
            <div className="roadmap-kicker">
              <SectionLabel>roadmap</SectionLabel>
              <p className="roadmap-edition">public direction / beta</p>
            </div>

            <div className="roadmap-title-grid">
              <h1>
                <ShimmerSweep className="block" triggerOnView>
                  Build the publishing layer people can trust.
                </ShimmerSweep>
              </h1>
              <div className="roadmap-intro-copy">
                <p>
                  Scribe exists to remove the frontend and infrastructure tax
                  from publishing technical work on a website you own. The
                  host remains the website. Scribe makes the publication
                  machinery dependable.
                </p>
                <p>
                  This roadmap is direction, not a promise of ship dates.
                  Sequencing stays deliberately loose: real integration
                  evidence can change the order, and a broken contract outranks
                  a shiny speculative feature.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="roadmap-phases" className="roadmap-phases">
          <h2 id="roadmap-phases" className="sr-only">
            Scribe roadmap phases
          </h2>
          {phases.map((phase) => (
            <article className="roadmap-phase" key={phase.number}>
              <div className="shell roadmap-phase-grid">
                <header className="roadmap-phase-header">
                  <div className="roadmap-phase-index" aria-hidden="true">
                    {phase.number}
                  </div>
                  <p className="roadmap-horizon">{phase.horizon}</p>
                  <h3>
                    <TextReveal text={phase.title} />
                  </h3>
                </header>

                <div className="roadmap-phase-body">
                  <div className="roadmap-purpose">
                    <p className="roadmap-field-label">purpose</p>
                    <p>{phase.purpose}</p>
                  </div>
                  <div className="roadmap-outcome">
                    <p className="roadmap-field-label">outcome</p>
                    <p>{phase.outcome}</p>
                  </div>
                  <div className="roadmap-goals">
                    <p className="roadmap-field-label">what this means</p>
                    <ol>
                      {phase.goals.map((goal, index) => (
                        <li key={goal}>
                          <span aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p>{goal}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="roadmap-evidence">
          <div className="shell roadmap-evidence-grid">
            <div>
              <SectionLabel>how priorities move</SectionLabel>
              <h2>Use is evidence.</h2>
            </div>
            <div className="roadmap-evidence-copy">
              <p>
                A reproducible integration failure, a repeated source-safety
                concern, or a missing primitive encountered while publishing
                can pull work forward. Technical curiosity alone does not.
              </p>
              <p>
                Contained fixes do not need a permission ceremony. Changes to
                public contracts should begin with the problem so contributors
                and maintainers do not design incompatible answers in parallel.
              </p>
              <p className="roadmap-github-nudge">
                If Scribe gets in the way of something you are trying to
                publish, bring the failing case to the{" "}
                <Link
                  href="https://github.com/aetosdios27/scribe"
                >
                  repository
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
