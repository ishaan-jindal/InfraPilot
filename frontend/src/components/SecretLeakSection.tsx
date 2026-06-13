export default function SecretLeakSection() {
  return (
    <section className="py-12 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 05 — secret scanning
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            Secret leak detection
          </h2>
        </div>

        <div className="max-w-3xl">
          <div className="bg-white border border-[var(--border-color)] overflow-hidden">
            <div className="p-1">
              <table className="w-full text-left font-mono text-sm">
                <tbody className="divide-y divide-[var(--border-color)]/50">
                  <tr className="bg-[var(--severity-critical-bg)]">
                    <td className="p-4 font-bold w-1/3 text-[var(--text-primary)]">.env:3</td>
                    <td className="p-4 text-[var(--severity-critical)]">AWS_SECRET_ACCESS_KEY=AKIA...</td>
                  </tr>
                  <tr className="bg-[var(--severity-critical-bg)]">
                    <td className="p-4 font-bold w-1/3 text-[var(--text-primary)]">config.py:12</td>
                    <td className="p-4 text-[var(--severity-critical)]">OPENAI_API_KEY=sk-...</td>
                  </tr>
                  <tr className="bg-[var(--severity-critical-bg)]">
                    <td className="p-4 font-bold w-1/3 text-[var(--text-primary)]">git history (commit a3f8c2)</td>
                    <td className="p-4 text-[var(--severity-critical)]">DATABASE_URL with password</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="font-body text-sm text-[var(--text-secondary)] mt-4">
            Alerts before deployment. Blocks deploy if critical secrets are found.
          </p>
        </div>
      </div>
    </section>
  );
}
