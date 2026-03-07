import { createAnthropic } from "@ai-sdk/anthropic";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const AI_AGENT_NAME = "Milo";

export const supportAgent = new Agent(components.agent, {
  name: AI_AGENT_NAME,
  chat: anthropic("claude-haiku-4-5-20251001"),
  instructions: SUPPORT_AGENT_PROMPT,
});
