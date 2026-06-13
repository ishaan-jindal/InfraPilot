"use client";

import { ShieldAlert, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";

export default function AuditReportSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)] relative z-10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1">
          <h2 className="font-display text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
            A literal security report for every build
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mb-6">
            Stop guessing if you accidentally exposed an API key. We scan for secrets, check network configuration, and analyze dependencies.
          </p>
          <p className="text-[var(--color-text-secondary)] mb-8">
            When we find an issue, we provide an AI-suggested fix you can apply with one click before deploying.
          </p>
          <a href="#" className="inline-flex items-center text-[var(--color-accent-blue)] font-medium hover:underline">
            View sample audit rules <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="flex-1 w-full max-w-md bg-[var(--color-bg-main)] rounded-xl border border-[var(--color-border)] shadow-lg overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">Security Audit</span>
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] font-mono">commit #a1b2c3d</span>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-md bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/20">
              <ShieldAlert className="w-5 h-5 text-[var(--color-accent-coral)] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)]">Hardcoded STRIPE_SECRET</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">Found in src/utils/payments.ts:24</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-md bg-[var(--color-accent-amber)]/10 border border-[var(--color-accent-amber)]/20">
              <AlertTriangle className="w-5 h-5 text-[var(--color-accent-amber)] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)]">Missing HTTP-to-HTTPS redirect</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">Nginx config lacks redirect block.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-md bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/20">
              <ShieldCheck className="w-5 h-5 text-[var(--color-accent-green)] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-[var(--color-text-primary)]">Dependencies safe</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">Checked 142 packages.</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex gap-3">
            <button className="flex-1 py-2 rounded-md bg-[var(--color-bg-main)] text-[var(--color-text-secondary)] text-sm font-medium border border-[var(--color-border)] hover:bg-[var(--color-border)]/50 transition-colors">
              Deploy anyway
            </button>
            <button className="flex-1 py-2 rounded-md bg-[var(--color-accent-blue)] text-white text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm">
              Apply Fixes & Deploy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
