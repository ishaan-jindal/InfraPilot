"use client";

import { motion } from "framer-motion";
import { Cloud, Server, ArrowDown } from "lucide-react";
import { useState } from "react";

export default function SplitUniverseSection() {
  const [activeTab, setActiveTab] = useState<"managed" | "byoi" | "both">("both");

  return (
    <section className="py-24 px-6 relative" id="infrastructure">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
            One workflow, two destinations
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mb-8">
            Deploy to our managed cloud, or bring your own infrastructure. The security pipeline remains exactly the same.
          </p>
          
          {/* Toggle buttons */}
          <div className="inline-flex p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm">
            <button 
              onClick={() => setActiveTab("both")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "both" ? "bg-[var(--color-bg-main)] text-[var(--color-text-primary)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab("managed")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "managed" ? "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
            >
              Managed
            </button>
            <button 
              onClick={() => setActiveTab("byoi")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "byoi" ? "bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)] shadow-sm" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
            >
              BYOI
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Managed Side */}
          <motion.div 
            className={`flex-1 flex flex-col items-center p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-opacity duration-500 relative overflow-hidden ${activeTab === "byoi" ? "opacity-40" : "opacity-100"}`}
          >
            <div className="absolute top-0 w-full h-1 bg-[var(--color-accent-blue)]" />
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent-blue)]/10 flex items-center justify-center mb-6 text-[var(--color-accent-blue)]">
              <Cloud className="w-8 h-8" />
            </div>
            <h3 className="font-display font-semibold text-xl text-[var(--color-text-primary)] mb-4">Managed Hosting</h3>
            <p className="text-center text-[var(--color-text-secondary)] mb-8">
              Zero configuration. We handle the servers, SSL certificates, and scaling. Just connect your repo and go.
            </p>
            <div className="w-full h-24 relative border-x border-[var(--color-border)] opacity-30 mt-auto">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-blue)] to-transparent w-full"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* BYOI Side */}
          <motion.div 
            className={`flex-1 flex flex-col items-center p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-opacity duration-500 relative overflow-hidden ${activeTab === "managed" ? "opacity-40" : "opacity-100"}`}
          >
            <div className="absolute top-0 w-full h-1 bg-[var(--color-accent-green)]" />
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent-green)]/10 flex items-center justify-center mb-6 text-[var(--color-accent-green)]">
              <Server className="w-8 h-8" />
            </div>
            <h3 className="font-display font-semibold text-xl text-[var(--color-text-primary)] mb-4">Bring Your Own</h3>
            <p className="text-center text-[var(--color-text-secondary)] mb-8">
              Deploy to your AWS, Oracle, or Raspberry Pi. We SSH in, setup Docker, and provision the required SSL setup.
            </p>
            <div className="w-full h-24 relative border-x border-[var(--color-border)] opacity-30 mt-auto">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-green)] to-transparent w-full"
                animate={{ y: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* The Merge */}
        <div className="mt-8 relative flex justify-center">
          <div className="flex items-center justify-center w-full max-w-md mx-auto p-4 rounded-xl border border-[var(--color-border)] bg-gradient-to-r from-[var(--color-accent-blue)]/20 via-[var(--color-surface)] to-[var(--color-accent-green)]/20 shadow-md">
            <span className="font-display font-semibold text-[var(--color-text-primary)]">
              One unified deployment history
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
