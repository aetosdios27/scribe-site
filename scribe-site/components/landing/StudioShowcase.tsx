import { IconPlaceholder } from "./IconPlaceholder";
import { SectionLabel } from "./SectionLabel";

/* static landing-page showcase of scribe studio — not the real application.
   editor + preview contents are illustrative and hidden from assistive tech;
   the accessible description lives in the section heading and info rail. */

type EditorLine = {
  text: string;
  tone?: "plain" | "cobalt" | "dim" | "code";
};

const EDITOR_LINES: EditorLine[] = [
  { text: "# Getting Started with Scribe", tone: "cobalt" },
  { text: "Scribe is the fastest way to publish technical" },
  { text: "content on your own site." },
  { text: "" },
  { text: "## Zero setup", tone: "cobalt" },
  { text: "No databases. No dashboards. No nonsense." },
  { text: "Just write in Markdown and ship." },
  { text: "" },
  { text: "```bash", tone: "dim" },
  { text: "npx create-scribe@latest my-docs", tone: "code" },
  { text: "cd my-docs", tone: "code" },
  { text: "npm run dev", tone: "code" },
  { text: "```", tone: "dim" },
  { text: "" },
  { text: "## Built for developers", tone: "cobalt" },
  { text: "Own your content. Own your code." },
  { text: "Ship on your terms." },
];

const LINE_TONES: Record<NonNullable<EditorLine["tone"]>, string> = {
  plain: "text-scribe-paper/75",
  cobalt: "text-scribe-cobalt",
  dim: "text-scribe-paper/40",
  code: "text-scribe-paper/90",
};

export function StudioShowcase() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="scroll-mt-16 border-t border-scribe-rule"
    >
      <div className="shell py-16 sm:py-24 lg:py-32">
        <SectionLabel>scribe studio</SectionLabel>
        <h2 id="studio-heading" className="sr-only">
          scribe studio: edit markdown on the left, see your real website live
          on the right
        </h2>

        {/* product window */}
        <div className="mt-8 overflow-hidden rounded-xs border-2 border-scribe-ink bg-scribe-ink">
          {/* title bar */}
          <div className="flex h-10 items-center gap-2 bg-scribe-ink pr-3 pl-2 text-scribe-paper">
            <span
              aria-hidden="true"
              className="flex h-full items-center gap-2 border-x border-scribe-white/10 bg-scribe-white/10 px-3 font-mono text-[11px]"
            >
              <IconPlaceholder name="doc" className="size-3.5" />
              getting-started.md
              <span className="text-scribe-paper/50">×</span>
            </span>
            <span
              aria-hidden="true"
              className="grid size-6 place-items-center font-mono text-sm text-scribe-paper/60"
            >
              +
            </span>
            <span
              aria-hidden="true"
              className="ml-auto flex items-center gap-2"
            >
              <i className="block size-2.5 border border-scribe-paper/60" />
              <i className="block size-2.5 border border-scribe-paper/60" />
              <i className="block size-2.5 bg-scribe-paper/60" />
            </span>
          </div>

          {/* window body */}
          <div className="grid grid-cols-1 border-t border-scribe-white/10 lg:min-h-[580px] lg:grid-cols-[2.5rem_minmax(0,1fr)_0.375rem_minmax(0,1.15fr)] xl:min-h-[640px] xl:grid-cols-[2.5rem_minmax(0,1fr)_0.375rem_minmax(0,1.15fr)_14rem]">
            {/* editor icon rail */}
            <div
              aria-hidden="true"
              className="hidden flex-col items-center gap-5 border-r border-scribe-white/10 py-4 text-scribe-paper/50 lg:flex"
            >
              <IconPlaceholder name="doc" className="size-4 text-scribe-paper" />
              <IconPlaceholder name="braces" className="size-4" />
              <IconPlaceholder name="terminal" className="size-4" />
              <IconPlaceholder name="gauge" className="size-4" />
              <IconPlaceholder name="asterisk" className="mt-auto size-4" />
            </div>

            {/* editor pane */}
            <div className="flex min-w-0 flex-col bg-scribe-ink">
              <p className="border-b border-scribe-white/10 px-4 py-2 font-mono text-[10px] text-scribe-paper/50 lg:hidden">
                getting-started.md · markdown
              </p>
              <div aria-hidden="true" className="flex-1 overflow-x-auto p-4 sm:p-5">
                <pre className="flex font-mono text-[13px] leading-[1.65]">
                  <span className="pr-4 text-right text-scribe-paper/30 select-none">
                    {EDITOR_LINES.map((_, i) => (
                      <span key={i} className="block">
                        {i + 1}
                      </span>
                    ))}
                  </span>
                  <code>
                    {EDITOR_LINES.map((line, i) => (
                      <span
                        key={i}
                        className={`block whitespace-pre ${LINE_TONES[line.tone ?? "plain"]}`}
                      >
                        {line.text || " "}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
              <p className="flex items-center justify-between border-t border-scribe-white/10 px-4 py-2 font-mono text-[10px] text-scribe-paper/50">
                <span>markdown&nbsp;&nbsp;&nbsp;312 words</span>
                <span>Ln 1, Col 1&nbsp;&nbsp;&nbsp;spaces: 2</span>
              </p>
            </div>

            {/* draggable divider (visual only in phase 1) */}
            <div
              aria-hidden="true"
              title="drag to resize"
              className="relative hidden cursor-col-resize items-center justify-center border-x border-scribe-white/10 bg-scribe-ink lg:flex"
            >
              <span className="grid grid-cols-2 gap-[3px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <i key={i} className="block size-[3px] bg-scribe-paper/40" />
                ))}
              </span>
            </div>

            {/* preview pane */}
            <div className="min-w-0 border-t border-scribe-white/10 bg-scribe-paper lg:border-t-0">
              <p className="border-b border-scribe-rule px-4 py-2 font-mono text-[10px] text-scribe-muted lg:hidden">
                preview · localhost:3000
              </p>
              <div aria-hidden="true" className="p-6 sm:p-8 lg:p-10">
                <p className="text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
                  Getting Started with Scribe
                </p>
                <p className="mt-3 text-sm leading-relaxed text-scribe-ink/80">
                  Scribe is the fastest way to publish technical content on
                  your own site.
                </p>
                <p className="mt-6 text-lg font-bold tracking-tight">
                  Zero setup
                </p>
                <p className="mt-2 text-sm leading-relaxed text-scribe-ink/80">
                  No databases. No dashboards. No nonsense. Just write in
                  Markdown and ship.
                </p>
                <p className="mt-4 overflow-x-auto rounded-xs bg-scribe-ink p-4 font-mono text-xs leading-6 text-scribe-paper">
                  npx create-scribe@latest my-docs
                  <br />
                  cd my-docs
                  <br />
                  npm run dev
                </p>
                <p className="mt-6 text-lg font-bold tracking-tight">
                  Built for developers
                </p>
                <p className="mt-2 text-sm leading-relaxed text-scribe-ink/80">
                  Own your content. Own your code. Ship on your terms.
                </p>
              </div>
            </div>

            {/* information rail */}
            <div className="grid grid-cols-1 border-t border-scribe-white/10 sm:grid-cols-3 lg:col-span-4 xl:col-span-1 xl:border-t-0 xl:border-l xl:grid-cols-1">
              <div className="border-scribe-white/10 p-4 not-last:border-b sm:not-last:border-b-0 sm:not-last:border-r xl:not-last:border-r-0 xl:not-last:border-b">
                <p className="font-mono text-[10px] text-scribe-paper/50">
                  / live sync
                </p>
                <p className="mt-3 text-sm leading-snug text-scribe-paper">
                  edit on the left.
                  <br />
                  see it live on the right.
                </p>
                <span
                  aria-hidden="true"
                  className="mt-4 flex items-center gap-2"
                >
                  <i className="block size-7 border border-dashed border-scribe-paper/50" />
                  <i className="h-px flex-1 bg-scribe-paper/40" />
                  <i className="block size-1.5 rounded-full bg-scribe-cobalt" />
                  <i className="h-px flex-1 bg-scribe-paper/40" />
                  <i className="block size-7 border border-scribe-paper" />
                </span>
              </div>
              <div className="border-scribe-white/10 p-4 not-last:border-b sm:not-last:border-b-0 sm:not-last:border-r xl:not-last:border-r-0 xl:not-last:border-b">
                <p className="font-mono text-[10px] text-scribe-paper/50">
                  / everything mdx
                </p>
                <p className="mt-3 text-sm leading-snug text-scribe-paper">
                  components, imports, embeds, shortcodes. all first-class.
                </p>
                <IconPlaceholder
                  name="braces"
                  className="mt-4 size-5 text-scribe-paper/60"
                />
              </div>
              <div className="p-4">
                <p className="font-mono text-[10px] text-scribe-paper/50">
                  / deploy anywhere
                </p>
                <p className="mt-3 text-sm leading-snug text-scribe-paper">
                  your site.
                  <br />
                  your domain.
                  <br />
                  your rules.
                </p>
                <IconPlaceholder
                  name="cloud"
                  className="mt-4 size-5 text-scribe-paper/60"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 font-mono text-xs text-scribe-muted">
          fig. 3 - studio running against a real site. the divider drags, the
          preview is your real localhost.
        </p>
      </div>
    </section>
  );
}
