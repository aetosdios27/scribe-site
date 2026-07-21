import { CompatibilityStrip } from "@/components/landing/CompatibilityStrip";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { PricingSection } from "@/components/landing/PricingSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { StudioShowcase } from "@/components/landing/StudioShowcase";
import { ValueStrip } from "@/components/landing/ValueStrip";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <StudioShowcase />
        <ValueStrip />
        <PricingSection />
        <CompatibilityStrip />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
