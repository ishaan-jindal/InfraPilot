"use client";

import { motion } from "framer-motion";
import { Code2, Shield, Box, Lock, Globe } from "lucide-react";

export default function PipelineSection() {
  const stages = [
    { icon: Code2, label: "GitHub", activeColor: "var(--color-accent-blue)" },
    { icon: Shield, label: "Security scan", activeColor: "var(--color-accent-green)", caption: "Scanning for exposed secrets and open ports..." },
    { icon: Box, label: "Build", activeColor: "var(--color-accent-blue)" },
    { icon: Lock, label: "HTTPS config", activeColor: "var(--color-accent-blue)" },
    { icon: Globe, label: "Live website", activeColor: "var(--color-accent-blue)" },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
            How It Works
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg">
            A seamless deployment pipeline with a built-in security checkpoint.
          </p>
        </div>

        <div className="relative">
          {/* Background connecting line */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-[var(--color-border)] -translate-y-1/2 hidden md:block" />
          
          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-10 md:gap-0">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                  className="flex flex-col items-center group relative"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex items-center justify-center mb-4 transition-colors duration-500 group-hover:border-[var(--color-accent-blue)] relative z-10 shadow-sm">
                    <Icon className="w-6 h-6 text-[var(--color-text-secondary)] transition-colors duration-500" style={{ color: "inherit" }} />
                    
                    {/* Animated glow that activates when this item enters view */}
                    <motion.div 
                      className="absolute inset-0 rounded-2xl rounded-2xl"
                      initial={{ boxShadow: "0 0 0px rgba(0,0,0,0)", borderColor: "var(--color-border)" }}
                      whileInView={{ 
                        boxShadow: `0 0 20px ${stage.activeColor}40`,
                        borderColor: stage.activeColor,
                        color: stage.activeColor
                      }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: index * 0.3 + 0.2, duration: 0.4 }}
                      style={{ border: "2px solid" }}
                    />
                  </div>
                  
                  <span className="font-display font-medium text-[var(--color-text-primary)]">
                    {stage.label}
                  </span>
                  
                  {stage.caption && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.3 + 0.6 }}
                      className="absolute top-full mt-4 w-48 text-center text-xs text-[var(--color-text-secondary)] font-mono"
                    >
                      {stage.caption}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Animated drawing line */}
          <motion.div 
            className="absolute top-1/2 left-[10%] h-0.5 bg-[var(--color-accent-blue)] -translate-y-1/2 hidden md:block origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ right: "10%" }}
          />
        </div>
      </div>
    </section>
  );
}
