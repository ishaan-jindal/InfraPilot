"use client";

import type { DeploymentStatus } from "@/lib/types";
import { PIPELINE_STEPS } from "@/lib/types";
import {
  GitBranch,
  Search,
  Shield,
  Hammer,
  Rocket,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const STEP_META: Record<string, { icon: typeof Clock; label: string }> = {
  pending:           { icon: Clock,        label: "Queued" },
  cloning:           { icon: GitBranch,    label: "Clone" },
  detecting:         { icon: Search,       label: "Detect" },
  scanning:          { icon: Shield,       label: "Scan" },
  building:          { icon: Hammer,       label: "Build" },
  starting:          { icon: Rocket,       label: "Start" },
  configuring_proxy: { icon: Globe,        label: "Proxy" },
  running:           { icon: CheckCircle2, label: "Live" },
};

export default function DeploymentPipeline({ status }: { status: DeploymentStatus }) {
  const isFailed = status === "failed";
  const isStopped = status === "stopped";
  const isAwaiting = status === "awaiting_approval";

  const currentIdx = PIPELINE_STEPS.indexOf(
    isAwaiting ? "scanning" : isFailed || isStopped ? status : status
  );

  /* For failed/stopped, find the last active step */
  const activeIdx = isFailed || isStopped
    ? Math.max(PIPELINE_STEPS.indexOf(status), 0)
    : currentIdx;

  return (
    <div className="w-full">
      <div className="flex items-center gap-1">
        {PIPELINE_STEPS.map((step, i) => {
          const meta = STEP_META[step];
          const Icon = meta.icon;

          let state: "done" | "active" | "waiting" | "failed" | "approval" = "waiting";
          if (isFailed && i === activeIdx) state = "failed";
          else if (isAwaiting && step === "scanning") state = "approval";
          else if (i < currentIdx) state = "done";
          else if (i === currentIdx && !isFailed && !isStopped) state = "active";

          const colors = {
            done: "text-[var(--color-severity-pass)] bg-[var(--color-severity-pass-bg)] border-[var(--color-severity-pass)]/30",
            active: "text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 border-[var(--color-accent-blue)]/30",
            waiting: "text-[var(--color-text-secondary)] bg-[var(--color-surface)] border-[var(--color-border)]",
            failed: "text-[var(--color-severity-critical)] bg-[var(--color-severity-critical-bg)] border-[var(--color-severity-critical)]/30",
            approval: "text-[var(--color-severity-high-text)] bg-[var(--color-severity-high-bg)] border-[var(--color-severity-high)]/30",
          };

          const lineColor =
            i < currentIdx ? "bg-[var(--color-severity-pass)]/40" : "bg-[var(--color-border)]/60";

          return (
            <div key={step} className="flex items-center flex-1 min-w-0">
              {/* Step node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${colors[state]}`}
                >
                  {state === "failed" ? (
                    <XCircle className="w-4 h-4" />
                  ) : state === "approval" ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : state === "active" ? (
                    <div className="relative">
                      <Icon className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-blue)] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent-blue)]" />
                      </span>
                    </div>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    state === "waiting" ? "text-[var(--color-text-secondary)]" : state === "failed" ? "text-[var(--color-severity-critical)]" : state === "approval" ? "text-[var(--color-severity-high-text)]" : state === "done" ? "text-[var(--color-severity-pass)]" : "text-[var(--color-accent-blue)]"
                  }`}
                >
                  {meta.label}
                </span>
              </div>

              {/* Connector line */}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded-full ${lineColor}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
