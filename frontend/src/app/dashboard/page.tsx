"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { getRepositories } from "@/lib/api";
import type { Repository } from "@/lib/types";
import Link from "next/link";
import {
  Search,
  Star,
  Lock,
  GitBranch,
  Loader2,
  AlertCircle,
  Rocket,
} from "lucide-react";

export default function DashboardPage() {
  const { token } = useAuth(true);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getRepositories(token, page, 50)
      .then(setRepos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, page]);

  const filtered = useMemo(() => {
    if (!search) return repos;
    const q = search.toLowerCase();
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.full_name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [repos, search]);

  /* Language → color mapping */
  const langColor: Record<string, string> = {
    TypeScript: "bg-blue-400",
    JavaScript: "bg-yellow-400",
    Python: "bg-green-400",
    Go: "bg-cyan-400",
    Rust: "bg-orange-400",
    Java: "bg-red-400",
    Ruby: "bg-red-500",
    PHP: "bg-violet-400",
    C: "bg-zinc-400",
    "C++": "bg-pink-400",
    "C#": "bg-green-500",
    Swift: "bg-orange-500",
    Kotlin: "bg-purple-400",
    HTML: "bg-orange-300",
    CSS: "bg-purple-300",
    Shell: "bg-emerald-400",
    Dockerfile: "bg-blue-500",
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">
          Repositories
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Select a repository to deploy
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          placeholder="Search repositories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/50 focus:border-[var(--color-accent-blue)] transition-all"
        />
      </div>

      {/* States */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--color-accent-blue)] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-10 h-10 text-[var(--color-accent-coral)]" />
          <p className="text-[var(--color-accent-coral)] text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Search className="w-10 h-10 text-[var(--color-text-secondary)]" />
          <p className="text-[var(--color-text-secondary)] text-sm">
            {search ? "No repositories match your search." : "No repositories found."}
          </p>
        </div>
      ) : (
        <>
          {/* Repo grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((repo) => (
              <Link
                key={repo.id}
                href={`/dashboard/deploy?repo=${encodeURIComponent(repo.full_name)}&clone_url=${encodeURIComponent(repo.clone_url)}&branch=${encodeURIComponent(repo.default_branch)}`}
                className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent-blue)]/50 hover:shadow-lg hover:shadow-[var(--color-accent-blue)]/5 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-blue)] transition-colors">
                        {repo.name}
                      </h3>
                      {repo.private && (
                        <Lock className="w-3.5 h-3.5 text-[var(--color-text-secondary)] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 truncate">
                      {repo.full_name}
                    </p>
                  </div>
                  <Rocket className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-blue)] transition-colors shrink-0 mt-1" />
                </div>

                {repo.description && (
                  <p className="text-sm text-[var(--color-text-secondary)] mt-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-4 text-xs text-[var(--color-text-secondary)]">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${langColor[repo.language] ?? "bg-zinc-400"}`}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {repo.default_branch}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-[var(--color-text-secondary)]">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={repos.length < 50}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
