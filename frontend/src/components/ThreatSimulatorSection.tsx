"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Terminal } from "lucide-react";
import NeuralNetworkBg from "./NeuralNetworkBg";
import MagneticButton from "./MagneticButton";

const threatPaths = [
  { id: 1, text: "Brute force SSH (password auth enabled, no fail2ban)" },
  { id: 2, text: "PostgreSQL exposed on 0.0.0.0:5432 (no firewall rule)" },
  { id: 3, text: "Leaked API key in git history (AWS account compromise)" },
  { id: 4, text: "Container escape via privileged mode" },
];

export default function ThreatSimulatorSection() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [revealedPaths, setRevealedPaths] = useState<number[]>([]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setRevealedPaths([]);
    
    threatPaths.forEach((path, index) => {
      setTimeout(() => {
        setRevealedPaths(prev => [...prev, path.id]);
      }, (index + 1) * 800);
    });

    setTimeout(() => {
      setIsSimulating(false);
    }, threatPaths.length * 800 + 500);
  };

  return (
    <section className="relative py-24 bg-[var(--color-bg-main)] overflow-hidden border-y border-[var(--color-border)]">
      <NeuralNetworkBg />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)] text-sm font-medium border border-[var(--color-accent-coral)]/20">
                <ShieldAlert className="w-4 h-4" />
                AI Threat Simulator
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text-primary)] mb-4">
                "How could my server be attacked?"
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg mb-8">
                InfraPilot uses AI to analyze your architecture and simulate potential attack paths before an attacker does. Don't wait for a breach to discover your vulnerabilities.
              </p>
              
              <MagneticButton
                onClick={handleSimulate}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] px-6 py-3 rounded-lg font-medium hover:bg-[var(--color-bg-main)] shadow-sm transition-colors flex items-center gap-2"
              >
                {isSimulating ? "Simulating..." : "Run Threat Simulation"}
                <Terminal className="w-4 h-4" />
              </MagneticButton>
            </motion.div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-xl bg-opacity-80">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent-coral)] to-[var(--color-accent-amber)] opacity-50" />
              
              <div className="flex items-center gap-2 mb-4 text-[var(--color-text-secondary)] font-mono text-sm border-b border-[var(--color-border)] pb-4">
                <Terminal className="w-4 h-4" />
                <span>infrapilot simulate --target=production</span>
              </div>

              <div className="space-y-3 min-h-[200px] font-mono text-sm">
                {!isSimulating && revealedPaths.length === 0 && (
                  <div className="text-[var(--color-text-secondary)] italic">
                    Waiting for input...
                  </div>
                )}
                
                <AnimatePresence>
                  {revealedPaths.map((id, index) => {
                    const path = threatPaths.find(p => p.id === id);
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-2 text-[var(--color-accent-coral)] bg-[var(--color-accent-coral)]/5 p-3 rounded border border-[var(--color-accent-coral)]/10"
                      >
                        <span className="shrink-0 opacity-50">[{index + 1}]</span>
                        <span>{path?.text}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {isSimulating && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="flex items-center gap-2 text-[var(--color-text-secondary)] mt-4"
                  >
                    <div className="w-2 h-4 bg-[var(--color-accent-coral)] animate-pulse" />
                    <span>Analyzing vectors...</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
