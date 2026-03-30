import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { authMiddleware } from "../authMiddleware";
import { ApikeysModel } from "./model";
import { ApiKeyService } from "./service";

export const apiKey = new Elysia({ prefix: "/api-keys" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "7d",
    }),
  )
  .resolve(authMiddleware)
  .post(
    "/create",
    async ({ userId, body, set }) => {
      try {
        const { apiKey, id } = await ApiKeyService.createApiKey(
          Number(userId),
          body.name,
        );
        return {
          id,
          apiKey,
        };
      } catch (error) {
        set.status = 400;
        return {
          message: "error in creating api key",
        } as any;
      }
    },
    {
      body: ApikeysModel.createApiKeySchema,
      response: {
        200: ApikeysModel.createApiKeyResponseSchema,
        400: t.Literal("error in creating api key"),
      },
    },
  )
  .get(
    "/get",
    async (userId) => {
      const keys = await ApiKeyService.getApiKeys(Number(userId));
      return keys;
    },
    {
      response: {
        200: ApikeysModel.getApiKeysResponseSchema,
      },
    },
  )
  .post(
    "/disable",
    async ({ userId, body, set }) => {
      const { isDisabled } = await ApiKeyService.disableKey(
        Number(userId),
        Number(body.id),
      );

      if (isDisabled) {
        return {
          message: "Api Key disabled Successfully!",
        };
      } else {
        set.status = 400;
        return {
          message: "Issue in disabling the key",
        } as any;
      }
    },
    {
      body: ApikeysModel.disableApiKeySchema,
      response: {
        200: ApikeysModel.disableApiKeyResponseSchema,
      },
    },
  )
  .delete("/:id", async ({ params, userId, set }) => {
    const { isDeleted } = await ApiKeyService.deleteKey(
      Number(userId),
      Number(params.id),
    );

    if (isDeleted) {
      return {
        message: "Api Key deleted Successfully!",
      };
    } else {
      set.status = 400;
      return {
        message: "Issue in deleting the key",
      } as any;
    }
  });
