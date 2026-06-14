"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const GithubIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);



export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6 relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-24 items-center">
          {/* Left Column */}
          <div className="flex flex-col items-start z-10">
            <span className="font-mono text-sm text-[var(--text-secondary)] mb-4">
              // secure deployment, validated
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
              Own your infrastructure.<br />Verify its security.
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-xl">
              InfraPilot audits your repo and infrastructure, scores your security posture out of 100, fixes what it can with AI, and deploys you anywhere — managed or self-hosted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="inline-flex items-center justify-center px-6 py-3 font-bold bg-[var(--accent-indigo)] text-white hover:opacity-90 transition-opacity">
                Run a free audit
              </a>
              <a href="https://github.com/isha-jindal/InfraPilot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors bg-white">
                <GithubIcon />
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right Column: Score Card & 3D */}
          <div className="relative w-full max-w-md mx-auto lg:ml-auto">
            {/* Dotted Scan Grid Background */}
            <div className="absolute inset-0 -m-8 bg-scan-grid opacity-60 pointer-events-none" />
            
            {/* 3D Element Floating slightly behind/beside the card */}
            <div className="absolute -top-16 -right-16 w-32 h-32 z-0 pointer-events-none">
              <HeroScene />
            </div>

            {/* Score Card */}
            <div className="relative z-10 bg-white border border-[var(--border-color)] shadow-sm transform -rotate-2 p-6">
              <div className="flex justify-between items-start mb-6 border-b border-[var(--border-color)] pb-6">
                <div>
                  <div className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-2">Security Score</div>
                  <div className="text-6xl font-mono text-[var(--severity-high)] font-bold">
                    73<span className="text-2xl text-[var(--text-secondary)]">/100</span>
                  </div>
                </div>
                <div className="bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] font-mono text-xs px-3 py-1 border border-[var(--severity-critical)]/20">
                  1 critical issue
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body text-[var(--text-primary)] font-medium">Secrets management</span>
                  <span className="font-mono text-xs text-[var(--severity-critical)] bg-[var(--severity-critical-bg)] px-2 py-1">critical</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body text-[var(--text-primary)] font-medium">SSH hardening</span>
                  <span className="font-mono text-xs text-[var(--severity-high-text)] bg-[var(--severity-high-bg)] px-2 py-1">high</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body text-[var(--text-primary)] font-medium">HTTPS / SSL</span>
                  <span className="font-mono text-xs text-[var(--severity-pass)] bg-[var(--severity-pass-bg)] px-2 py-1">pass</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body text-[var(--text-primary)] font-medium">Dependencies</span>
                  <span className="font-mono text-xs text-[var(--severity-pass)] bg-[var(--severity-pass-bg)] px-2 py-1">pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Rule & Trust Text */}
        <div className="pt-8 border-t border-[var(--border-color)] text-center">
          <span className="font-mono text-xs text-[var(--text-secondary)] tracking-tight">
            // works with — AWS · Oracle Cloud · DigitalOcean · Hetzner · Azure · Raspberry Pi · Any Linux server via SSH
          </span>
        </div>
      </div>
    </section>
  );
}
