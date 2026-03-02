import { createClerkClient } from "@clerk/backend";
import { v } from "convex/values";
import { action } from "../_generated/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    try {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      });
      
      if (organization) {
        return { valid: true };
      } else {
        return { valid: false, reason: "Organization not valid" };
      }
    } catch (error: any) {
      // Clerk throws error when organization not found
      if (error?.code === 404 || error?.status === 404) {
        return { valid: false, reason: "Organization not found" };
      }
      // Re-throw other errors
      throw error;
    }
  },
});
