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
        lastUsed: t.Optional(t.String()),
        creditsConsumed: t.String(),
      }),
    ),
  }),

  disableApiKeySchema: t.Object({
    id: t.String(),
  }),

  disableApiKeyResponseSchema: t.Object({
    message: t.Literal("Api Key disabled Successfully!"),
  }),
};

export type ApikeysModel = {
  [k in keyof typeof ApikeysModel]: UnwrapSchema<(typeof ApikeysModel)[k]>;
};
