import { createGroq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const supportAgent = new Agent(components.agent, {
  chat: groq("llama-3.3-70b-versatile"),
  instructions: SUPPORT_AGENT_PROMPT,
});
