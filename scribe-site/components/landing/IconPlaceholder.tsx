/* temporary geometric placeholder icons — final iconography arrives with the
   illustration phase. all are simple stroke shapes, no icon library. */

export type IconName =
  | "users"
  | "markdown"
  | "infinity"
  | "lockOpen"
  | "terminal"
  | "doc"
  | "brush"
  | "device"
  | "gauge"
  | "lock"
  | "bolt"
  | "sparkle"
  | "bars"
  | "cloud"
  | "braces"
  | "asterisk";

const PATHS: Record<IconName, React.ReactNode> = {
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19v-1a5 5 0 0 1 10 0v1" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17.5 14.5a5 5 0 0 1 2.5 4.3v.2" />
    </>
  ),
  markdown: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M7 15v-6l2.5 3 2.5-3v6M15.5 9v4m0 0-2-2m2 2 2-2" />
    </>
  ),
  infinity: (
    <path d="M8 15c-2 0-3.5-1.3-3.5-3s1.5-3 3.5-3c3 0 5 6 8 6 2 0 3.5-1.3 3.5-3s-1.5-3-3.5-3c-3 0-5 6-8 6Z" />
  ),
  lockOpen: (
    <>
      <rect x="6" y="11" width="12" height="8" />
      <path d="M9 11V8a3 3 0 0 1 5.8-1" />
      <path d="M12 14.5v2" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M7 9l3 3-3 3M12.5 15H17" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </>
  ),
  brush: (
    <>
      <path d="M4 20c1.5-1 2-2.5 2-4l8.5-8.5 2 2L8 18c-1.5 0-3 .5-4 2Z" />
      <path d="M13.5 6.5 15 5l4 4-1.5 1.5" />
    </>
  ),
  device: (
    <>
      <rect x="8" y="3" width="8" height="18" />
      <path d="M11 18h2" />
      <path d="M3 8h2M3 12h2M19 8h2M19 12h2" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M4 17h16" />
      <path d="M12 17l4-6" />
    </>
  ),
  lock: (
    <>
      <rect x="6" y="11" width="12" height="8" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
      <path d="M12 14.5v2" />
    </>
  ),
  bolt: <path d="M13 3 6 14h5l-1 7 7-11h-5l1-7Z" />,
  sparkle: (
    <path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11" />
  ),
  bars: <path d="M5 20v-6M10 20V9M15 20v-9M20 20V4" />,
  cloud: (
    <path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17.2 8.6 3.5 3.5 0 0 1 17 18H7Z" />
  ),
  braces: (
    <path d="M8 4H6v5.5L4 12l2 2.5V20h2M16 4h2v5.5l2 2.5-2 2.5V20h-2" />
  ),
  asterisk: <path d="M12 4v16M5 7.5l14 9M19 7.5l-14 9" />,
};

export function IconPlaceholder({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
