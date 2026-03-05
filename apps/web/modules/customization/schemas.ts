import { z } from "zod";

export const widgetSettingsSchema = z.object({
  companyName: z.string().optional(),
  tagline: z.string().optional(),
  greetMessage: z.string().min(1, "Greeting message is required"),
  defaultSuggestions: z.array(
    z.object({ value: z.string() })
  ),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});
