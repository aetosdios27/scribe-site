import InfiniteSlider from "@/components/smoothui/infinite-slider";
import MaskRevealUp from "@/components/smoothui/mask-reveal-up";
import LineByLineSlide from "@/components/smoothui/line-by-line-slide";
import LetterGlitch from "@/components/reactbits/letter-glitch";

const painMessages = [
  "i just wanted to write bro",
  "why am i debugging mdx at 2am",
  "how is markdown never just markdown",
  "why am i touching css for an article",
  "one plugin update and it all exploded",
  "spent longer styling code than writing",
  "this did not need a build pipeline",
  "can i please just publish",
  "why is the blog fighting back",
  "frontend tax is insane",
  "just let me ship the post",
  "authoring should not feel like devops",
] as const;

const topLane = [0, 1, 2, 3, 4, 5] as const;
const bottomLane = [6, 7, 8, 9, 10, 11] as const;
const mobileMessages = [0, 1, 3, 5, 6, 8, 7] as const;

const bubbleClass = (index: number) => {
  if (index === 1 || index === 10) return "pain-bubble pain-bubble--large";
  if (index === 4) return "pain-bubble pain-bubble--black";
  if (index === 7) return "pain-bubble pain-bubble--cobalt";
  if (index === 2 || index === 8 || index === 9) {
    return "pain-bubble pain-bubble--small";
  }
  return "pain-bubble";
};

function PainLane({ indices }: { indices: readonly number[] }) {
  return (
    <ul className="pain-bubble-list">
      {indices.map((index) => (
        <li className={bubbleClass(index)} key={painMessages[index]}>
          {painMessages[index]}
        </li>
      ))}
    </ul>
  );
}

export function ProblemStatement() {
  return (
    <section id="problem" className="scroll-mt-16" aria-labelledby="problem-heading">
      <div className="problem-setup">
        <div className="shell problem-setup-inner">
          <h2 id="problem-heading" className="problem-setup-copy">
            <MaskRevealUp
              lines={["you wanted", "to write blogs", "so why don’t you?"]}
              delays={[0, 0.08, 0.36]}
            />
          </h2>
        </div>
      </div>

      <div
        aria-label="Developer publishing frustrations"
        className="problem-pain-ribbon"
      >
        <ul className="sr-only">
          {painMessages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>

        <div aria-hidden="true" className="problem-pain-moving">
          <InfiniteSlider className="problem-pain-lane" gap={40} speed={18}>
            <PainLane indices={topLane} />
          </InfiniteSlider>
          <InfiniteSlider
            className="problem-pain-lane problem-pain-lane--reverse"
            gap={40}
            reverse
            speed={15}
          >
            <PainLane indices={bottomLane} />
          </InfiniteSlider>
        </div>

        <div aria-hidden="true" className="shell problem-pain-static">
          <PainLane indices={mobileMessages} />
        </div>
      </div>

      <div className="problem-recognition">
        <div className="shell">
          <LineByLineSlide
            className="problem-recognition-copy"
            lines={["oh right...", "yeah we feel the same"]}
            triggerOnView
            stagger={160}
          />
        </div>
      </div>

      <div className="problem-punchline-ribbon">
        <div aria-hidden="true" className="problem-punchline-glitch">
          <LetterGlitch glitchSpeed={45} />
        </div>
        <div className="shell problem-punchline-shell">
          <p className="problem-punchline-copy">fuck frontend.</p>
        </div>
      </div>
    </section>
  );
}
