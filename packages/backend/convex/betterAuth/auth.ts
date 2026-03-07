import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import schema from "./schema";

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>): BetterAuthOptions => {
  return {
    appName: "Omnix",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    plugins: [
      organization({
        allowUserToCreateOrganization: true,
        sendInvitationEmail: async (data) => {
          try {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY);
            const inviteUrl = `${process.env.SITE_URL}/invite/${data.id}`;
            await resend.emails.send({
              from: "Omnix <onboarding@resend.dev>",
              to: data.email,
              subject: `You've been invited to join ${data.organization.name} on Omnix`,
              html: `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
                  <h2 style="color:#111">You've been invited!</h2>
                  <p>You have been invited to join <strong>${data.organization.name}</strong> on Omnix as a <strong>${data.role}</strong>.</p>
                  <p>Click the link below to accept the invitation:</p>
                  <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">
                    Accept Invitation
                  </a>
                  <p style="color:#888;font-size:13px">Or copy this link: ${inviteUrl}</p>
                  <p style="color:#888;font-size:13px">If you weren't expecting this, you can safely ignore this email.</p>
                </div>
              `,
            });
          } catch (err) {
            // Log but don't throw — the invitation is already saved in DB.
            // User can still use the URL-based invite link as fallback.
            console.error("Failed to send invite email via Resend:", err);
          }
        },
      }),
      convex({
        authConfig,
        jwt: {
          definePayload: ({ user, session }: { user: any; session: any }) => ({
            name: user.name,
            email: user.email,
            orgId: session.activeOrganizationId || undefined,
          }),
        },
      }),
    ],
  } satisfies BetterAuthOptions as BetterAuthOptions;
};

// For `auth` CLI
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
