import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { supportAgent } from "./ai/agents/supportAgent";
import { buildBusinessContext } from "./ai/utils";
import { SUPPORT_AGENT_PROMPT } from "./ai/constants";
import { escalateConversation } from "./ai/tools/escalateConversation";
import { resolveConversation } from "./ai/tools/resolveConversation";
import { search } from "./ai/tools/search";

const TEST_ORG_ID = "org_31QtvqJKwhtvop04esLJMkmFouB";

const TEST_QUESTIONS = [
  "What is Clyra?",
  "How much does the Pro plan cost?",
  "What's your refund policy?",
  "What file formats do you support?",
  "How do I cancel my subscription?",
];

export const testAIResponses = internalAction({
  args: {},
  handler: async (ctx) => {
    const businessInfo = await ctx.runQuery(
      internal.system.businessInfo.getByOrganizationId,
      { organizationId: TEST_ORG_ID },
    );

    const businessContext = buildBusinessContext(businessInfo);
    const systemPrompt = businessContext
      ? `${SUPPORT_AGENT_PROMPT}\n\n${businessContext}`
      : SUPPORT_AGENT_PROMPT;

    const results: Array<{ question: string; answer: string; error?: string }> = [];

    for (const question of TEST_QUESTIONS) {
      try {
        const { threadId } = await supportAgent.createThread(ctx, {
          userId: `test-${TEST_ORG_ID}`,
        });

        const result = await supportAgent.generateText(
          ctx,
          { threadId },
          {
            prompt: question,
            system: systemPrompt,
            tools: {
              escalateConversationTool: escalateConversation,
              resolveConversationTool: resolveConversation,
              searchTool: search,
            },
          },
        );

        // result.text is the direct AI response text
        const answer = result.text?.slice(0, 400) ?? "(no text returned)";

        results.push({ question, answer });
        console.log(`\n✅ Q: "${question}"\nA: ${answer}`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        results.push({ question, answer: "(ERROR)", error: errorMsg });
        console.error(`\n❌ Q: "${question}"\nERROR: ${errorMsg}`);
      }
    }

    return results;
  },
});
