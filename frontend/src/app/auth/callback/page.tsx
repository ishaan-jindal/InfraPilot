"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { exchangeCode } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code received from GitHub.");
      return;
    }

    exchangeCode(code)
      .then((token) => {
        setToken(token);
        router.replace("/dashboard");
      })
      .catch((err) => {
        setError(err.message ?? "Failed to authenticate with GitHub.");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="w-10 h-10 text-[var(--color-accent-blue)]" />
          <span className="font-display font-bold text-2xl text-[var(--color-text-primary)]">
            InfraPilot
          </span>
        </div>

        {error ? (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-[var(--color-accent-coral)] mx-auto" />
            <p className="text-[var(--color-accent-coral)] font-medium">{error}</p>
            <button
              onClick={() => router.replace("/")}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 text-[var(--color-accent-blue)] mx-auto animate-spin" />
            <p className="text-[var(--color-text-secondary)] text-sm">
              Authenticating with GitHub…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
          <Loader2 className="w-10 h-10 text-[var(--color-accent-blue)] animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
