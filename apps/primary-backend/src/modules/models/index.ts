import Elysia from "elysia";
import { modModels } from "./model";
import { ModelService } from "./service";
export const model = new Elysia({ prefix: "/model" })
  .get(
    "/",
    async () => {
      const list = await ModelService.getModels();
      return list;
    },
    {
      response: {
        200: modModels.getModelListResponseSchema,
      },
    },
  )
  .get(
    "/providers",
    async () => {
      const providersList = await ModelService.getProviders();
      return providersList;
    },
    {
      response: {
        200: modModels.getProvidersListResponseSchema,
      },
    },
  )
  .get(
    "/:id/providers",
    async ({ params }) => {
      const list = await ModelService.getModelProviders(Number(params.id));
      return list;
    },
    {
      response: {
        200: modModels.getModelAndProvidersResponseSchema,
      },
    },
  );
