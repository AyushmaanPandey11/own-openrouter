import { t, type UnwrapSchema } from "elysia";

export const ApikeysModel = {
  createApiKeySchema: t.Object({
    name: t.String(),
  }),

  createApiKeyResponseSchema: t.Object({
    id: t.String(),
    name: t.String(),
    apiKey: t.String(),
  }),

  getApiKeysResponseSchema: t.Object({
    keys: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        apiKey: t.String(),
        lastUsed: t.Nullable(t.Date()),
        creditsConsumed: t.Number(),
        isDisabled: t.Boolean(),
      }),
    ),
  }),

  updateApiKeySchema: t.Object({
    id: t.String(),
    isDisabled: t.Boolean(),
  }),

  updateApiKeyResponseSchema: t.Object({
    message: t.Literal("Api Key updated Successfully!"),
  }),

  updateApiKeyResponseFailedSchema: t.Object({
    message: t.Literal("Api Key updated unsuccessfull"),
  }),

  deleteApiKeySchema: t.Object({
    id: t.String(),
  }),

  deleteApiKeyResponseSchema: t.Object({
    message: t.Literal("Api Key deleted Successfully!"),
  }),

  deleteApiKeyResponseFailedSchema: t.Object({
    message: t.Literal("Api Key deletion unsuccessfull"),
  }),
};

export type ApikeysModel = {
  [k in keyof typeof ApikeysModel]: UnwrapSchema<(typeof ApikeysModel)[k]>;
};
