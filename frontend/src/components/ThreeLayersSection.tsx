import { Rocket, ShieldAlert, BrainCircuit } from "lucide-react";

export default function ThreeLayersSection() {
  return (
    <section id="product" className="py-24 px-6 relative border-t border-[var(--border-color)] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 02 — how it's built
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            Three layers, one workflow
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-[var(--border-color)] p-8">
            <div className="bg-[var(--accent-indigo)] w-12 h-12 flex items-center justify-center mb-6">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-xl mb-4 text-[var(--text-primary)]">
              Deployment Engine
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              GitHub to Build to Deploy. Managed hosting or bring your own infrastructure. Automatic framework detection. Docker and Caddy with auto-HTTPS.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[var(--border-color)] p-8">
            <div className="bg-[var(--severity-high)] w-12 h-12 flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-xl mb-4 text-[var(--text-primary)]">
              Security Intelligence
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              Continuous analysis: secret detection, dependency CVEs, Docker misconfig, SSH hardening, open ports, HTTPS verification, git history scanning.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[var(--border-color)] p-8">
            <div className="bg-[#7C5CFC] w-12 h-12 flex items-center justify-center mb-6">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-xl mb-4 text-[var(--text-primary)]">
              Security Copilot (AI)
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              Explains risks in plain language, prioritizes fixes by severity, generates remediation commands and configs, simulates attack paths.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
