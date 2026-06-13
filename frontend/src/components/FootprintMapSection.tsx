"use client";
import React from "react";
import { motion } from "framer-motion";
import { GitBranch, Box, Server, Globe, ShieldAlert, Zap } from "lucide-react";
import TiltCard from "./TiltCard";

const footprintSteps = [
  { icon: GitBranch, label: "GitHub Repository", detail: "main branch" },
  { icon: Box, label: "Docker Container", detail: "node:20, port 3000" },
  { icon: Server, label: "Reverse Proxy", detail: "Caddy, ports 80/443" },
  { icon: Globe, label: "Public Domain", detail: "myapp.infrapilot.dev" },
];

export default function FootprintMapSection() {
  return (
    <section className="py-24 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Footprint Map */}
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-4">
            Infrastructure Footprint Map
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-12">
            Understand exactly what your deployment exposes to the internet. No more black-box deployments.
          </p>

          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-[var(--color-border)]" />
            
            <div className="space-y-8 relative z-10">
              {footprintSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-6"
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--color-bg-main)] border border-[var(--color-accent-blue)]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                    <step.icon className="w-6 h-6 text-[var(--color-accent-blue)]" />
                  </div>
                  <div className="bg-[var(--color-bg-main)] border border-[var(--color-border)] p-4 rounded-xl flex-1 shadow-sm">
                    <h4 className="font-semibold text-[var(--color-text-primary)]">{step.label}</h4>
                    <p className="text-sm font-mono text-[var(--color-text-secondary)] mt-1">{step.detail}</p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--color-accent-coral)]/10 border border-[var(--color-accent-coral)]/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-[var(--color-accent-coral)]" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-main)]">Ports: 22, 80, 443</span>
                  <span className="px-3 py-1 rounded border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-main)]">PostgreSQL, Redis</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Continuous Monitoring Alert */}
        <div>
          <h2 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-4">
            Continuous Security Monitoring
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-12">
            InfraPilot doesn't sleep. It continuously monitors your live deployments for new vulnerabilities.
          </p>

          <TiltCard className="p-6 bg-[#161C24] border border-[#2D3748] rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 text-[var(--color-accent-coral)] mb-6 border-b border-[#2D3748] pb-4">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="font-semibold text-lg">New Vulnerability Detected</span>
            </div>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="grid grid-cols-3">
                <span className="text-[#8B95A8]">Package:</span>
                <span className="col-span-2 text-[#F7F8FA]">express 4.18.2</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[#8B95A8]">CVE:</span>
                <span className="col-span-2 text-[#F7F8FA]">CVE-2024-XXXX</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[#8B95A8]">Severity:</span>
                <span className="col-span-2 text-[var(--color-accent-coral)] font-bold">High</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-[#8B95A8]">Fix:</span>
                <span className="col-span-2 text-[var(--color-accent-green)]">Upgrade to 4.19.0</span>
              </div>
            </div>

            <button className="mt-8 w-full py-3 px-4 bg-[var(--color-accent-blue)] hover:bg-opacity-90 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-current" />
              Auto-Fix & Redeploy
            </button>
          </TiltCard>
        </div>

      </div>
    </section>
  );
}
