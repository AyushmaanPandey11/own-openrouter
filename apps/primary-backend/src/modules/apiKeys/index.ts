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
    async ({ userId }) => {
      const keys = await ApiKeyService.getApiKeys(Number(userId));
      return keys;
    },
    {
      response: {
        200: ApikeysModel.getApiKeysResponseSchema,
      },
    },
  )
  .put(
    "/update",
    async ({ userId, body, set }) => {
      try {
        await ApiKeyService.updateApiKey(
          Number(userId),
          Number(body.id),
          body.isDisabled,
        );
        return {
          message: "Api Key updated Successfully!",
        };
      } catch (error) {
        set.status = 411;
        return {
          message: "Api Key updated unsuccessfull",
        } as any;
      }
    },
    {
      body: ApikeysModel.updateApiKeySchema,
      response: {
        200: ApikeysModel.updateApiKeyResponseSchema,
        411: ApikeysModel.updateApiKeyResponseFailedSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, userId, set }) => {
      try {
        await ApiKeyService.deleteKey(Number(userId), Number(params.id));
        return {
          message: "Api Key deleted Successfully!",
        };
      } catch (error) {
        set.status = 411;
        return {
          message: "Api Key updated unsuccessfull",
        } as any;
      }
    },
    {
      response: {
        200: ApikeysModel.deleteApiKeyResponseSchema,
        411: ApikeysModel.updateApiKeyResponseFailedSchema,
      },
    },
  );
