import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { ProductFilm } from "@/components/landing/ProductFilm";
import { TechnicalProof } from "@/components/landing/TechnicalProof";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemStatement />
        <ProductFilm />
        <TechnicalProof />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
