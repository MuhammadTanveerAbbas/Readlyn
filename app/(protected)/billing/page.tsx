"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import { PLANS, type PlanId } from "@/config/plans";
import {
  CreditCard,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type SubscriptionInfo = {
  status: string;
  plan_id: PlanId;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
} | null;

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<PlanId | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(null);
  const [_error, _setError] = useState("");

  const success = searchParams?.get("success") === "true";
  const canceled = searchParams?.get("canceled") === "true";

  useEffect(() => {
    if (success) toast.success("Subscription activated successfully!");
    if (canceled) toast.error("Checkout was canceled.");
  }, [success, canceled]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setSubscription(data as SubscriptionInfo);
      setLoading(false);
    };
    load();
  }, [router]);

  const currentPlan = subscription ? PLANS[subscription.plan_id] : PLANS.free;

  const handleUpgrade = async (planId: PlanId, priceId: string) => {
    if (!priceId) {
      toast.error("This plan is not configured yet.");
      return;
    }
    setUpgrading(planId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch {
      toast.error("Failed to open billing portal.");
    }
  };

  const statusBadge = () => {
    if (!subscription) return null;
    const s = subscription.status;
    if (s === "active") return <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Active</span>;
    if (s === "trialing") return <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">Trial</span>;
    if (s === "past_due") return <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Past Due</span>;
    if (s === "canceled") return <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">Canceled</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar onNewProject={() => router.push("/dashboard")} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/6 bg-[#0a0a0a] px-4 md:hidden">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-white/60 hover:text-white" aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-bold text-white">Billing</span>
      </div>

      <main className="md:ml-[260px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border border-white/10 bg-[#0f0f0f] p-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-4 w-4 text-[#F5C518]" />
            <h1 className="text-lg font-semibold text-white">Billing & Plan</h1>
          </div>
          <p className="text-sm text-white/50">Manage your subscription and payment methods.</p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto mb-3 text-[#F5C518] animate-spin" />
            <p className="text-sm text-white/60">Loading billing info...</p>
          </div>
        ) : _error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
            <p className="text-sm font-medium">Failed to load billing</p>
            <p className="mt-1 text-xs text-red-300/70">{_error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-xs text-red-300 underline">Retry</button>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-white/10 bg-[#0f0f0f] p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Current Plan</h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    You are on the <strong className="text-white">{currentPlan.name}</strong> plan
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {statusBadge()}
                </div>
              </div>
              {subscription && (
                <div className="grid gap-3 sm:grid-cols-2 mb-4">
                  <div className="rounded-lg border border-white/8 bg-[#161616] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/40">Status</p>
                    <p className="mt-1 text-sm text-white capitalize">{subscription.status}</p>
                  </div>
                  <div className="rounded-lg border border-white/8 bg-[#161616] p-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/40">Current Period Ends</p>
                    <p className="mt-1 text-sm text-white">
                      {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {subscription?.stripe_customer_id && (
                <button
                  onClick={handleManageSubscription}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#FFDC40]"
                >
                  <CreditCard className="h-4 w-4" />
                  Manage Subscription
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <h2 className="text-sm font-semibold text-white mb-3">Available Plans</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.values(PLANS).map((plan) => {
                const isCurrent = subscription?.plan_id === plan.id;
                const isFree = plan.id === "free";
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-5 transition-all ${
                      isCurrent
                        ? "border-[#F5C518]/40 bg-[#F5C518]/5"
                        : "border-white/10 bg-[#0f0f0f] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider text-[#F5C518] font-bold">Current</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-white">
                        {plan.price === 0 ? "Free" : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs text-white/50 ml-1">/{plan.interval}</span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mb-4">{plan.description}</p>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-white/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {!isCurrent && !isFree && (
                      <button
                        onClick={() => handleUpgrade(plan.id, plan.stripePriceId)}
                        disabled={upgrading === plan.id}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 py-2 text-sm font-bold text-black transition-all hover:bg-[#FFDC40] disabled:opacity-50"
                      >
                        {upgrading === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Upgrade
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                    {isFree && !isCurrent && (
                      <button
                        disabled
                        className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 cursor-not-allowed"
                      >
                        Downgrade to Free
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
