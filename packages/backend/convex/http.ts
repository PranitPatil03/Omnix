import Stripe from "stripe";
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./betterAuth/auth";

const http = httpRouter();

// Register better-auth routes (handles /api/auth/* on the Convex site)
authComponent.registerRoutes(http, createAuth);

// Stripe webhook endpoint for subscription management
http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
    });

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const body = await request.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;

        if (organizationId) {
          await ctx.runMutation(internal.system.subscriptions.upsert, {
            organizationId,
            status: "active",
          });
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = subscription.metadata?.organizationId;

        if (organizationId) {
          await ctx.runMutation(internal.system.subscriptions.upsert, {
            organizationId,
            status: subscription.status === "active" ? "active" : "inactive",
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const organizationId = subscription.metadata?.organizationId;

        if (organizationId) {
          await ctx.runMutation(internal.system.subscriptions.upsert, {
            organizationId,
            status: "canceled",
          });
        }
        break;
      }
      default:
        console.log("Ignored Stripe webhook event:", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
