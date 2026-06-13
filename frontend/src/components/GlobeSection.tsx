"use client";

import dynamic from "next/dynamic";
import { Server, Globe, Cpu } from "lucide-react";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

export default function GlobeSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-bg-main)] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
            Your infrastructure, audited and ready
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            We don't lock you in. InfraPilot deploys directly to your own servers via SSH, but not before running a comprehensive security pass.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <Server className="w-6 h-6 text-[var(--color-accent-blue)] mb-3" />
              <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Major Clouds</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">AWS, Oracle, Azure, DigitalOcean fully supported.</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <Cpu className="w-6 h-6 text-[var(--color-accent-green)] mb-3" />
              <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Bare Metal & IoT</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">Deploy seamlessly to your home lab or Raspberry Pi.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full relative h-[600px] flex items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <div className="absolute top-4 left-4 bg-[var(--color-bg-main)] text-[var(--color-text-secondary)] text-xs font-mono px-3 py-1 rounded border border-[var(--color-border)] z-10 flex items-center gap-2">
            <Globe className="w-3 h-3" /> Interactive: Click nodes to view
          </div>
          <GlobeScene />
        </div>
      </div>
    </section>
  );
}
