import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

export const getByOrganizationId = internalQuery({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const businessInfo = await ctx.db
      .query("businessInfo")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .unique();

    return businessInfo;
  },
});

export const upsertByOrganizationId = internalMutation({
  args: {
    organizationId: v.string(),
    companyName: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    productsAndServices: v.optional(v.string()),
    supportEmail: v.optional(v.string()),
    supportPhone: v.optional(v.string()),
    businessHours: v.optional(v.string()),
    returnPolicy: v.optional(v.string()),
    additionalContext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { organizationId, ...data } = args;

    const existing = await ctx.db
      .query("businessInfo")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("businessInfo", {
        organizationId,
        ...data,
      });
    }
  },
});
