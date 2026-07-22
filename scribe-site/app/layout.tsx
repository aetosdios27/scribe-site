import type { Metadata } from "next";
import { GeistMono, GeistPixelCircle, texGyreHeros } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "scribe — your best ideas belong on your website.",
  description:
    "scribe is technical publishing infrastructure for developer-owned websites. write in markdown, publish on your own domain, and keep your design, content, traffic, and audience.",
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
      </body>
    </html>
  );
}
