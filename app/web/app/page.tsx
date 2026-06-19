import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { IntegrationsSection } from "@/components/landingPage/IntegrationsSection";
import { FinalCTA } from "@/components/landingPage/FinalCTA";
import { Footer } from "@/components/landingPage/Footer";

export default function App() {
  return (
    <div className="page-root" style={{ background: "#060608", color: "#F0EEE9", fontFamily: "var(--font-body)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <IntegrationsSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
