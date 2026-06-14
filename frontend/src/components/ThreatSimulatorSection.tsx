export default function ThreatSimulatorSection() {
  const threats = [
    "Brute force SSH (password auth enabled, no fail2ban)",
    "PostgreSQL exposed on 0.0.0.0:5432 (no firewall rule)",
    "Leaked API key in git history (AWS account compromise)",
    "Container escape via privileged mode",
    "Dependency supply chain attack (3 outdated packages with known CVEs)",
  ];

  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl bg-white border border-[var(--border-color)] border-t-[4px] border-t-[#7C5CFC] shadow-sm">
          <div className="p-8">
            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-8">
              How could my server be attacked?
            </h3>
            
            <ol className="space-y-4">
              {threats.map((threat, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="font-mono font-bold text-[#7C5CFC] bg-[#7C5CFC]/10 px-2 py-0.5 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="font-body text-[var(--text-primary)] text-lg">
                    {threat}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
