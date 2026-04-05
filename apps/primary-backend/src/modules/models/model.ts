import { t, UnwrapSchema } from "elysia";

export const modModels = {
  getModelListResponseSchema: t.Object({
    models: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        slug: t.String(),
        company: t.Object({
          id: t.String(),
          name: t.String(),
          website: t.String(),
        }),
      }),
    ),
  }),
  getProvidersListResponseSchema: t.Object({
    providers: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        website: t.String(),
      }),
    ),
  }),
  getModelAndProvidersResponseSchema: t.Object({
    provider: t.Array(
      t.Object({
        id: t.String(),
        providerId: t.String(),
        providerName: t.String(),
        providerWebsite: t.String(),
        inputTokenCost: t.Number(),
        outputTokenCost: t.Number(),
      }),
    ),
  }),
} as const;

export type modModels = {
  [k in keyof typeof modModels]: UnwrapSchema<(typeof modModels)[k]>;
};
