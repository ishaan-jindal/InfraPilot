import { AlertCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";

export default function RiskReportSection() {
  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 04 — what we find
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            See exactly what we find
          </h2>
        </div>

        <div className="bg-white border border-[var(--border-color)] overflow-hidden">
          
          {/* Critical Group */}
          <div className="border-b border-[var(--border-color)] border-l-4 border-l-[var(--severity-critical)]">
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-[var(--severity-critical)] mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-[var(--text-primary)]">AWS key exposed in commit history</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Found active access key in commit 8f2a9b. High risk of immediate account compromise.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--severity-critical)] uppercase tracking-wider">critical</span>
            </div>
          </div>

          {/* High Group */}
          <div className="border-b border-[var(--border-color)] border-l-4 border-l-[var(--severity-high)]">
            <div className="p-6 border-b border-[var(--border-color)] border-dashed flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-[var(--severity-high)] mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-[var(--text-primary)]">Container running as root</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Dockerfile lacks USER directive, process runs as root by default.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--severity-high-text)] uppercase tracking-wider">high</span>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-[var(--severity-high)] mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-[var(--text-primary)]">SSH password authentication enabled</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Server allows password login, vulnerable to brute force attacks.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--severity-high-text)] uppercase tracking-wider">high</span>
            </div>
          </div>

          {/* Medium Group */}
          <div className="border-b border-[var(--border-color)] border-l-4 border-l-[var(--severity-medium)]">
            <div className="p-6 border-b border-[var(--border-color)] border-dashed flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-[var(--severity-medium)] mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-[var(--text-primary)]">Port 5432 publicly accessible</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">PostgreSQL port open to 0.0.0.0. Should be restricted to localhost.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--severity-medium-text)] uppercase tracking-wider">medium</span>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-[var(--severity-medium)] mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-[var(--text-primary)]">Outdated dependency: express 4.17</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Contains known vulnerability CVE-2024-XXXX.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--severity-medium-text)] uppercase tracking-wider">medium</span>
            </div>
          </div>

          {/* Low Group */}
          <div className="border-l-4 border-l-[var(--border-color)]">
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-[var(--text-primary)]">Missing security headers</h4>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">X-Frame-Options and Content-Security-Policy headers are missing.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">low</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
