"use client";

import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, authenticated, logout } = useAuth(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <Loader2 className="w-8 h-8 text-[var(--color-accent-blue)] animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return null; // useAuth will redirect
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)] text-[var(--color-text-primary)]">
      <Sidebar onLogout={logout} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
