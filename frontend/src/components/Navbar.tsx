"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getOAuthUrl } from "@/lib/api";
import { getToken, clearToken } from "@/lib/auth";
import { LayoutDashboard, LogOut } from "lucide-react";

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthenticated(!!getToken());
  }, []);

  /* Don't show the landing-page navbar inside the dashboard */
  if (pathname?.startsWith("/dashboard")) return null;

  const handleSignOut = () => {
    clearToken();
    setAuthenticated(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--bg-main)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="font-display font-medium text-xl tracking-tight text-[var(--text-primary)]">
          InfraPilot
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-body text-[var(--text-secondary)]">
          <Link href="#product"       className="hover:text-[var(--text-primary)] transition-colors">Product</Link>
          <Link href="#how-it-works"  className="hover:text-[var(--text-primary)] transition-colors">How it works</Link>
          <Link href="#security-score"className="hover:text-[var(--text-primary)] transition-colors">Security Score</Link>
          <Link href="#docs"          className="hover:text-[var(--text-primary)] transition-colors">Docs</Link>
        </div>

        {/* Right-side CTAs */}
        <div className="flex items-center gap-3">
          {mounted && (
            authenticated ? (
              /* ── Signed-in state ── */
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] bg-white hover:bg-gray-50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              /* ── Signed-out state ── */
              <>
                {/* GitHub Sign In — outline style */}
                <a
                  href={getOAuthUrl()}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border-color)] text-[var(--text-primary)] bg-white hover:bg-gray-50 transition-colors"
                >
                  <GithubIcon />
                  Sign in with GitHub
                </a>

                {/* Primary CTA */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold bg-[var(--accent-indigo)] text-white hover:opacity-90 transition-opacity"
                >
                  Run a free audit
                </Link>
              </>
            )
          )}

          {/* Skeleton placeholder while mounting to avoid layout shift */}
          {!mounted && (
            <div className="h-9 w-36 bg-[var(--border-color)] opacity-40 animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
}
