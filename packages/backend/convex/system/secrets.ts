"use node";

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { encrypt } from "../lib/encryption";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`;
    const encrypted = encrypt(JSON.stringify(args.value));

    await ctx.runMutation(internal.system.plugins.upsert, {
      service: args.service,
      secretName,
      secretValue: encrypted,
      organizationId: args.organizationId,
    });

    return { status: "success" };
  },
});
