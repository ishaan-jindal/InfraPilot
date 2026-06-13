"use client";

import { useEffect, useState, useCallback } from "react";
import { getDeployments, redeployDeployment, deleteDeployment } from "@/lib/api";
import type { Deployment } from "@/lib/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import {
  Rocket,
  Trash2,
  RefreshCw,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  Inbox,
} from "lucide-react";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDeployments = useCallback(async () => {
    try {
      const res = await getDeployments(0, 100);
      setDeployments(res.deployments);
      setTotal(res.total);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load deployments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  /* Auto-refresh for active deployments */
  useEffect(() => {
    const hasActive = deployments.some(
      (d) =>
        !["running", "failed", "stopped"].includes(d.status)
    );
    if (!hasActive) return;

    const interval = setInterval(fetchDeployments, 4000);
    return () => clearInterval(interval);
  }, [deployments, fetchDeployments]);

  const handleRedeploy = async (id: string) => {
    setActionLoading(id);
    try {
      await redeployDeployment(id);
      fetchDeployments();
    } catch {
      /* swallow */
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Stop and remove this deployment?")) return;
    setActionLoading(id);
    try {
      await deleteDeployment(id);
      fetchDeployments();
    } catch {
      /* swallow */
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
            Deployments
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {total} total deployment{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-accent-blue)] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[var(--color-accent-blue)]/25"
        >
          <Rocket className="w-4 h-4" /> New Deploy
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--color-accent-blue)] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-10 h-10 text-[var(--color-accent-coral)]" />
          <p className="text-[var(--color-accent-coral)] text-sm">{error}</p>
        </div>
      ) : deployments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Inbox className="w-12 h-12 text-[var(--color-text-secondary)]" />
          <p className="text-[var(--color-text-secondary)]">No deployments yet</p>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--color-accent-blue)] hover:underline"
          >
            Deploy your first project →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {deployments.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent-blue)]/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/dashboard/deployments/${d.id}`}
                  className="min-w-0 flex-1 group"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-blue)] transition-colors">
                      {d.project_name}
                    </h3>
                    <StatusBadge status={d.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-secondary)]">
                    {d.framework && (
                      <span className="font-mono bg-[var(--color-border)]/50 px-2 py-0.5 rounded">
                        {d.framework}
                      </span>
                    )}
                    {d.branch && (
                      <span className="font-mono">{d.branch}</span>
                    )}
                    {d.created_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(d.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                  {d.url && d.status === "running" && (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/5 transition-colors"
                      title="Open live site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleRedeploy(d.id)}
                    disabled={actionLoading === d.id}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/5 disabled:opacity-40 transition-colors"
                    title="Redeploy"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${actionLoading === d.id ? "animate-spin" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    disabled={actionLoading === d.id}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-400/5 disabled:opacity-40 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
