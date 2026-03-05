import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import rag from "../rag";

export const search = createTool({
  description: "Search the knowledge base for relevant information to help answer user questions",
  args: z.object({
    query: z
      .string()
      .describe("The search query to find relevant information")
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "No relevant information found in the knowledge base for this query.";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: ctx.threadId },
    );

    if (!conversation) {
      return "No relevant information found in the knowledge base for this query.";
    }

    const orgId = conversation.organizationId;

    let searchText = "";
    try {
      const searchResult = await rag.search(ctx, {
        namespace: orgId,
        query: args.query,
        limit: 5,
      });
      searchText = searchResult.text?.trim() ?? "";
    } catch {
      // RAG search unavailable – agent will fall back to business context
      return "No relevant information found in the knowledge base for this query.";
    }

    if (!searchText) {
      return "No relevant information found in the knowledge base for this query.";
    }

    return searchText;
  },
});
