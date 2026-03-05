import { createAnthropic } from "@ai-sdk/anthropic";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const supportAgent = new Agent(components.agent, {
  chat: anthropic("claude-3-haiku-20240307"),
  instructions: SUPPORT_AGENT_PROMPT,
});
