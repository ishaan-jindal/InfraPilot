import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import ThreeLayersSection from "@/components/ThreeLayersSection";

import HowItWorksSection from "@/components/HowItWorksSection";
import RiskReportSection from "@/components/RiskReportSection";
import AIAdvisorSection from "@/components/AIAdvisorSection";

import SecretLeakSection from "@/components/SecretLeakSection";
import DockerAnalyzerSection from "@/components/DockerAnalyzerSection";
import ThreatSimulatorSection from "@/components/ThreatSimulatorSection";
import FootprintMapSection from "@/components/FootprintMapSection";
import ContinuousMonitoringSection from "@/components/ContinuousMonitoringSection";

import DeployAnywhereSection from "@/components/DeployAnywhereSection";
import BeforeAfterScoreSection from "@/components/BeforeAfterScoreSection";
import TrustStripSection from "@/components/TrustStripSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-body selection:bg-[var(--accent-indigo)] selection:text-white pb-20">
      <Navbar />
      <Hero />
      <ProblemSection />
      <ThreeLayersSection />
      
      <HowItWorksSection />
      <RiskReportSection />
      <AIAdvisorSection />
      
      <SecretLeakSection />
      <DockerAnalyzerSection />
      <ThreatSimulatorSection />
      <FootprintMapSection />
      <ContinuousMonitoringSection />
      
      <DeployAnywhereSection />
      <BeforeAfterScoreSection />
      <TrustStripSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
