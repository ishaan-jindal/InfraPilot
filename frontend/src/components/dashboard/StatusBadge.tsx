"use client";

import type { DeploymentStatus } from "@/lib/types";

const CONFIG: Record<
  DeploymentStatus,
  { label: string; color: string; bg: string; pulse?: boolean }
> = {
  pending:            { label: "Pending",      color: "text-zinc-400",          bg: "bg-zinc-400/10"  },
  cloning:            { label: "Cloning",      color: "text-blue-400",          bg: "bg-blue-400/10", pulse: true },
  detecting:          { label: "Detecting",    color: "text-blue-400",          bg: "bg-blue-400/10", pulse: true },
  scanning:           { label: "Scanning",     color: "text-amber-400",         bg: "bg-amber-400/10", pulse: true },
  awaiting_approval:  { label: "Needs Approval", color: "text-orange-400",      bg: "bg-orange-400/10" },
  building:           { label: "Building",     color: "text-violet-400",        bg: "bg-violet-400/10", pulse: true },
  starting:           { label: "Starting",     color: "text-cyan-400",          bg: "bg-cyan-400/10", pulse: true },
  configuring_proxy:  { label: "Configuring",  color: "text-cyan-400",          bg: "bg-cyan-400/10", pulse: true },
  running:            { label: "Running",      color: "text-emerald-400",       bg: "bg-emerald-400/10" },
  failed:             { label: "Failed",       color: "text-red-400",           bg: "bg-red-400/10" },
  stopped:            { label: "Stopped",      color: "text-zinc-500",          bg: "bg-zinc-500/10" },
};

export default function StatusBadge({ status }: { status: DeploymentStatus }) {
  const c = CONFIG[status] ?? CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.color} ${c.bg}`}
    >
      {c.pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${c.color.replace("text-", "bg-")}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${c.color.replace("text-", "bg-")}`}
          />
        </span>
      )}
      {c.label}
    </span>
  );
}
