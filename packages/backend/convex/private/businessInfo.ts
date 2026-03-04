import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const upsert = mutation({
  args: {
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
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const existing = await ctx.db
      .query("businessInfo")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        companyName: args.companyName,
        website: args.website,
        industry: args.industry,
        description: args.description,
        productsAndServices: args.productsAndServices,
        supportEmail: args.supportEmail,
        supportPhone: args.supportPhone,
        businessHours: args.businessHours,
        returnPolicy: args.returnPolicy,
        additionalContext: args.additionalContext,
      });
    } else {
      await ctx.db.insert("businessInfo", {
        organizationId: orgId,
        companyName: args.companyName,
        website: args.website,
        industry: args.industry,
        description: args.description,
        productsAndServices: args.productsAndServices,
        supportEmail: args.supportEmail,
        supportPhone: args.supportPhone,
        businessHours: args.businessHours,
        returnPolicy: args.returnPolicy,
        additionalContext: args.additionalContext,
      });
    }
  },
});

export const getOne = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return null;
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      return null;
    }

    const businessInfo = await ctx.db
      .query("businessInfo")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .unique();

    return businessInfo;
  },
});
