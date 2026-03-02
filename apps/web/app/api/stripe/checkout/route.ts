import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
});

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get active organization from session
    const organizationId = (session.session as any).activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json({ error: "No active organization" }, { status: 400 });
    }

    // Get the price ID — either directly set or look up from product
    let priceId = process.env.STRIPE_PRO_PRICE_ID;
    if (!priceId && process.env.STRIPE_PRO_PRODUCT_ID) {
      const prices = await stripe.prices.list({
        product: process.env.STRIPE_PRO_PRODUCT_ID,
        active: true,
        limit: 1,
      });
      priceId = prices.data[0]?.id;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe Pro price not configured" },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        organizationId, // Passed to webhook for mapping
        userId: session.user.id,
      },
      subscription_data: {
        metadata: {
          organizationId,
        },
      },
      customer_email: session.user.email,
      success_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/billing?success=true`,
      cancel_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/billing?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error.message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
