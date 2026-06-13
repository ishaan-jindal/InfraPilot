export default function ContinuousMonitoringSection() {
  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="bg-white border border-[var(--border-color)] border-l-[4px] border-l-[var(--severity-medium)] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-3">
                New vulnerability detected
              </h3>
              <div className="font-mono text-sm text-[var(--text-secondary)] space-y-1">
                <div>Package: express 4.18.2</div>
                <div>CVE: CVE-2024-XXXX</div>
                <div>Severity: <span className="text-[var(--severity-high-text)] bg-[var(--severity-high-bg)] px-1">High</span></div>
                <div>Fix: Upgrade to 4.19.0</div>
              </div>
            </div>

            <button className="whitespace-nowrap px-6 py-3 font-bold bg-[var(--accent-indigo)] text-white hover:opacity-90 transition-opacity">
              Auto-fix & redeploy
            </button>
            
          </div>
        </div>
      </div>
    </section>
  );
}
