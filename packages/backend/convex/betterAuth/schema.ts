// Auto-generated schema for better-auth Convex component
// Tables: user, session, account, verification, organization, member, invitation, jwks
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("email", ["email"]),

  session: defineTable({
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    userId: v.string(),
    activeOrganizationId: v.optional(v.string()),
  })
    .index("token", ["token"])
    .index("userId", ["userId"]),

  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("accountId", ["accountId"])
    .index("userId", ["userId"]),

  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("identifier", ["identifier"]),

  organization: defineTable({
    name: v.string(),
    slug: v.optional(v.string()),
    logo: v.optional(v.string()),
    createdAt: v.number(),
    metadata: v.optional(v.string()),
  }).index("slug", ["slug"]),

  member: defineTable({
    organizationId: v.string(),
    userId: v.string(),
    role: v.string(),
    createdAt: v.number(),
  })
    .index("organizationId", ["organizationId"])
    .index("userId", ["userId"])
    .index("organizationId_userId", ["organizationId", "userId"]),

  invitation: defineTable({
    organizationId: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
    status: v.string(),
    expiresAt: v.number(),
    inviterId: v.string(),
  })
    .index("organizationId", ["organizationId"])
    .index("email", ["email"]),

  jwks: defineTable({
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }),
});
