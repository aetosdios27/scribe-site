import type { IconName } from "./IconPlaceholder";

/* ---------------------------------------------------------------------------
   central content/data for the landing page.
   keep copy and structure here instead of burying values in JSX.
--------------------------------------------------------------------------- */

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "product", href: "#product" },
  { label: "github", href: "https://github.com/aetosdios27/scribe-site" },
];

export type Truth = {
  icon: IconName;
  lines: [string, string];
};

export const HERO_TRUTHS: Truth[] = [
  { icon: "users", lines: ["built for devs,", "by devs"] },
  { icon: "markdown", lines: ["markdown first,", "always"] },
  { icon: "infinity", lines: ["own your content.", "forever"] },
  { icon: "lockOpen", lines: ["no lock-in.", "ever."] },
];

export type Pain = {
  index: string;
  title: string;
  icon: IconName;
  points: string[];
};

export const PAINS: Pain[] = [
  {
    index: "01",
    title: "complex toolchains",
    icon: "terminal",
    points: ["bundlers", "configs", "plugins", "build steps"],
  },
  {
    index: "02",
    title: "mdx madness",
    icon: "doc",
    points: ["frontmatter", "components", "imports", "edge cases"],
  },
  {
    index: "03",
    title: "theming rabbit hole",
    icon: "brush",
    points: ["tokens", "overrides", "variants", "specificity wars"],
  },
  {
    index: "04",
    title: "responsive nightmares",
    icon: "device",
    points: ["breakpoints", "layout shifts", "overflow", "pixel chasing"],
  },
  {
    index: "05",
    title: "performance tax",
    icon: "gauge",
    points: ["unused js", "slow images", "metrics down", "core web vitals"],
  },
  {
    index: "06",
    title: "content blocked",
    icon: "lock",
    points: ["context switching", "deployment friction", "feature bloat", "creativity dead"],
  },
];

export type Value = {
  icon: IconName;
  title: string;
  copy: string;
};

export const VALUES: Value[] = [
  {
    icon: "markdown",
    title: "markdown first",
    copy: "write naturally. we handle the rest.",
  },
  {
    icon: "lockOpen",
    title: "own your content",
    copy: "no lock-in. export anytime, anywhere.",
  },
  {
    icon: "bolt",
    title: "fast by default",
    copy: "lightweight output. core web vitals approved.",
  },
  {
    icon: "terminal",
    title: "developer native",
    copy: "cli, apis, git integrations, and automation.",
  },
  {
    icon: "sparkle",
    title: "beautiful out of the box",
    copy: "clean defaults. easy to customize.",
  },
  {
    icon: "bars",
    title: "built to scale",
    copy: "from side projects to global docs. we've got you.",
  },
];

export type PricingFeature = {
  label: string;
  soon?: boolean;
};

export type PricingTier = {
  name: string;
  price: string;
  period: string;
  blurb: string;
  features: PricingFeature[];
  cta: { label: string; href: string };
  popular?: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "free",
    price: "$0",
    period: "/ mo",
    blurb: "perfect for getting started.",
    features: [
      { label: "one site" },
      { label: "markdown editor" },
      { label: "basic themes" },
      { label: "community support" },
    ],
    cta: { label: "start free", href: "#install" },
  },
  {
    name: "pro",
    price: "$19",
    period: "/ mo",
    blurb: "everything you need to ship.",
    features: [
      { label: "unlimited sites" },
      { label: "custom domains" },
      { label: "advanced themes" },
      { label: "priority support" },
      { label: "analytics", soon: true },
    ],
    cta: { label: "get pro", href: "#install" },
    popular: true,
  },
  {
    name: "teams",
    price: "$59",
    period: "/ mo",
    blurb: "built for teams and scale.",
    features: [
      { label: "everything in pro" },
      { label: "team collaboration" },
      { label: "role-based access" },
      { label: "private plugins" },
      { label: "sla & priority support" },
    ],
    cta: { label: "contact sales", href: "#" },
  },
];

export const STACK: string[] = ["Next.js", "Vite", "Astro", "Remix", "plain HTML"];

export const FOOTER_LEGAL: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
