import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { ChatRequestSchema, inputProviderName } from "./types";
import { Gemini } from "./providers/Gemini";
import { Claude } from "./providers/Claude";
import { OpenAi as OpenAiLlm } from "./providers/OpenAi";
import { prisma } from "db";
import { ModelName } from "../../../packages/db/generated/prisma/internal/prismaNamespace";
import { LlmResponse } from "./providers/Base";
import { responseToSetHeaders } from "elysia/adapter/utils";
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
          id: true,
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
          slug: providerModelName,
        },
      });

      if (!modelDb) {
        set.status = 403;
        return {
          message: `${providerModelName} model isn't available`,
        };
      }

      const modelProviderMapping = await prisma.modelProviderMapping.findFirst({
        where: {
          modelId: modelDb.id,
        },
      });

      if (!modelProviderMapping) {
        set.status = 403;
        return {
          message: `${ModelName} provider isn't available`,
        };
      }
      let response: LlmResponse;
      switch (providerName) {
        case inputProviderName.Anthropic:
          response = await Claude.getInstance().chat(
            providerModelName,
            messages,
          );
          break;
        case inputProviderName.Gemini:
          response = await Gemini.getInstance().chat(
            providerModelName,
            messages,
          );
          break;
        case inputProviderName.Openai:
          response = await OpenAiLlm.getInstance().chat(
            providerModelName,
            messages,
          );
          break;
        default:
          response = await Gemini.getInstance().chat(
            providerModelName,
            messages,
          );
      }
      // storing the conversation in the conversation table
      const conversation = await prisma.conversation.create({
        data: {
          input: messages[0].content,
          inputTokenCount: response.inputTokenConsumed,
          outputTokenCount: response.outputTokenConsumed,
          output: response.completions.choices[0].message.content,
          apiKeyId: doesExists.id,
          userId: doesExists.user.id,
          modelProviderMappingId: modelProviderMapping.id,
        },
      });
    },
    {
      body: ChatRequestSchema,
    },
  )
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
