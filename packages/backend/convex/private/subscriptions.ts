import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const orgId = identity.orgId as string;
    if (!orgId) return null;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", orgId)
      )
      .unique();

    return subscription;
  },
});

/**
 * Sync subscription status after Stripe checkout verification.
 * Called from the client after the /api/stripe/verify endpoint confirms payment.
 * Protected by auth — uses the orgId from the JWT token.
 */
export const syncStatus = mutation({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const orgId = identity.orgId as string;
    if (!orgId) throw new Error("No active organization");

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", orgId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status });
    } else {
      await ctx.db.insert("subscriptions", {
        organizationId: orgId,
        status: args.status,
      });
    }
  },
});
