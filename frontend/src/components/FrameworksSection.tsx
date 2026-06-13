"use client";
import React from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import Image from "next/image";

const frameworks = [
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
];

export default function FrameworksSection() {
  return (
    <section className="py-24 bg-[var(--color-bg-main)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)] animate-pulse" />
            Universal Compatibility
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-[var(--color-text-primary)]"
          >
            Deploy any stack securely
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-[var(--color-text-secondary)] text-lg"
          >
            Automatic framework detection with zero configuration.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          {frameworks.map((fw, i) => (
            <motion.div
              key={fw.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TiltCard className="w-40 h-44 flex flex-col items-center justify-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:border-[var(--color-accent-blue)]/50 transition-all duration-300">
                <div className="relative w-14 h-14 bg-[var(--color-bg-main)] rounded-xl p-3 shadow-inner flex items-center justify-center">
                  <Image src={fw.icon} alt={fw.name} fill className="object-contain p-2" />
                </div>
                <div className="text-center">
                  <span className="block text-base font-semibold text-[var(--color-text-primary)]">{fw.name}</span>
                  <span className="block text-xs text-[var(--color-text-secondary)] mt-1">Supported</span>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
