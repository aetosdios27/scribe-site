import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAINS, PRICING_TIERS } from "@/components/landing/content";
import { PainCard } from "@/components/landing/PainCard";
import { PricingCard } from "@/components/landing/PricingCard";

/* development-only typography specimen. not linked anywhere, never indexed,
   and unreachable in production builds. used to tune baselines and metrics
   between tex gyre heros, geist mono, and geist pixel circle. */

export const metadata: Metadata = {
  title: "dev - type specimen",
  robots: { index: false, follow: false },
};

function Row({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-[10rem_1fr] items-baseline gap-6 border-b border-scribe-rule py-5">
      <p className="font-mono text-[11px] text-scribe-muted">{label}</p>
      <div className={className}>{children}</div>
    </div>
  );
}

const PANGRAM = "the quick brown fox jumps over the lazy dog 0123456789";

export default function TypeSpecimen() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="shell py-16">
      <p className="font-mono text-xs text-scribe-muted">/ dev - type specimen</p>
      <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight">
        scribe type system
      </h1>

      {/* 1 - families */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">/ families</h2>
      <Row label="heros 400" className="font-sans text-2xl">
        {PANGRAM}
      </Row>
      <Row label="heros 700" className="font-sans text-2xl font-bold">
        {PANGRAM}
      </Row>
      <Row label="geist mono 400" className="font-mono text-2xl">
        {PANGRAM}
      </Row>
      <Row label="geist mono 600" className="font-mono text-2xl font-semibold">
        {PANGRAM}
      </Row>
      <Row label="pixel circle" className="font-pixel text-2xl">
        {PANGRAM}
      </Row>
      <Row label="pixel circle 12px" className="font-pixel text-xs">
        {PANGRAM}
      </Row>
      <Row label="pixel circle 48px" className="font-pixel text-5xl">
        website.
      </Row>

      {/* 2 - hero composition */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / hero composition
      </h2>
      <div className="border-b border-scribe-rule py-8">
        <p className="hero-heading">
          <span className="hero-line">your best</span>
          <span className="hero-line">
            <span className="hero-pixel-word">ideas</span> belong
          </span>
          <span className="hero-line">on your website.</span>
        </p>
      </div>

      {/* 3 - problem composition */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / problem composition
      </h2>
      <div className="max-w-xs border-b border-scribe-rule py-8">
        <p className="problem-heading">
          <span className="block">you wanted to</span>
          <span className="block">write a blog post.</span>
          <span className="block">instead, you</span>
          <span className="block">inherited a</span>
          <span className="block">frontend project.</span>
        </p>
        <p className="mt-6 font-sans text-lg leading-snug font-bold text-scribe-cobalt">
          you didn&rsquo;t sign up to debug this bullshit.
        </p>
        <p className="mt-8 -rotate-2 font-pixel text-lg text-scribe-cobalt">
          it&rsquo;s a lot.
        </p>
      </div>

      {/* 4 - pixel interruptions */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / pixel interruptions
      </h2>
      <Row label="public alpha badge">
        <p className="inline-flex items-center gap-2 rounded-xs border border-scribe-rule-strong px-2 py-1 font-pixel text-xs text-scribe-cobalt">
          <span aria-hidden="true" className="size-1.5 bg-scribe-cobalt" />
          public alpha is live
        </p>
      </Row>
      <Row label="most popular">
        <p className="inline-block bg-scribe-cobalt px-3 py-1 font-pixel text-xs text-scribe-white">
          most popular
        </p>
      </Row>
      <Row label="soon">
        <span className="rounded-xs border border-dashed border-scribe-rule-strong px-1.5 py-0.5 font-pixel text-[11px] text-scribe-muted">
          soon
        </span>
      </Row>
      <Row label="microcopy">
        <p className="bg-scribe-cobalt px-3 py-2 font-pixel text-xs text-scribe-paper/80">
          public alpha. install with bun.
        </p>
      </Row>

      {/* 5 - cards default + forced hover */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / pain card - default vs hover (hover forced)
      </h2>
      <div className="grid grid-cols-1 gap-6 border-b border-scribe-rule py-8 sm:grid-cols-2">
        <PainCard pain={PAINS[0]} />
        <div className="group grid bg-scribe-paper-raised">
          <div className="flex [grid-area:1/1] flex-col gap-4 p-5 opacity-0">
            <h3 className="font-mono text-[15px] font-semibold">
              {PAINS[0].title}
            </h3>
          </div>
          <div className="flex [grid-area:1/1] flex-col gap-4 bg-scribe-cobalt p-5 text-scribe-white">
            <p className="font-pixel text-[15px] tracking-tight">
              {PAINS[0].title}
            </p>
            <ul className="space-y-1.5 border-t border-scribe-white/30 pt-3 font-pixel text-[13px] text-scribe-white/90">
              {PAINS[0].points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 6 - pricing default + forced hover */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / pricing - default (hover each card to compare)
      </h2>
      <div className="grid grid-cols-1 items-start gap-6 border-b border-scribe-rule py-8 sm:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>

      {/* 7 - final cta */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">/ final cta</h2>
      <div className="border-b border-scribe-rule bg-scribe-cobalt py-10 text-scribe-paper">
        <p className="final-cta-heading shell">
          <span className="block">stop fighting your frontend.</span>
          <span className="block">start publishing what matters.</span>
        </p>
      </div>

      {/* 8 - optical alignment */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / optical alignment - shared baselines
      </h2>
      {[6, 4, 3, 2].map((rem) => (
        <Row key={rem} label={`${rem}rem`}>
          <p
            className="border-t border-scribe-rule-faint"
            style={{ fontSize: `${rem}rem`, lineHeight: 1.1 }}
          >
            <span className="font-sans font-bold">your best&nbsp;</span>
            <span className="hero-pixel-word">ideas</span>
            <span className="font-sans font-bold">&nbsp;belong</span>
            <span className="font-mono text-scribe-muted"> / scribe.md</span>
          </p>
        </Row>
      ))}

      {/* 9 - metadata + legal */}
      <h2 className="mt-14 font-mono text-xs text-scribe-muted">
        / metadata + legal
      </h2>
      <Row label="section label">
        <p className="font-mono text-xs font-medium text-scribe-muted">
          / the problem
        </p>
      </Row>
      <Row label="figure label">
        <p className="font-mono text-xs text-scribe-muted">
          fig. 1 - publish orbit
        </p>
      </Row>
      <Row label="legal 13px">
        <p className="font-mono text-[13px] text-scribe-muted">
          © 2026 scribe, inc. all rights reserved. privacy policy. terms of
          service.
        </p>
      </Row>
    </main>
  );
}
