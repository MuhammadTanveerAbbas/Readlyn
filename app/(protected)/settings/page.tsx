"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Settings,
  Mail,
  Shield,
  KeyRound,
  LogOut,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

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
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");
      toast({ title: "Account deleted successfully." });
      router.push("/");
    } catch {
      toast({
        title: "Failed to delete account",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
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

      <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2.5 -ml-2 min-h-11 min-w-11 text-white/60 hover:text-white"
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
        <div className="mb-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-4">
          <div className="mb-1 flex items-center gap-2">
            <Settings className="h-4 w-4 text-[var(--accent)]" />
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">Settings</h1>
          </div>
          <p className="text-sm text-[var(--text-body)]">
            Manage your account and security preferences.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            <p className="text-sm text-[var(--text-body)]">Loading account settings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-red-400" />
            <p className="text-sm font-medium text-red-200">Failed to load settings</p>
            <p className="mt-1 text-xs text-red-300/70 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-red-300 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Account</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-[var(--border-subtle-val)] bg-[var(--bg-elevated)] p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">Email</p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{account?.email}</p>
                </div>
                <div className="rounded-lg border border-[var(--border-subtle-val)] bg-[var(--bg-elevated)] p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/40">Member Since</p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{account?.createdAt}</p>
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-[var(--border-subtle-val)] bg-[var(--bg-elevated)] p-3">
                <p className="text-[11px] uppercase tracking-wider text-white/40">User ID</p>
                <p className="mt-1 break-all font-mono text-xs text-white/80">{account?.id}</p>
              </div>
            </section>

            <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Security</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/update-password")}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-white/80 transition-colors hover:border-[var(--accent)]/40 hover:text-white"
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

            <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-400" />
                <h2 className="text-sm font-semibold text-red-300">Danger Zone</h2>
              </div>
              <p className="text-xs text-red-300/70 mb-4">
                Once you delete your account, all your projects, generation history,
                and data will be permanently removed. This action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="inline-flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[var(--bg-panel)] border border-[var(--border-default)]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--text-primary)]">Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[var(--text-body)]">
                      This will permanently delete your account and all projects. You will not be able to recover any data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 text-white/70 border border-[var(--border-default)] hover:bg-white/10">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                    >
                      {isDeleting ? "Deleting..." : "Delete my account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
