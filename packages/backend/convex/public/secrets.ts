"use node";

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { decrypt } from "../lib/encryption";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string()
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi",
      },
    );

    if (!plugin || !plugin.secretValue) {
      return null;
    }

    let secretData: { privateApiKey?: string; publicApiKey?: string } | null = null;
    try {
      const decrypted = decrypt(plugin.secretValue);
      secretData = JSON.parse(decrypted);
    } catch {
      return null;
    }

    if (!secretData?.publicApiKey || !secretData?.privateApiKey) {
      return null;
    }

    return {
      publicApiKey: secretData.publicApiKey,
    };
  },
});
