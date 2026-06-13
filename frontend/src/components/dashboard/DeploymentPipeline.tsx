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
            done: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
            active: "text-blue-400 bg-blue-400/10 border-blue-400/30",
            waiting: "text-zinc-600 bg-zinc-800/30 border-zinc-700/30",
            failed: "text-red-400 bg-red-400/10 border-red-400/30",
            approval: "text-orange-400 bg-orange-400/10 border-orange-400/30",
          };

          const lineColor =
            i < currentIdx ? "bg-emerald-400/40" : "bg-zinc-700/40";

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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                      </span>
                    </div>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    state === "waiting" ? "text-zinc-600" : state === "failed" ? "text-red-400" : state === "approval" ? "text-orange-400" : state === "done" ? "text-emerald-400" : "text-blue-400"
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
