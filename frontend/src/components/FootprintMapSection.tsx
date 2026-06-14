export default function FootprintMapSection() {
  const nodes = [
    { title: "GitHub Repository", detail: "", bg: "bg-white" },
    { title: "Docker Container", detail: "node:20, port 3000", bg: "bg-[#EFE9DC]" },
    { title: "Reverse Proxy", detail: "Caddy, ports 80/443", bg: "bg-white" },
    { title: "Public Domain", detail: "myapp.infrapilot.dev", bg: "bg-[#EFE9DC]" },
    { title: "Open Ports", detail: "22, 80, 443", bg: "bg-white" },
    { title: "Connected Services", detail: "PostgreSQL, Redis, S3", bg: "bg-[#EFE9DC]" },
  ];

  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 06 — footprint
          </span>
        </div>

        <div className="max-w-2xl mx-auto relative pl-6">
          {/* Vertical Connecting Line */}
          <div className="absolute top-4 bottom-4 left-[2.25rem] w-px bg-[var(--border-color)] z-0" />

          <div className="space-y-6">
            {nodes.map((node, idx) => (
              <div key={idx} className="relative z-10 flex items-center gap-6">
                {/* Dot marker */}
                <div className="w-3 h-3 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] z-20" />
                
                <div className={`flex-1 border border-[var(--border-color)] ${node.bg} p-4 flex flex-col sm:flex-row sm:items-center justify-between`}>
                  <span className="font-body font-bold text-[var(--text-primary)]">{node.title}</span>
                  {node.detail && (
                    <span className="font-mono text-sm text-[var(--text-secondary)] mt-1 sm:mt-0 bg-white/50 px-2 py-1 border border-[var(--border-color)]/30">
                      {node.detail}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
