import { NextResponse } from "next/server";
import { constructStripeEvent, isRelevantEvent } from "@/lib/stripe/webhooks";
import { syncSubscriptionFromStripe } from "@/lib/stripe/helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    let event;
    try {
      event = constructStripeEvent(body, signature);
    } catch {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    if (!isRelevantEvent(event.type)) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { client_reference_id?: string; subscription?: string; customer?: string };
        if (session.client_reference_id && session.subscription) {
          await syncSubscriptionFromStripe(
            session.client_reference_id,
            session.subscription as string,
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as { id: string; metadata?: Record<string, string> };
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .maybeSingle();

        if (existingSub?.user_id) {
          await syncSubscriptionFromStripe(
            existingSub.user_id,
            subscription.id,
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as { id: string; subscription: string; amount_paid: number; currency: string };
        if (invoice.subscription) {
          const { data: invSub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", invoice.subscription)
            .maybeSingle();
          if (invSub?.user_id) {
            await syncSubscriptionFromStripe(
              invSub.user_id,
              invoice.subscription as string,
            );
            await supabase.from("invoices").insert({
              user_id: invSub.user_id,
              stripe_invoice_id: invoice.id,
              stripe_subscription_id: invoice.subscription,
              amount_paid: invoice.amount_paid,
              currency: invoice.currency,
              status: "paid",
              created_at: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object as { id: string; subscription: string; attempt_count?: number };
        if (failedInvoice.subscription) {
          const { data: failSub } = await supabase
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_subscription_id", failedInvoice.subscription)
            .maybeSingle();
          if (failSub?.user_id) {
            await supabase.from("invoices").insert({
              user_id: failSub.user_id,
              stripe_invoice_id: failedInvoice.id,
              stripe_subscription_id: failedInvoice.subscription,
              status: "failed",
              attempt_count: failedInvoice.attempt_count || 1,
              created_at: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "customer.subscription.trial_will_end": {
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe-webhook] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
