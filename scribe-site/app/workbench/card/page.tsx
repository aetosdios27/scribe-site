import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DitherDiamond } from "./DitherDiamond";

export const metadata: Metadata = {
  title: "dev - card workbench",
  robots: { index: false, follow: false },
};

export default function CardWorkbench() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="grid min-h-screen place-items-center bg-[#efeee9] p-6">
      <div className="relative h-[min(76vh,680px)] w-[min(72vw,420px)] overflow-hidden bg-white">
        <DitherDiamond />
      </div>
    </main>
  );
}
