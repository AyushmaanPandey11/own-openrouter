import { prisma } from "db";
import { modModels } from "./model";

export abstract class ModelService {
  static async getModels(): Promise<modModels["getModelListResponseSchema"]> {
    const data = await prisma.model.findMany({
      include: {
        company: true,
      },
    });

    return {
      models: data.map((m) => ({
        id: m.id.toString(),
        name: m.name,
        slug: m.slug,
        company: {
          id: m.company.id.toString(),
          name: m.company.name,
          website: m.company.website,
        },
      })),
    };
  }

  static async getProviders(): Promise<
    modModels["getProvidersListResponseSchema"]
  > {
    const data = await prisma.provider.findMany();
    return {
      providers: data.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        website: p.website,
      })),
    };
  }

  static async getModelProviders(
    modelId: number,
  ): Promise<modModels["getModelAndProvidersResponseSchema"]> {
    const data = await prisma.modelProviderMapping.findMany({
      where: {
        modelId,
      },
      include: {
        provider: true,
      },
    });
    return {
      provider: data.map((mp) => ({
        id: mp.id.toString(),
        providerId: mp.providerId.toString(),
        providerName: mp.provider.name,
        providerWebsite: mp.provider.website,
        inputTokenCost: mp.inputTokenCost,
        outputTokenCost: mp.outputTokenCost,
      })),
    };
  }
}
