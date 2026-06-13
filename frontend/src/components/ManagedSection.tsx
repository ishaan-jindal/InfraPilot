"use client";

import dynamic from "next/dynamic";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";

const ServerRackScene = dynamic(() => import("./ServerRackScene"), { ssr: false });

export default function ManagedSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: 3D Scene */}
        <div className="flex-1 w-full relative h-[500px] flex items-center justify-center rounded-2xl bg-[var(--color-bg-main)] border border-[var(--color-border)] shadow-sm">
          <ServerRackScene />
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] text-sm font-medium border border-[var(--color-accent-blue)]/20">
            <CheckCircle2 className="w-4 h-4" /> Fully Managed Option
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
            No server setup. Audited and deployed in minutes.
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Don't want to manage your own servers? Use InfraPilot's secure managed cloud. We handle the SSL, the containerization, and the scaling — all backed by our strict pre-deploy audit.
          </p>
          
          <div className="bg-[var(--color-bg-main)] rounded-lg p-4 font-mono text-sm border border-[var(--color-border)] flex items-center justify-between mt-8 shadow-sm">
            <span className="text-[var(--color-text-secondary)]">Generated URL:</span>
            <div className="flex items-center gap-2 text-[var(--color-accent-green)] font-semibold bg-[var(--color-accent-green)]/10 px-3 py-1 rounded">
              <LinkIcon className="w-4 h-4" />
              https://your-app.infrapilot.dev
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
