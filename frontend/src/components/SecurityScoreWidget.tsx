"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function SecurityScoreWidget() {
  const score = 88;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent-blue)]/5 rounded-full -mr-10 -mt-10 blur-2xl" />
      
      <div className="flex items-center gap-6 relative z-10">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-[var(--color-border)]"
            />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="text-[var(--color-accent-green)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-[var(--color-text-primary)]">
              {score}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-3">Infrastructure Risk</h3>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span className="text-[var(--color-text-secondary)]">HTTPS</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span className="text-[var(--color-text-secondary)]">SSH Hardening</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span className="text-[var(--color-text-secondary)]">Firewall</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--color-accent-amber)]" />
              <span className="text-[var(--color-text-secondary)]">Secrets</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span className="text-[var(--color-text-secondary)]">Containers</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-accent-green)]" />
              <span className="text-[var(--color-text-secondary)]">Dependencies</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
