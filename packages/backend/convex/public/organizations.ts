import { v } from "convex/values";
import { query } from "../_generated/server";

// Validate organization exists by checking if any data exists for it.
// The widget calls this to verify the org ID is valid before loading.
export const validate = query({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if org has widget settings (created when org sets up)
    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    if (widgetSettings) {
      return { valid: true };
    }

    // Also check if there are any conversations for this org
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .first();

    if (conversation) {
      return { valid: true };
    }

    // Check subscriptions
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    if (subscription) {
      return { valid: true };
    }

    return { valid: false, reason: "Organization not found" };
  },
});
