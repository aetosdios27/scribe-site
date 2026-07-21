import Link from "next/link";

/* shared link-button. variants cover the three button contexts on the page:
   cobalt primary, ink outline on paper, and paper on the cobalt cta band. */

type Variant = "primary" | "outline" | "onCobalt";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "border border-scribe-cobalt bg-scribe-cobalt text-scribe-white hover:bg-scribe-cobalt-dark hover:border-scribe-cobalt-dark",
  outline:
    "border border-scribe-rule-strong text-scribe-ink hover:bg-scribe-ink hover:text-scribe-paper hover:border-scribe-ink",
  onCobalt:
    "border border-scribe-paper bg-scribe-paper text-scribe-ink hover:bg-scribe-white",
};

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xs px-5 font-mono text-sm lowercase transition-colors ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
