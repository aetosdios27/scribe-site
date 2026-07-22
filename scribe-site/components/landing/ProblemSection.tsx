import { PAINS } from "./content";
import { DitherFigure } from "./DitherFigure";
import { PainCard } from "./PainCard";
import { SectionLabel } from "./SectionLabel";

const STATEMENT_LINES = [
  "you wanted to",
  "write a blog post.",
  "instead, you",
  "inherited a",
  "frontend project.",
];

const BUBBLES = [
  { text: "i just wanted to write.", pos: "lg:left-0 lg:top-0" },
  { text: "why am i debugging mdx?", pos: "lg:right-0 lg:top-[17%]" },
  { text: "cool. the table broke on mobile.", pos: "lg:left-0 lg:top-[35%]" },
  { text: "it’s a lot.", pos: "lg:left-3 lg:top-[53%]", pixel: true },
] as const;

const MOBILE_BUBBLES = [BUBBLES[0], BUBBLES[2], BUBBLES[3]];

function Bubble({
  children,
  pixel = false,
  floating = true,
  className = "",
}: {
  children: React.ReactNode;
  pixel?: boolean;
  floating?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`${floating ? "absolute" : "relative"} z-10 w-max max-w-full border border-scribe-ink bg-scribe-paper-raised px-2.5 py-1.5 text-[13px] leading-snug xl:max-w-[180px] ${
        pixel ? "font-pixel text-scribe-cobalt" : "font-mono text-scribe-ink"
      } ${className}`}
    >
      {children}
      {floating && (
        <span
          aria-hidden="true"
          className="absolute -bottom-[5px] left-4 block size-[9px] rotate-45 border-b border-r border-scribe-ink bg-scribe-paper-raised"
        />
      )}
    </p>
  );
}

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
            <h2 id="problem-heading" className="problem-heading">
              {STATEMENT_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-[26ch] font-sans text-lg leading-snug font-bold text-scribe-cobalt">
              you didn&rsquo;t sign up to debug this bullshit.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px border border-scribe-rule bg-scribe-rule sm:grid-cols-2 xl:grid-cols-3">
              {PAINS.map((pain) => (
                <PainCard key={pain.index} pain={pain} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* desktop rail: bubbles above, character pinned to the floor */}
            <div className="relative hidden h-full min-h-[560px] lg:block">
              {BUBBLES.map((bubble) => (
                <Bubble
                  key={bubble.text}
                  pixel={"pixel" in bubble && bubble.pixel}
                  className={bubble.pos}
                >
                  {bubble.text}
                </Bubble>
              ))}
              <DitherFigure
                label="fig. 2 - overkill"
                src1x="/art/dither/problem-person-1x.png"
                src2x="/art/dither/problem-person-2x.png"
                width={300}
                height={381}
                className="absolute right-0 bottom-0 flex w-full flex-col items-end"
                imgClassName="w-full max-w-[185px]"
              />
            </div>

            {/* smaller viewports: short conversation beside the character */}
            <div className="flex items-end gap-5 lg:hidden">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                {MOBILE_BUBBLES.map((bubble) => (
                  <Bubble
                    key={bubble.text}
                    pixel={"pixel" in bubble && bubble.pixel}
                    floating={false}
                  >
                    {bubble.text}
                  </Bubble>
                ))}
              </div>
              <DitherFigure
                label="fig. 2 - overkill"
                src1x="/art/dither/problem-person-1x.png"
                src2x="/art/dither/problem-person-2x.png"
                width={300}
                height={381}
                className="flex shrink-0 flex-col items-end"
                imgClassName="w-[124px] sm:w-[150px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
