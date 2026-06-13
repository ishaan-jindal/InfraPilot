import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer id="docs" className="py-12 px-6 bg-[var(--bg-main)] border-t border-[var(--border-color)] scroll-mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[var(--text-primary)]" />
          <span className="font-display font-bold text-lg text-[var(--text-primary)]">InfraPilot</span>
        </div>

        <div className="flex gap-6 text-sm font-body text-[var(--text-secondary)]">
          <Link href="#docs" className="hover:text-[var(--text-primary)] transition-colors">Docs</Link>
          <a href="https://github.com/isha-jindal/InfraPilot" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors">GitHub</a>
          <Link href="#sponsors" className="hover:text-[var(--text-primary)] transition-colors">Sponsors</Link>
        </div>

        <div className="font-mono text-xs text-[var(--text-secondary)]">
          © {new Date().getFullYear()} InfraPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
