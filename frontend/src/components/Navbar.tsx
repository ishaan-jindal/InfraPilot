"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-[var(--color-bg-main)]/80 border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[var(--color-accent-blue)]" />
          <span className="font-display font-bold text-xl tracking-tight text-[var(--color-text-primary)]">
            InfraPilot
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
            <a href="#how-it-works" className="hover:text-[var(--color-text-primary)] transition-colors">How it works</a>
            <a href="#infrastructure" className="hover:text-[var(--color-text-primary)] transition-colors">Infrastructure</a>
            <a href="#security" className="hover:text-[var(--color-text-primary)] transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors border border-transparent hover:border-[var(--color-border)]"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            <a href="#" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-accent-blue)] text-white hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(45,91,255,0.3)]">
              Run free audit
            </a>

            <div className="border-l border-[var(--color-border)] pl-4 ml-1">
              <a
                href="http://localhost:8000/auth/github"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all bg-[var(--color-surface)]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
