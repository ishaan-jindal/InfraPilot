"use client";

import type { DeploymentStatus } from "@/lib/types";

const CONFIG: Record<
  DeploymentStatus,
  { label: string; color: string; bg: string; pulse?: boolean }
> = {
  pending:            { label: "Pending",      color: "text-[var(--color-text-secondary)]",     bg: "bg-[var(--color-border)]/20"  },
  cloning:            { label: "Cloning",      color: "text-[var(--color-accent-blue)]",        bg: "bg-[var(--color-accent-blue)]/10", pulse: true },
  detecting:          { label: "Detecting",    color: "text-[var(--color-accent-blue)]",        bg: "bg-[var(--color-accent-blue)]/10", pulse: true },
  scanning:           { label: "Scanning",     color: "text-[var(--color-severity-medium-text)]", bg: "bg-[var(--color-severity-medium-bg)]", pulse: true },
  awaiting_approval:  { label: "Needs Approval", color: "text-[var(--color-severity-high-text)]", bg: "bg-[var(--color-severity-high-bg)]" },
  building:           { label: "Building",     color: "text-[var(--color-accent-blue)]",        bg: "bg-[var(--color-accent-blue)]/10", pulse: true },
  starting:           { label: "Starting",     color: "text-[var(--color-accent-blue)]",        bg: "bg-[var(--color-accent-blue)]/10", pulse: true },
  configuring_proxy:  { label: "Configuring",  color: "text-[var(--color-accent-blue)]",        bg: "bg-[var(--color-accent-blue)]/10", pulse: true },
  running:            { label: "Running",      color: "text-[var(--color-severity-pass)]",      bg: "bg-[var(--color-severity-pass-bg)]" },
  failed:             { label: "Failed",       color: "text-[var(--color-severity-critical)]",  bg: "bg-[var(--color-severity-critical-bg)]" },
  stopped:            { label: "Stopped",      color: "text-[var(--color-text-secondary)]",     bg: "bg-[var(--color-border)]/20" },
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
