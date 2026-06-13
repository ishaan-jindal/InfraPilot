"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "infrapilot_token";

/* ── Raw helpers ────────────────────────────────────────────────────── */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/* ── React hook ─────────────────────────────────────────────────────── */

export function useAuth(requireAuth = false) {
  const router = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    setLoading(false);

    if (requireAuth && !t) {
      router.replace("/");
    }
  }, [requireAuth, router]);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    router.replace("/");
  }, [router]);

  return { token, loading, authenticated: !!token, logout };
}
