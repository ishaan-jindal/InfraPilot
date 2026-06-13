import { BrainCircuit, Check } from "lucide-react";

export default function AIAdvisorSection() {
  const fixes = [
    "Rotate exposed AWS key and remove from git history",
    "Add USER directive to Dockerfile (non-root)",
    "Disable SSH password auth, enforce key-only",
    "Restrict PostgreSQL to localhost or VPN",
    "Upgrade express to 4.19+",
    "Add security headers to reverse proxy config"
  ];

  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[var(--border-color)] border-t-[4px] border-t-[var(--accent-indigo)] shadow-sm">
          
          <div className="p-8 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-3 mb-8">
              <BrainCircuit className="w-6 h-6 text-[var(--accent-indigo)]" />
              <h3 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                Security check required — fix before deploying
              </h3>
            </div>

            <ul className="space-y-3 mb-8">
              {fixes.map((fix, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-[var(--severity-pass-bg)] p-1 rounded-sm">
                    <Check className="w-3 h-3 text-[var(--severity-pass)]" strokeWidth={3} />
                  </div>
                  <span className="font-body text-[var(--text-primary)]">{fix}</span>
                </li>
              ))}
            </ul>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[var(--severity-critical-bg)] border border-[var(--severity-critical)]/20 p-4 rounded-sm">
                <div className="font-mono text-xs text-[var(--severity-critical)] mb-2 uppercase font-bold tracking-wider">Before (Root)</div>
                <pre className="font-mono text-sm text-[#1A1A1A] overflow-x-auto">
                  <code>
<span className="opacity-50"># Dockerfile</span><br/>
FROM node:20<br/>
WORKDIR /app<br/>
COPY . .<br/>
RUN npm install<br/>
CMD ["npm", "start"]
                  </code>
                </pre>
              </div>
              <div className="bg-[var(--severity-pass-bg)] border border-[var(--severity-pass)]/20 p-4 rounded-sm">
                <div className="font-mono text-xs text-[var(--severity-pass)] mb-2 uppercase font-bold tracking-wider">After (Non-root)</div>
                <pre className="font-mono text-sm text-[#1A1A1A] overflow-x-auto">
                  <code>
<span className="opacity-50"># Dockerfile</span><br/>
FROM node:20<br/>
WORKDIR /app<br/>
COPY . .<br/>
RUN npm install<br/>
<strong className="text-[var(--severity-pass)] bg-[var(--severity-pass)]/10 px-1">USER node</strong><br/>
CMD ["npm", "start"]
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-end gap-4">
            <button className="px-6 py-2.5 font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
              Deploy anyway
            </button>
            <button className="px-6 py-2.5 font-bold bg-[var(--accent-indigo)] text-white hover:opacity-90 transition-opacity">
              Apply fixes & deploy
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
