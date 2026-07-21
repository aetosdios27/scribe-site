/* reserved surface for phase-3 dithered artwork. renders an engineering-grid
   region with a figure label; decorative, so hidden from assistive tech. */

export function FigurePlaceholder({
  label,
  note,
  className = "",
  decorated = false,
  compact = false,
}: {
  label: string;
  note?: string;
  className?: string;
  decorated?: boolean;
  /** narrow regions: drop the right-hand caption so it never wraps */
  compact?: boolean;
}) {
  return (
    <figure aria-hidden="true" className={`flex flex-col ${className}`}>
      <div className="placeholder-grid relative min-h-0 flex-1 border border-scribe-rule bg-scribe-paper-raised">
        {decorated && (
          <>
            <Cross className="absolute left-[8%] top-[12%]" />
            <Cross className="absolute right-[14%] top-[22%]" />
            <Cross className="absolute left-[20%] bottom-[18%]" />
            <Asterisk className="absolute right-[10%] top-[62%]" />
            <Asterisk className="absolute left-[38%] top-[8%]" />
            <Cross className="absolute bottom-[10%] right-[8%]" />
          </>
        )}
        <span className="absolute inset-0 grid place-items-center px-6 text-center font-mono text-xs text-scribe-muted">
          {note ?? "artwork placeholder — phase 3"}
        </span>
        <span className="absolute bottom-2 right-3 font-mono text-[10px] text-scribe-muted">
          x: 1024&nbsp;&nbsp;y: 768
        </span>
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between gap-4 font-mono text-xs text-scribe-muted">
        <span className="whitespace-nowrap">{label}</span>
        {!compact && (
          <span className="text-right">dithered artwork · phase 3</span>
        )}
      </figcaption>
    </figure>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-3 text-scribe-rule-strong ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M6 1v10M1 6h10" />
    </svg>
  );
}

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-3.5 text-scribe-rule-strong ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M6 1v10M1.7 3.5l8.6 5M10.3 3.5l-8.6 5" />
    </svg>
  );
}
