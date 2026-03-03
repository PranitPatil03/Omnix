import { getToken } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
});

export async function POST() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode JWT payload for user info
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1]!, "base64url").toString()
    );
    const email: string | undefined = payload.email;

    // Get active organization from cookie (set by OrganizationGuard)
    const cookieStore = await cookies();
    const organizationId = cookieStore.get("active_organization_id")?.value;
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
        userId: payload.sub,
      },
      subscription_data: {
        metadata: {
          organizationId,
        },
      },
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing?canceled=true`,
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
