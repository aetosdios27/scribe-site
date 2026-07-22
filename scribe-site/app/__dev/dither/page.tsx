import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";

/* development-only dither laboratory. not linked, never indexed, unreachable
   in production builds. used to tune presets against real output. */

export const metadata: Metadata = {
  title: "dev - dither lab",
  robots: { index: false, follow: false },
};

const FIGURES = [
  {
    name: "hero sphere (ign / blue-noise style)",
    preset: "hero",
    src1x: "/art/dither/hero-sphere-1x.png",
    src2x: "/art/dither/hero-sphere-2x.png",
    w: 519,
    h: 555,
  },
  {
    name: "problem person (cluster4 halftone)",
    preset: "figure",
    src1x: "/art/dither/problem-person-1x.png",
    src2x: "/art/dither/problem-person-2x.png",
    w: 300,
    h: 381,
  },
  {
    name: "pricing pig (bayer8)",
    preset: "pricing",
    src1x: "/art/dither/pricing-pig-1x.png",
    src2x: "/art/dither/pricing-pig-2x.png",
    w: 339,
    h: 339,
  },
  {
    name: "final mark (cluster4, paper dots)",
    preset: "mark",
    src1x: "/art/dither/final-mark-1x.png",
    src2x: "/art/dither/final-mark-2x.png",
    w: 180,
    h: 126,
  },
];

function Cell({
  label,
  dark = false,
  children,
}: {
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`border border-scribe-rule p-4 ${
        dark ? "bg-scribe-cobalt" : "bg-scribe-paper-raised"
      }`}
    >
      <p
        className={`mb-3 font-mono text-[11px] ${
          dark ? "text-scribe-white/70" : "text-scribe-muted"
        }`}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

export default async function DitherLab() {
  if (process.env.NODE_ENV === "production") notFound();

  const sourceNames = ["hero-sphere", "problem-person", "pricing-pig", "final-mark"];
  const sources = await Promise.all(
    sourceNames.map(async (name) => ({
      name,
      svg: await readFile(
        path.join(process.cwd(), "art/source", `${name}.svg`),
        "utf8",
      ),
    })),
  );

  return (
    <main className="shell py-16">
      <p className="font-mono text-xs text-scribe-muted">/ dev - dither lab</p>
      <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight">
        dither pipeline outputs
      </h1>

      {/* flagship figures on paper + cobalt */}
      {FIGURES.map((fig) => (
        <section key={fig.name} className="mt-12">
          <h2 className="font-mono text-xs text-scribe-muted">
            / {fig.name} <span className="text-scribe-cobalt">[{fig.preset}]</span>
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Cell label="1x - paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fig.src1x} width={fig.w} height={fig.h} alt="" className="max-w-full" />
            </Cell>
            <Cell label="2x - paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fig.src2x} width={fig.w} height={fig.h} alt="" className="max-w-full" />
            </Cell>
            <Cell label="1x - cobalt" dark>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fig.src1x} width={fig.w} height={fig.h} alt="" className="max-w-full" />
            </Cell>
            <Cell label="mobile size - paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fig.src1x} width={fig.w} height={fig.h} alt="" style={{ width: Math.round(fig.w * 0.55) }} className="max-w-full" />
            </Cell>
          </div>
        </section>
      ))}

      {/* hover textures at real card size */}
      <section className="mt-12">
        <h2 className="font-mono text-xs text-scribe-muted">
          / hover fields at real card size
        </h2>
        <div className="mt-4 flex flex-wrap gap-6">
          <div>
            <p className="mb-2 font-mono text-[11px] text-scribe-muted">
              pain card (card-field)
            </p>
            <div className="dither-card-field h-[235px] w-[255px] p-5">
              <div className="flex h-full flex-col gap-3 bg-scribe-cobalt p-1">
                <p className="font-pixel text-base text-scribe-white">
                  complex toolchains
                </p>
                <p className="font-pixel text-[13px] text-scribe-white/90">
                  bundlers
                  <br />
                  configs
                  <br />
                  plugins
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] text-scribe-muted">
              pricing free/teams (card-field)
            </p>
            <div className="dither-card-field h-[420px] w-[280px] p-6">
              <div className="flex h-full flex-col bg-scribe-cobalt">
                <p className="font-pixel text-[2rem] text-scribe-white">free</p>
                <p className="font-sans text-6xl font-bold text-scribe-white">$0</p>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] text-scribe-muted">
              pricing pro (pricing-field, denser)
            </p>
            <div className="dither-pricing-field h-[420px] w-[280px] border-2 border-scribe-ink p-6">
              <div className="flex h-full flex-col bg-scribe-cobalt">
                <p className="font-pixel text-[2rem] text-scribe-white">pro</p>
                <p className="font-sans text-6xl font-bold text-scribe-white">$19</p>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] text-scribe-muted">
              raw tiles (4x zoom)
            </p>
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/art/dither/card-field.png" width={96} height={96} alt="" style={{ width: 192, imageRendering: "pixelated" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/art/dither/pricing-field.png" width={128} height={128} alt="" style={{ width: 192, imageRendering: "pixelated" }} />
            </div>
          </div>
        </div>
      </section>

      {/* source artwork */}
      <section className="mt-12">
        <h2 className="font-mono text-xs text-scribe-muted">/ sources</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sources.map(({ name, svg }) => (
            <Cell key={name} label={`${name}.svg`}>
              <div
                className="max-w-full [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </Cell>
          ))}
        </div>
      </section>
    </main>
  );
}
