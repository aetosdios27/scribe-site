import { Accordion } from "../interior/accordion";
import { FAQ_ITEMS } from "./content";
import { SectionLabel } from "./SectionLabel";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="faq-dark">
      <div className="shell faq-dark-grid">
        <div>
          <SectionLabel>answers</SectionLabel>
          <h2 id="faq-heading">the questions people actually ask.</h2>
        </div>
        <div className="faq-dark-copy">
          <Accordion
            items={FAQ_ITEMS.map((item) => ({
              id: item.id,
              title: item.question,
              content: item.answer,
            }))}
            type="single"
          />
        </div>
      </div>
    </section>
  );
}
