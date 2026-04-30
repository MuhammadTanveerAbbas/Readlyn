"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import { Settings, Mail, Shield, KeyRound, LogOut } from "lucide-react";

interface AccountData {
  email: string;
  id: string;
  createdAt: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const loadAccount = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(userError?.message || "Unable to load account details.");
        setLoading(false);
        return;
      }

      setAccount({
        email: user.email || "No email",
        id: user.id,
        createdAt: user.created_at
          ? new Date(user.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Unknown",
      });
      setLoading(false);
    };

    loadAccount();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsSigningOut(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        onNewProject={() => router.push("/dashboard")}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/6 bg-[#0a0a0a] px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-white/60 hover:text-white"
          aria-label="Open menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-bold text-white">Settings</span>
      </div>

      <main className="md:ml-[260px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-white/10 bg-[#0f0f0f] p-4">
          <div className="mb-1 flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#F5C518]" />
            <h1 className="text-lg font-semibold text-white">Settings</h1>
          </div>
          <p className="text-sm text-white/50">
            Manage your account and security preferences.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#F5C518] border-t-transparent" />
            <p className="text-sm text-white/60">Loading account settings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            <p className="text-sm font-medium">Failed to load settings</p>
            <p className="mt-1 text-xs text-red-300/70">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <section className="rounded-xl border border-white/10 bg-[#0f0f0f] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F5C518]" />
                <h2 className="text-sm font-semibold text-white">Account</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-white/8 bg-[#161616] p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-white">{account?.email}</p>
                </div>
                <div className="rounded-lg border border-white/8 bg-[#161616] p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">
                    Member Since
                  </p>
                  <p className="mt-1 text-sm text-white">{account?.createdAt}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-white/8 bg-[#161616] p-3">
                <p className="text-[11px] uppercase tracking-wider text-white/40">
                  User ID
                </p>
                <p className="mt-1 break-all font-mono text-xs text-white/80">
                  {account?.id}
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#0f0f0f] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#F5C518]" />
                <h2 className="text-sm font-semibold text-white">Security</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/update-password")}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#161616] px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#F5C518]/40 hover:text-white"
                >
                  <KeyRound className="h-4 w-4" />
                  Update Password
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
