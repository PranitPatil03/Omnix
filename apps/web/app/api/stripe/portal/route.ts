import { getToken } from "@/lib/auth-server";
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

    // Decode JWT payload for user email
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1]!, "base64url").toString()
    );
    const email: string | undefined = payload.email;

    if (!email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 });
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    const customer = customers.data[0]!;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe portal error:", error.message);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
