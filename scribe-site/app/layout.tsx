import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SmoothScroll } from "@/components/SmoothScroll";
import ClickSpark from "@/components/reactbits/click-spark";
import { GeistMono, GeistPixelCircle, texGyreHeros } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "scribe — your best ideas belong on your website.",
  description:
    "scribe is technical publishing infrastructure for developer-owned websites. write in markdown, publish on your own domain, and keep your design, content, traffic, and audience.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Scribe — publishing infrastructure for the open web",
    description:
      "Write in Markdown, publish on your own domain, and keep your content, design, traffic, and audience.",
    siteName: "Scribe",
    type: "website",
    images: [
      {
        url: "/open-graph-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Scribe — publishing infrastructure for the open web",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scribe — publishing infrastructure for the open web",
    description:
      "Write in Markdown, publish on your own domain, and keep your content, design, traffic, and audience.",
    images: ["/open-graph-1200x630.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        texGyreHeros.variable,
        GeistMono.variable,
        GeistPixelCircle.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="flex min-h-full flex-col bg-scribe-paper font-sans text-scribe-ink">
        {children}
        <SmoothScroll />
        <ClickSpark />
        <Analytics />
      </body>
    </html>
  );
}
