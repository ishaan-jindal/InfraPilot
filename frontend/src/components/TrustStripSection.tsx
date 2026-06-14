import { Lock, FileCode, Server } from "lucide-react";

export default function TrustStripSection() {
  const trustItems = [
    { icon: <Lock className="w-5 h-5 text-[var(--accent-indigo)]" />, text: "No data stored beyond your session" },
    { icon: <FileCode className="w-5 h-5 text-[var(--accent-indigo)]" />, text: "Open scanning rules" },
    { icon: <Server className="w-5 h-5 text-[var(--accent-indigo)]" />, text: "Self-hosted option available" },
  ];

  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <span className="font-mono text-sm text-[var(--text-secondary)] block">
            // 09 — trust
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.icon}
              <span className="font-body font-medium text-[var(--text-primary)]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
