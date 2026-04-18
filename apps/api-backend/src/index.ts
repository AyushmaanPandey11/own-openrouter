import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { ChatRequestSchema, inputProviderName } from "./types";
import { Gemini } from "./providers/Gemini";
import { Claude } from "./providers/Claude";
import { OpenAi as OpenAiLlm } from "./providers/OpenAi";
import { prisma } from "db";
import { ModelName } from "../../../packages/db/generated/prisma/internal/prismaNamespace";
const app = new Elysia()
  .use(bearer())
  .post(
    "/api/v1/chat/completions",
    async ({ body, bearer: apiKey, set }) => {
      const { model, messages } = body;
      const [providerName, providerModelName] = model.split("/");

      // checking api key from db
      const doesExists = await prisma.apiKey.findUnique({
        where: {
          apikey: apiKey,
          isDeleted: false,
          isDisabled: false,
        },
        select: {
          user: true,
        },
      });

      if (!doesExists) {
        set.status = 403;
        return {
          message: "apikey is invalid",
        };
      }

      if (doesExists.user.credits <= 0) {
        set.status = 403;
        return {
          message: "Credits are exhausted, please onramp credits",
        };
      }

      const modelDb = await prisma.model.findFirst({
        where: {
          slug: model,
        },
      });

      if (!modelDb) {
        set.status = 403;
        return {
          message: `${model} model isn't available`,
        };
      }

      const providers = await prisma.modelProviderMapping.findFirst({
        where: {
          modelId: modelDb.id,
        },
      });

      if (!providers) {
        set.status = 403;
        return {
          message: `${ModelName} provider isn't available`,
        };
      }

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
