import { createOpenAI } from "@ai-sdk/openai";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import rag from "../rag";
import { SEARCH_INTERPRETER_PROMPT } from "../constants";

// Use Groq's OpenAI-compatible API for fast inference (same as the support agent)
const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

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

    const response = await generateText({
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `User asked: "${args.query}"\n\nSearch results: ${searchText}`
        }
      ],
      model: groq("llama-3.3-70b-versatile"),
    });

    return response.text;
  },
});
