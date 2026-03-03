import { getToken } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
});

/**
 * POST /api/stripe/verify
 *
 * Called after Stripe checkout redirect with ?success=true.
 * Looks up the most recent completed checkout session for this org
 * and returns the status so the client can sync it to Convex.
 */
export async function POST() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const organizationId = cookieStore.get("active_organization_id")?.value;
    if (!organizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    // Find recent completed checkout sessions for this org
    const sessions = await stripe.checkout.sessions.list({
      limit: 20,
    });

    const matchingSession = sessions.data.find(
      (s) =>
        s.metadata?.organizationId === organizationId &&
        s.status === "complete" &&
        s.payment_status === "paid"
    );

    if (!matchingSession) {
      return NextResponse.json({
        verified: false,
        message: "No completed checkout session found for this organization",
      });
    }

    // Also check if there's an active subscription
    if (matchingSession.subscription) {
      const subscriptionId =
        typeof matchingSession.subscription === "string"
          ? matchingSession.subscription
          : matchingSession.subscription.id;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      return NextResponse.json({
        verified: true,
        status: subscription.status === "active" ? "active" : "inactive",
        organizationId,
      });
    }

    return NextResponse.json({
      verified: true,
      status: "active",
      organizationId,
    });
  } catch (error: any) {
    console.error("Stripe verify error:", error.message);
    return NextResponse.json(
      { error: "Failed to verify checkout" },
      { status: 500 }
    );
  }
}
