import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanByStripePriceId } from "@/config/plans";
import { getStripeClient } from "@/lib/stripe/index";

export async function getUserSubscription(userId: string) {
  const supabase = createAdminClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return subscription;
}

export async function getUserStripeCustomerId(userId: string) {
  const supabase = createAdminClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  return subscription?.stripe_customer_id || null;
}

export function getSubscriptionStatus(
  subscription: { status: string; current_period_end: string } | null,
): "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "none" {
  if (!subscription) return "none";
  const status = subscription.status;
  if (status === "active" || status === "trialing") return status;
  if (status === "past_due") return "past_due";
  if (status === "canceled" || status === "unpaid") return status;
  return "none";
}

export async function syncSubscriptionFromStripe(
  userId: string,
  stripeSubscriptionId: string,
) {
  const stripe = getStripeClient();
  const supabase = createAdminClient();

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? getPlanByStripePriceId(priceId) : null;

  const upsertData = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: subscription.status,
    plan_id: plan?.id || "free",
    current_period_start: new Date(
      subscription.current_period_start * 1000,
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000,
    ).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("subscriptions").upsert(upsertData, {
    onConflict: "user_id",
  });

  if (error) {
    console.error("[syncSubscription] upsert error:", error.message);
    throw error;
  }

  return upsertData;
}
