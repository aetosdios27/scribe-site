import { IconPlaceholder } from "./IconPlaceholder";
import type { Pain } from "./content";

/* default layer reads as a compact technical incident report; the hover
   layer is a flat-cobalt pixel-type duplicate (phase 3 swaps the flat fill
   for the dithered fill). both layers are stacked in flow, so the card
   dimensions equal the larger of the two and hover never reflows. */

export function PainCard({ pain }: { pain: Pain }) {
  return (
    <article className="group grid bg-scribe-paper-raised">
      {/* default layer */}
      <div className="flex [grid-area:1/1] flex-col gap-4 p-5 transition-opacity duration-150 group-hover:opacity-0 group-focus-within:opacity-0">
        <div className="flex items-start justify-between">
          <span className="grid size-8 place-items-center bg-scribe-ink text-scribe-paper">
            <IconPlaceholder name={pain.icon} className="size-4" />
          </span>
          <span className="font-mono text-[11px] text-scribe-muted">
            {pain.index}
          </span>
        </div>
        <h3 className="font-mono text-base font-bold tracking-tight">
          {pain.title}
        </h3>
        <ul className="space-y-1.5 border-t border-scribe-rule pt-3 font-mono text-[13px] text-scribe-ink/70">
          {pain.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      {/* hover layer - cobalt dither rim with a flat field behind the text
          so the pixel type stays readable (phase 3) */}
      <div
        aria-hidden="true"
        className="dither-card-field flex [grid-area:1/1] flex-col p-5 text-scribe-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <div className="flex flex-1 flex-col gap-4 bg-scribe-cobalt">
          <div className="flex items-start justify-between">
            <span className="grid size-8 place-items-center border border-scribe-white/70 text-scribe-white">
              <IconPlaceholder name={pain.icon} className="size-4" />
            </span>
            <span className="font-pixel text-[11px] text-scribe-white/70">
              {pain.index}
            </span>
          </div>
          <p className="font-pixel text-base tracking-tight">{pain.title}</p>
          <ul className="space-y-1.5 border-t border-scribe-white/30 pt-3 font-pixel text-[13px] text-scribe-white/90">
            {pain.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
