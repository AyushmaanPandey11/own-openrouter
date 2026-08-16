import { t } from "elysia";

export const Messages = t.Array(
  t.Object({
    role: t.Enum({
      user: "user",
      assisstant: "assisstant",
      system: "system",
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

export const ChatCompletionMessageSchema = t.Object({
  role: t.Union([
    t.Literal("system"),
    t.Literal("user"),
    t.Literal("assistant"),
  ]),
  content: t.String(),
});

export const ChatCompletionChoiceSchema = t.Object({
  index: t.Number(),
  message: ChatCompletionMessageSchema,
  finish_reason: t.Union([
    t.Literal("stop"),
    t.Literal("length"),
    t.Literal("content_filter"),
    t.Null(),
  ]),
});

export const ChatCompletionUsageSchema = t.Object({
  prompt_tokens: t.Number(),
  completion_tokens: t.Number(),
  total_tokens: t.Number(),
});

export const ChatCompletionResponseSchema = t.Object({
  id: t.Number(),
  model: t.String(),
  choices: t.Array(ChatCompletionChoiceSchema),
  usage: ChatCompletionUsageSchema,
});

export enum inputProviderName {
  Openai = "openai",
  Anthropic = "anthropic",
  Gemini = "gemini",
}
