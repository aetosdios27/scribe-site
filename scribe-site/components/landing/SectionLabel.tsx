/* mono section marker used across the page: "/ the problem" etc. */

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium text-scribe-muted">
      <span aria-hidden="true">/&nbsp;</span>
      {children}
    </p>
  );
}
