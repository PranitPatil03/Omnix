import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

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
