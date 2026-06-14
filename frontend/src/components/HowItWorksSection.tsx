export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect repository",
      detail: "github.com/user/project",
      borderTop: "",
    },
    {
      num: "02",
      title: "Security analysis runs",
      detail: "secrets, dependencies, Docker, SSH, ports, HTTPS, git history",
      borderTop: "border-t-[3px] border-t-[var(--accent-indigo)]",
    },
    {
      num: "03",
      title: "Review risk report",
      detail: "severity-ranked findings with AI explanations",
      borderTop: "",
    },
    {
      num: "04",
      title: "AI Security Advisor",
      detail: "recommended fixes shown before deploy is allowed",
      borderTop: "border-t-[3px] border-t-[#E9C46A]",
    },
    {
      num: "05",
      title: "Secure deployment",
      detail: "deploy only after validation, post-deploy monitoring begins",
      borderTop: "",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative bg-[var(--bg-main)] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 03 — the workflow
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            How it works
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-6 right-6 h-px bg-[var(--border-color)] z-0" />
          
          <div className="grid lg:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10">
                {/* Dot marker */}
                <div className="hidden lg:block absolute -top-1.5 left-6 w-3 h-3 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] z-20" />
                
                <div className={`bg-white border border-[var(--border-color)] p-6 h-full flex flex-col ${step.borderTop}`}>
                  <div className="font-mono text-2xl font-bold text-[var(--accent-indigo)] mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-body font-bold text-base text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className={`font-mono text-xs text-[var(--text-secondary)] mt-auto ${step.num === "01" ? "bg-gray-50 p-2 border border-gray-100" : ""}`}>
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
