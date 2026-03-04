import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { saveMessage } from "@convex-dev/agent";
import { search } from "../system/ai/tools/search";
import { SUPPORT_AGENT_PROMPT } from "../system/ai/constants";
import { buildBusinessContext } from "../system/ai/utils";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId,
      },
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation resolved",
      });
    }

    // This refreshes the user's session if they are within the threshold
    await ctx.runMutation(internal.system.contactSessions.refresh, {
      contactSessionId: args.contactSessionId,
    });

    const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      {
        organizationId: conversation.organizationId,
      },
    );

    const shouldTriggerAgent =
      conversation.status === "unresolved"

    if (shouldTriggerAgent) {
      // Fetch business info to provide context to the AI agent
      const businessInfo = await ctx.runQuery(
        internal.system.businessInfo.getByOrganizationId,
        { organizationId: conversation.organizationId },
      );

      const businessContext = buildBusinessContext(businessInfo);
      const systemPrompt = businessContext
        ? `${SUPPORT_AGENT_PROMPT}\n\n${businessContext}`
        : SUPPORT_AGENT_PROMPT;

      try {
        await supportAgent.generateText(
          ctx,
          { threadId: args.threadId },
          {
            prompt: args.prompt,
            system: systemPrompt,
            tools: {
              escalateConversationTool: escalateConversation,
              resolveConversationTool: resolveConversation,
              searchTool: search,
            },
          },
        );
      } catch (error) {
        console.error("[SupportAgent] generateText failed:", error);
        // NOTE: generateText saves the user message internally BEFORE calling the AI.
        // Do NOT call saveMessage with the user prompt here — it would create a duplicate.
        // Just save a graceful fallback assistant reply using the agent's own method.
        try {
          await supportAgent.saveMessage(ctx, {
            threadId: args.threadId,
            message: {
              role: "assistant",
              content:
                "I'm having trouble connecting right now. Please try again in a moment, or type \"human\" and I'll connect you with a real person.",
            },
          });
        } catch (fallbackError) {
          // Swallow — don't let this propagate as a Server Error
          console.error("[SupportAgent] Failed to save fallback message:", fallbackError);
        }
      }
    } else {
      await saveMessage(ctx, components.agent, {
        threadId: args.threadId,
        prompt: args.prompt,
      });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});
