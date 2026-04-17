import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { ChatRequestSchema, inputProviderName } from "./types";
import { Gemini } from "./providers/Gemini";
import { Claude } from "./providers/Claude";
import { OpenAi as OpenAiLlm } from "./providers/OpenAi";
const app = new Elysia()
  .use(bearer())
  .post(
    "/api/v1/chat/completions",
    async ({ body, bearer }) => {
      const { model, messages } = body;
      const [providerName, providerModelName] = model.split("/");
      switch (providerName) {
        case inputProviderName.Anthropic:
          return await Claude.getInstance().chat(providerModelName, messages);
        case inputProviderName.Gemini:
          return await Gemini.getInstance().chat(providerModelName, messages);
        case inputProviderName.Openai:
          return await OpenAiLlm.getInstance().chat(
            providerModelName,
            messages,
          );
        default:
          return await Claude.getInstance().chat(providerModelName, messages);
      }
    },
    {
      body: ChatRequestSchema,
    },
  )
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
