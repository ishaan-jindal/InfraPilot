import { Container } from "lucide-react";

export default function DockerAnalyzerSection() {
  const items = [
    { label: "Running as root", status: "fail" },
    { label: "Exposing unnecessary ports", status: "fail" },
    { label: "Using \"latest\" tags (unpinned dependencies)", status: "pass" },
    { label: "Missing health checks", status: "fail" },
    { label: "Privileged mode enabled", status: "pass" },
    { label: "Sensitive files copied into image", status: "pass" },
  ];

  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-8">
          Docker security analyzer
        </h2>

        <div className="max-w-3xl bg-white border border-[var(--border-color)]">
          <ul className="divide-y divide-[var(--border-color)]">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Container className="w-5 h-5 text-[var(--accent-indigo)]" />
                  <span className="font-body text-[var(--text-primary)]">{item.label}</span>
                </div>
                {item.status === "pass" ? (
                  <span className="font-mono text-xs font-bold text-[var(--severity-pass)] bg-[var(--severity-pass-bg)] px-3 py-1 uppercase tracking-wider">
                    pass
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold text-[var(--severity-critical)] bg-[var(--severity-critical-bg)] px-3 py-1 uppercase tracking-wider">
                    fail
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
