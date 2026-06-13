"use client";

import type { SecurityFinding } from "@/lib/types";
import { ShieldAlert, ShieldX, ShieldCheck, AlertTriangle, FileWarning } from "lucide-react";

interface SecurityReportProps {
  findings: SecurityFinding[];
  advice: string;
}

const SEVERITY_CONFIG = {
  CRITICAL: {
    icon: ShieldX,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    label: "Critical",
  },
  HIGH: {
    icon: ShieldAlert,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    label: "High",
  },
  MEDIUM: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    label: "Medium",
  },
};

export default function SecurityReport({ findings, advice }: SecurityReportProps) {
  if (findings.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex items-center gap-4">
        <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <p className="font-semibold text-emerald-400">No security issues found</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Your deployment passed all security checks.
          </p>
        </div>
      </div>
    );
  }

  const grouped = {
    CRITICAL: findings.filter((f) => f.severity === "CRITICAL"),
    HIGH: findings.filter((f) => f.severity === "HIGH"),
    MEDIUM: findings.filter((f) => f.severity === "MEDIUM"),
  };

  return (
    <div className="space-y-6">
      {/* Findings list */}
      <div className="space-y-3">
        {(["CRITICAL", "HIGH", "MEDIUM"] as const).map((severity) => {
          const items = grouped[severity];
          if (items.length === 0) return null;
          const cfg = SEVERITY_CONFIG[severity];
          const Icon = cfg.icon;

          return (
            <div key={severity} className="space-y-2">
              {items.map((finding, i) => (
                <div
                  key={i}
                  className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${cfg.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                          {finding.type.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-primary)] mt-1">
                        {finding.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--color-text-secondary)]">
                        <FileWarning className="w-3.5 h-3.5" />
                        <span className="font-mono">{finding.file}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* AI Remediation Advice */}
      {advice && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <span className="text-lg">🤖</span> AI Security Advisor
          </h4>
          <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-[var(--color-text-secondary)] font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {advice}
          </div>
        </div>
      )}
    </div>
  );
}
