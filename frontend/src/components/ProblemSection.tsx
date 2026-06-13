"use client";

import { ShieldX, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  "Deploy first, hope for the best",
  "No visibility into open ports or exposed secrets",
  "Security is your problem after launch",
];

const solutions = [
  "Audit before every deploy",
  "Flags hardcoded secrets, open ports, missing HTTPS",
  "AI-recommended fixes applied automatically where safe",
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-6 relative z-10" id="security">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
            Security blind spots in deployment
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            Most platforms just take your code and run it. InfraPilot ensures it's safe before it ever hits production.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-[var(--color-bg-main)]">
                <ShieldX className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--color-text-secondary)]">What most platforms do</h3>
            </div>
            <ul className="space-y-6">
              {problems.map((item, i) => (
                <li key={i} className="flex gap-4 items-start text-[var(--color-text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)] mt-2 opacity-50 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-accent-blue)]/30 shadow-[0_0_30px_rgba(45,91,255,0.05)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-blue)]/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-2 rounded-lg bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--color-text-primary)]">What InfraPilot does</h3>
            </div>
            <ul className="space-y-6 relative">
              {solutions.map((item, i) => (
                <li key={i} className="flex gap-4 items-start text-[var(--color-text-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
