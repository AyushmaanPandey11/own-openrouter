import { t } from "elysia";

export const Messages = t.Array(
  t.Object({
    role: t.Enum({
      user: "user",
      assisstant: "assistant",
    }),
    content: t.String(),
  }),
);

export type Messages = typeof Messages.static;

export const ChatRequestSchema = t.Object({
  model: t.String(),
  messages: Messages,
});

export type ChatRequestSchema = typeof ChatRequestSchema.static;

export enum inputProviderName {
  Openai = "openai",
  Anthropic = "anthropic",
  Gemini = "gemini",
}
