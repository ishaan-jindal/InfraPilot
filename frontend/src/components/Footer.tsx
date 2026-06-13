"use client";

import { ShieldCheck, Code2, Globe, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-main)] py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-[var(--color-accent-blue)]" />
            <span className="font-display font-bold text-lg text-[var(--color-text-primary)]">
              InfraPilot
            </span>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm max-w-sm mb-6">
            Deploy with eyes open. The deployment platform that audits your repo and infrastructure before sending it live.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Code2 className="w-5 h-5" /></a>
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"><Briefcase className="w-5 h-5" /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Features</a></li>
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Integrations</a></li>
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Security</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Audit Rules</a></li>
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Trust Center</a></li>
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Data Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[var(--color-accent-blue)]">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--color-text-secondary)] gap-4">
        <span>© {new Date().getFullYear()} InfraPilot Inc. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> No data stored beyond session</span>
          <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> Open source scanner</span>
        </div>
      </div>
    </footer>
  );
}
