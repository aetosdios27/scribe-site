import { IconPlaceholder } from "./IconPlaceholder";
import type { Pain } from "./content";

export function PainCard({ pain }: { pain: Pain }) {
  return (
    <article className="flex flex-col gap-4 bg-scribe-paper-raised p-5">
      <div className="flex items-start justify-between">
        <span className="grid size-8 place-items-center bg-scribe-ink text-scribe-paper">
          <IconPlaceholder name={pain.icon} className="size-4" />
        </span>
        <span className="font-mono text-[10px] text-scribe-muted">
          {pain.index}
        </span>
      </div>
      <h3 className="text-sm font-semibold tracking-tight">{pain.title}</h3>
      <ul className="space-y-1.5 border-t border-scribe-rule pt-3 font-mono text-xs text-scribe-muted">
        {pain.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  );
}
