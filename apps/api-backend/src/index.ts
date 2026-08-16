import bearer from "@elysiajs/bearer";
import { Elysia, t } from "elysia";
import { ChatRequestSchema, inputProviderName } from "./types";
import { Gemini } from "./providers/Gemini";
import { Claude } from "./providers/Claude";
import { OpenAi as OpenAiLlm } from "./providers/OpenAi";
import { prisma } from "db";
import { LlmResponse } from "./providers/Base";
import { createHash } from "crypto";
import { Prisma } from "db";

function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

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
          keyHash: hashApiKey(apiKey!),
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
          message: `${modelDb.name} provider isn't available`,
        };
      }
      let response: LlmResponse;
      try {
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
      } catch (err) {
        set.status = 502;
        return { message: "Upstream provider error", detail: String(err) };
      }

      if (!response.completions.choices?.[0]?.message?.content) {
        set.status = 502;
        return { message: "Provider returned an empty or invalid response" };
      }

      const cost =
        response.inputTokenConsumed * modelProviderMapping.inputTokenCost +
        response.outputTokenConsumed * modelProviderMapping.outputTokenCost;
      let conversation;
      try {
        conversation = await prisma.$transaction([
          prisma.user.update({
            where: {
              id: doesExists.user.id,
              credits: { gte: cost },
            },
            data: {
              credits: {
                decrement: cost,
              },
            },
          }),
          prisma.apiKey.update({
            where: {
              id: doesExists.id,
            },
            data: {
              creditsConsumed: {
                increment: cost,
              },
              lastUsed: new Date(),
            },
          }),
          prisma.conversation.create({
            data: {
              input: messages[0].content,
              inputTokenCount: response.inputTokenConsumed,
              outputTokenCount: response.outputTokenConsumed,
              output: response.completions.choices[0].message.content,
              apiKeyId: doesExists.id,
              userId: doesExists.user.id,
              modelProviderMappingId: modelProviderMapping.id,
            },
          }),
        ]);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          set.status = 403;
          return { message: "Insufficient credits for this request" };
        }
        set.status = 500;
        return { message: "Internal error recording conversation" };
      }

      return {
        id: conversation[2].id,
        model,
        choices: response.completions.choices,
        usage: {
          prompt_tokens: response.inputTokenConsumed,
          completion_tokens: response.outputTokenConsumed,
          total_tokens:
            response.inputTokenConsumed + response.outputTokenConsumed,
        },
      };
    },
    {
      body: ChatRequestSchema,
    },
  )
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
