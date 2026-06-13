"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import SecurityScoreWidget from "./SecurityScoreWidget";

// Lazy load the 3D scene to ensure it only renders on client
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--color-accent-blue)]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] leading-[1.1] mb-6"
          >
            Deploy with <span className="text-[var(--color-accent-blue)]">eyes open.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 max-w-xl"
          >
            InfraPilot audits your repo and infrastructure for security risks, fixes what it can, and deploys you anywhere — managed or self-hosted.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <MagneticButton href="#">
              <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md bg-[var(--color-accent-blue)] text-white hover:bg-opacity-90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                Run a free audit
              </span>
            </MagneticButton>
            <MagneticButton href="#">
              <span className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all bg-[var(--color-surface)]">
                View on GitHub
              </span>
            </MagneticButton>
          </motion.div>

          <div className="max-w-md">
            <SecurityScoreWidget />
          </div>
        </div>

        {/* 3D Scene Container */}
        <div className="relative h-[600px] w-full hidden lg:block rounded-2xl overflow-hidden pointer-events-none">
           <HeroScene />
        </div>
      </div>
    </section>
  );
}
