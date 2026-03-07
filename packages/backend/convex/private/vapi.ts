"use node";

import { VapiClient, Vapi } from "@vapi-ai/server-sdk";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { ConvexError } from "convex/values";
import { decrypt } from "../lib/encryption";
import { buildBusinessContext } from "../system/ai/utils";
import { SUPPORT_AGENT_PROMPT } from "../system/ai/constants";

function parsePluginSecrets(plugin: { secretValue?: string }): {
  privateApiKey: string;
  publicApiKey: string;
} | null {
  if (!plugin.secretValue) return null;
  try {
    const decrypted = decrypt(plugin.secretValue);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      },
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    const secretData = parsePluginSecrets(plugin);

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      });
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    const assistants = await vapiClient.assistants.list();

    return assistants;
  },
});

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      },
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    const secretData = parsePluginSecrets(plugin);

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials not found",
      });
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    const phoneNumbers = await vapiClient.phoneNumbers.list();

    return phoneNumbers;
  },
});

export const createVoiceAssistant = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      },
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    const secretData = parsePluginSecrets(plugin);

    if (!secretData || !secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }

    // Fetch business info
    const businessInfo = await ctx.runQuery(
      internal.system.businessInfo.getByOrganizationId,
      { organizationId: orgId },
    );

    const businessContext = buildBusinessContext(businessInfo) || "No specific business info provided. Give general helpful answers about the business.";

    const companyName = businessInfo?.companyName || "Our Support";

    const voicePrompt = `You are a voice assistant doing customer support over the phone.
Keep your answers brief, conversational, and helpful. Follow the business context rules provided below.
CRITICAL: Do not use bullet points or markdown formatting since your response is spoken out loud over a phone call.

${businessContext}`;

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    // We cast to any because the CreateAssistantDto requires strict generic shapes in the TS definitions,
    // but the REST API consumes standard JSON structures.
    const requestPayload: any = {
      name: `${companyName} Generated Voice Assistant`,
      model: {
        provider: "anthropic",
        model: "claude-haiku-4-5-20251001",
        messages: [
          {
            role: "system",
            content: voicePrompt,
          },
        ],
      },
      firstMessageMode: "assistant-speaks-first",
      firstMessage: `Hello! Thanks for calling ${companyName}. How can I help you today?`,
    };

    const assistant = await vapiClient.assistants.create(requestPayload);
    return assistant;
  },
});
