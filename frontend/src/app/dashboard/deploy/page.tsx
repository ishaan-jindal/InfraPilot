"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getBranches, startDeploy } from "@/lib/api";
import type { Branch } from "@/lib/types";
import {
  GitBranch,
  Rocket,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function DeployWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth(true);

  const repoFullName = searchParams.get("repo") ?? "";
  const cloneUrl = searchParams.get("clone_url") ?? "";
  const defaultBranch = searchParams.get("branch") ?? "main";

  const [owner, repoName] = repoFullName.split("/");

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [projectName, setProjectName] = useState(
    repoName?.toLowerCase().replace(/[^a-z0-9-]/g, "-") ?? ""
  );
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Fetch branches */
  useEffect(() => {
    if (!token || !owner || !repoName) return;
    setLoadingBranches(true);
    getBranches(owner, repoName, token)
      .then((b) => {
        setBranches(b);
        if (b.length > 0 && !b.find((br) => br.name === selectedBranch)) {
          setSelectedBranch(b[0].name);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingBranches(false));
  }, [token, owner, repoName, selectedBranch]);

  /* Deploy */
  const handleDeploy = async () => {
    setDeploying(true);
    setError(null);
    try {
      const res = await startDeploy({
        repo_url: cloneUrl || `https://github.com/${repoFullName}.git`,
        token: token,
        project_name: projectName,
        branch: selectedBranch,
      });
      router.push(`/dashboard/deployments/${res.deployment_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Deployment failed");
      setDeploying(false);
    }
  };

  if (!repoFullName) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center py-20 space-y-4">
          <AlertCircle className="w-10 h-10 text-[var(--color-text-secondary)] mx-auto" />
          <p className="text-[var(--color-text-secondary)]">
            No repository selected.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-accent-blue)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to repositories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to repositories
      </Link>

      <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-1">
        Deploy
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-8">
        Configure and deploy{" "}
        <span className="font-mono text-[var(--color-text-primary)]">
          {repoFullName}
        </span>
      </p>

      <div className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) =>
              setProjectName(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
              )
            }
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/50 focus:border-[var(--color-accent-blue)] font-mono transition-all"
            placeholder="my-project"
          />
          <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
            Used for the subdomain: <span className="font-mono">{projectName || "..."}.infrapilot.dev</span>
          </p>
        </div>

        {/* Branch selector */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
            Branch
          </label>
          {loadingBranches ? (
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading branches…
            </div>
          ) : (
            <div className="relative">
              <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/50 focus:border-[var(--color-accent-blue)] appearance-none transition-all"
              >
                {branches.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Deploy info */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Deployment Plan
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <ChevronRight className="w-4 h-4 text-[var(--color-accent-blue)]" />
              Clone repository & detect framework
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <ChevronRight className="w-4 h-4 text-[var(--color-accent-blue)]" />
              Run security scan (secrets, Docker, dependencies)
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <ChevronRight className="w-4 h-4 text-[var(--color-accent-blue)]" />
              Build Docker image & start container
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <ChevronRight className="w-4 h-4 text-[var(--color-accent-blue)]" />
              Configure HTTPS reverse proxy
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-[var(--color-severity-critical)]/20 bg-[var(--color-severity-critical-bg)] p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--color-severity-critical)] shrink-0" />
            <p className="text-sm text-[var(--color-severity-critical)]">{error}</p>
          </div>
        )}

        {/* Deploy button */}
        <button
          onClick={handleDeploy}
          disabled={deploying || !projectName}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-accent-blue)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--color-accent-blue)]/25"
        >
          {deploying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Deploying…
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" /> Deploy
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function DeployPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[var(--color-accent-blue)] animate-spin" />
        </div>
      }
    >
      <DeployWizard />
    </Suspense>
  );
}
