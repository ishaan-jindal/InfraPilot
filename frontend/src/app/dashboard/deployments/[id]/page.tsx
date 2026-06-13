"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDeployment,
  getSecurityAdvisor,
  approveDeployment,
  redeployDeployment,
  deleteDeployment,
} from "@/lib/api";
import type { Deployment, SecurityAdvisorResponse } from "@/lib/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import LogViewer from "@/components/dashboard/LogViewer";
import SecurityReport from "@/components/dashboard/SecurityReport";
import DeploymentPipeline from "@/components/dashboard/DeploymentPipeline";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GitBranch,
  Clock,
  Globe,
  Box,
  Terminal,
} from "lucide-react";

export default function DeploymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deploymentId = params.id as string;

  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [security, setSecurity] = useState<SecurityAdvisorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(true);
  const [showSecurity, setShowSecurity] = useState(false);

  const fetchDeployment = useCallback(async () => {
    try {
      const d = await getDeployment(deploymentId);
      setDeployment(d);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load deployment");
    } finally {
      setLoading(false);
    }
  }, [deploymentId]);

  const fetchSecurity = useCallback(async () => {
    try {
      const s = await getSecurityAdvisor(deploymentId);
      setSecurity(s);
    } catch {
      /* Security advisor may not be available for all deployments */
    }
  }, [deploymentId]);

  useEffect(() => {
    fetchDeployment();
    fetchSecurity();
  }, [fetchDeployment, fetchSecurity]);

  /* Auto-refresh while deployment is active */
  useEffect(() => {
    if (
      !deployment ||
      ["running", "failed", "stopped"].includes(deployment.status)
    )
      return;

    const interval = setInterval(() => {
      fetchDeployment();
      fetchSecurity();
    }, 3000);
    return () => clearInterval(interval);
  }, [deployment, fetchDeployment, fetchSecurity]);

  /* Auto-show security tab when awaiting approval */
  useEffect(() => {
    if (deployment?.status === "awaiting_approval") {
      setShowSecurity(true);
      setShowLogs(false);
    }
  }, [deployment?.status]);

  const handleApprove = async () => {
    setActionLoading("approve");
    try {
      await approveDeployment(deploymentId);
      fetchDeployment();
    } catch {
      /* swallow */
    } finally {
      setActionLoading(null);
    }
  };

  const handleRedeploy = async () => {
    setActionLoading("redeploy");
    try {
      await redeployDeployment(deploymentId);
      fetchDeployment();
      setShowLogs(true);
      setShowSecurity(false);
    } catch {
      /* swallow */
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Stop and remove this deployment?")) return;
    setActionLoading("delete");
    try {
      await deleteDeployment(deploymentId);
      router.push("/dashboard/deployments");
    } catch {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--color-accent-blue)] animate-spin" />
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-10 h-10 text-[var(--color-accent-coral)]" />
          <p className="text-[var(--color-accent-coral)] text-sm">
            {error ?? "Deployment not found"}
          </p>
          <Link
            href="/dashboard/deployments"
            className="text-sm text-[var(--color-accent-blue)] hover:underline"
          >
            ← Back to deployments
          </Link>
        </div>
      </div>
    );
  }

  const isActive = !["running", "failed", "stopped"].includes(
    deployment.status
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/deployments"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Deployments
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
              {deployment.project_name}
            </h1>
            <StatusBadge status={deployment.status} />
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-text-secondary)]">
            {deployment.framework && (
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                {deployment.framework}
              </span>
            )}
            {deployment.branch && (
              <span className="flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                {deployment.branch}
              </span>
            )}
            {deployment.created_at && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {new Date(deployment.created_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {deployment.url && deployment.status === "running" && (
            <a
              href={deployment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
            >
              <Globe className="w-4 h-4" /> Visit Site
            </a>
          )}
          <button
            onClick={handleRedeploy}
            disabled={!!actionLoading}
            className="p-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] hover:border-[var(--color-accent-blue)]/30 disabled:opacity-40 transition-colors"
            title="Redeploy"
          >
            <RefreshCw
              className={`w-4 h-4 ${actionLoading === "redeploy" ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleDelete}
            disabled={!!actionLoading}
            className="p-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-red-400 hover:border-red-400/30 disabled:opacity-40 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline progress */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <DeploymentPipeline status={deployment.status} />
      </div>

      {/* Approval banner */}
      {deployment.status === "awaiting_approval" && (
        <div className="rounded-xl border border-orange-400/30 bg-orange-400/5 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-orange-400 shrink-0" />
            <div>
              <p className="font-semibold text-orange-400">
                Security Review Required
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                Critical or high-severity findings were detected. Review the
                security report below and approve to continue deployment.
              </p>
            </div>
          </div>
          <button
            onClick={handleApprove}
            disabled={actionLoading === "approve"}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {actionLoading === "approve" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Approve & Continue
          </button>
        </div>
      )}

      {/* Deployment info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Status", value: deployment.status, icon: Clock },
          { label: "Port", value: deployment.host_port ?? "—", icon: Globe },
          { label: "Subdomain", value: deployment.subdomain ?? "—", icon: ExternalLink },
          {
            label: "Commit",
            value: deployment.commit_hash?.slice(0, 7) ?? "—",
            icon: GitBranch,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                {card.label}
              </div>
              <p className="text-sm font-mono font-semibold text-[var(--color-text-primary)] truncate">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border)]">
        <button
          onClick={() => { setShowLogs(true); setShowSecurity(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            showLogs
              ? "border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]"
              : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <Terminal className="w-4 h-4" /> Build Logs
        </button>
        <button
          onClick={() => { setShowSecurity(true); setShowLogs(false); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            showSecurity
              ? "border-[var(--color-accent-blue)] text-[var(--color-accent-blue)]"
              : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security
          {security && security.report.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-orange-400/10 text-orange-400 text-xs font-bold">
              {security.report.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {showLogs && (
        <LogViewer deploymentId={deploymentId} live={isActive} />
      )}

      {showSecurity && security && (
        <SecurityReport findings={security.report} advice={security.advice} />
      )}
      {showSecurity && !security && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Security scan results will appear here after the scanning phase
            completes.
          </p>
        </div>
      )}
    </div>
  );
}
