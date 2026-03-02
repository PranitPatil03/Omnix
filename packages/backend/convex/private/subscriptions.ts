import { query } from "../_generated/server";

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
