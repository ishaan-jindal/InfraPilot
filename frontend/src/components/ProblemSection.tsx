export default function ProblemSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 01 — the problem
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] max-w-4xl leading-tight">
            Modern deployment platforms make it easy to ship code — none of them tell you if that code is safe to ship.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Managed platforms card */}
          <div className="bg-[#EFE9DC] border border-[var(--border-color)] p-8">
            <h3 className="font-display font-bold text-xl mb-6">Managed platforms</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-green-600 font-bold">✓</span>
                Easy deployment
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-green-600 font-bold">✓</span>
                Great developer experience
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-red-500 font-bold">✕</span>
                Zero visibility into security posture
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-red-500 font-bold">✕</span>
                Vendor lock-in
              </li>
            </ul>
          </div>

          {/* Self-hosted card */}
          <div className="bg-[#EFE9DC] border border-[var(--border-color)] p-8">
            <h3 className="font-display font-bold text-xl mb-6">Self-hosted infrastructure</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-green-600 font-bold">✓</span>
                Full ownership
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-green-600 font-bold">✓</span>
                Lower long-term costs
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-red-500 font-bold">✕</span>
                Complex security configuration
              </li>
              <li className="flex items-start gap-3 text-[var(--text-secondary)]">
                <span className="text-red-500 font-bold">✕</span>
                SSL, firewalls, SSH left to the developer
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Statement */}
        <div className="bg-white border border-[var(--border-color)] p-8 text-center max-w-3xl mx-auto">
          <p className="font-display font-bold text-xl text-[var(--text-primary)]">
            Neither option tells you how exposed you are. <span className="text-[var(--accent-indigo)]">InfraPilot does — before you deploy.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
