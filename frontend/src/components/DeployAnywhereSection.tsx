"use client";

import dynamic from "next/dynamic";
import { Cloud, Server, Database, Layers, Monitor, HardDrive, Cpu, Terminal } from "lucide-react";

const DeployScene = dynamic(() => import("./DeployScene"), { ssr: false });

export default function DeployAnywhereSection() {
  const targets = [
    {
      name: "AWS EC2",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Cloud className="w-6 h-6" />,
    },
    {
      name: "Oracle Cloud",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Database className="w-6 h-6" />,
    },
    {
      name: "DigitalOcean",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      name: "Hetzner",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Server className="w-6 h-6" />,
    },
    {
      name: "Azure VMs",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Monitor className="w-6 h-6" />,
    },
    {
      name: "Home Labs / Raspberry Pi",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      name: "Any Linux server via SSH",
      desc: "Deploys via SSH, configures Docker and HTTPS",
      icon: <Terminal className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-24 px-6 relative bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center sm:text-left">
          <span className="font-mono text-sm text-[var(--text-secondary)] mb-4 block">
            // 07 — deployment targets
          </span>
          <h2 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            One workflow. Deploy anywhere — once it's secure.
          </h2>
        </div>

        {/* 3D Scene */}
        <div className="relative -mb-10 z-20 pointer-events-none">
          <DeployScene />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          
          {/* Managed Hosting Card */}
          <div className="bg-white border-2 border-[var(--accent-indigo)] p-6 col-span-1 md:col-span-2 lg:col-span-2 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cloud className="w-8 h-8 text-[var(--accent-indigo)]" />
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">Managed Hosting (InfraPilot)</h3>
                </div>
                <span className="font-mono text-[10px] text-white bg-[var(--accent-indigo)] px-2 py-1 uppercase tracking-wider hidden sm:block">
                  recommended for hackathons
                </span>
              </div>
              <p className="font-body text-[var(--text-secondary)] mb-4">
                No VPS required. Instant onboarding. Generates <span className="font-mono text-[var(--accent-indigo)] bg-indigo-50 px-1">https://my-app.infrapilot.dev</span>
              </p>
            </div>
          </div>

          {/* Other Targets */}
          {targets.map((target, idx) => (
            <div key={idx} className="bg-white border border-[var(--border-color)] p-6 flex flex-col hover:border-[var(--text-secondary)] transition-colors">
              <div className="text-[var(--accent-indigo)] mb-4">
                {target.icon}
              </div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
                {target.name}
              </h3>
              <p className="font-body text-sm text-[var(--text-secondary)]">
                {target.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
