import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import PipelineSection from "@/components/PipelineSection";
import FrameworksSection from "@/components/FrameworksSection";
import ThreatSimulatorSection from "@/components/ThreatSimulatorSection";
import FootprintMapSection from "@/components/FootprintMapSection";
import ManagedSection from "@/components/ManagedSection";
import SplitUniverseSection from "@/components/SplitUniverseSection";
import GlobeSection from "@/components/GlobeSection";
import AuditReportSection from "@/components/AuditReportSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)] font-body transition-colors duration-300">
      <Navbar />
      <Hero />
      <ProblemSection />
      <PipelineSection />
      <FrameworksSection />
      <ThreatSimulatorSection />
      <FootprintMapSection />
      <ManagedSection />
      <SplitUniverseSection />
      <GlobeSection />
      <AuditReportSection />
      <Footer />
    </main>
  );
}
