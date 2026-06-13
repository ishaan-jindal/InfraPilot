export default function BeforeAfterScoreSection() {
  return (
    <section id="security-score" className="py-32 px-6 relative bg-[var(--bg-main)] scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 08 — the result
          </span>
          <h2 className="font-display text-4xl font-bold text-[var(--text-primary)]">
            From risky to secure
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* Before Card */}
          <div className="bg-white border border-[var(--border-color)] p-8 w-full max-w-sm shadow-sm flex flex-col items-center">
            <div className="text-sm font-mono text-[var(--text-secondary)] uppercase mb-4">Before InfraPilot</div>
            <div className="text-7xl font-mono text-[var(--severity-high)] font-bold mb-6">
              73<span className="text-3xl text-[var(--text-secondary)]">/100</span>
            </div>
            <div className="bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] font-mono text-sm px-4 py-2 border border-[var(--severity-critical)]/20 uppercase tracking-wider font-bold">
              1 critical issue
            </div>
          </div>

          {/* Arrow */}
          <div className="font-mono text-4xl text-[var(--text-secondary)] hidden md:block">
            →
          </div>
          <div className="font-mono text-4xl text-[var(--text-secondary)] md:hidden transform rotate-90">
            →
          </div>

          {/* After Card */}
          <div className="bg-white border-2 border-[var(--severity-pass)] p-8 w-full max-w-sm shadow-md flex flex-col items-center relative">
            {/* Success badge */}
            <div className="absolute -top-3 -right-3 bg-[var(--severity-pass)] text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-[var(--bg-main)]">
              ✓
            </div>
            <div className="text-sm font-mono text-[var(--text-secondary)] uppercase mb-4">After Deployment</div>
            <div className="text-7xl font-mono text-[var(--severity-pass)] font-bold mb-6">
              94<span className="text-3xl text-[var(--text-secondary)]">/100</span>
            </div>
            <div className="w-full font-mono text-xs text-[var(--text-secondary)] space-y-2 pt-4 border-t border-[var(--border-color)]">
              <div className="flex justify-between"><span>Open Ports:</span> <span className="text-[var(--text-primary)] font-bold">80, 443</span></div>
              <div className="flex justify-between"><span>SSL:</span> <span className="text-[var(--text-primary)] font-bold">Valid (A+)</span></div>
              <div className="flex justify-between"><span>SSH:</span> <span className="text-[var(--text-primary)] font-bold">Key-only</span></div>
              <div className="flex justify-between"><span>Risk Level:</span> <span className="text-[var(--severity-pass)] font-bold">Low</span></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
