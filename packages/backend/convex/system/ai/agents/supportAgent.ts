import { createOpenAI } from "@ai-sdk/openai";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

// Use Groq's OpenAI-compatible API for fast inference
const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const supportAgent = new Agent(components.agent, {
  chat: groq("llama-3.3-70b-versatile"),
  instructions: SUPPORT_AGENT_PROMPT,
});
