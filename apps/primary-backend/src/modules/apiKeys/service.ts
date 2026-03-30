import { prisma } from "db";
import { ApikeysModel } from "./model";

const API_KEY_LENGTH = 20;
const API_KEY_SET =
  "qwertyuipoasdfghjklzxcvbnmASDFGHJKLQWERTYUIPOZXCVBNM1234567890";

export abstract class ApiKeyService {
  static generateApiKey() {
    let suffixKey = "";
    for (let idx = 0; idx < API_KEY_LENGTH; idx++) {
      suffixKey += API_KEY_SET[Math.random() * 10];
    }
    return `sk-or-v1-${suffixKey}`;
  }

  static async createApiKey(
    userId: number,
    name: string,
  ): Promise<{ id: string; apiKey: string }> {
    const createdApiKey = this.generateApiKey();
    const apiKeyDb = await prisma.apiKey.create({
      data: {
        name,
        userId,
        apikey: createdApiKey,
      },
    });

    return {
      id: apiKeyDb.id.toString(),
      apiKey: createdApiKey,
    };
  }

  static async getApiKeys(
    userId: number,
  ): Promise<ApikeysModel["getApiKeysResponseSchema"]> {
    const data = await prisma.apiKey.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        apikey: true,
        name: true,
        lastUsed: true,
        creditsConsumed: true,
      },
    });

    return {
      keys: data.map((key) => ({
        id: key.id.toString(),
        apiKey: key.apikey,
        name: key.name,
        lastUsed: key.lastUsed?.toString(),
        creditsConsumed: key.creditsConsumed.toString(),
      })),
    };
  }

  static async disableKey(
    userId: number,
    id: number,
  ): Promise<{ isDisabled: boolean }> {
    const updatedData = await prisma.apiKey.update({
      data: {
        isDisabled: true,
      },
      where: {
        userId,
        id,
      },
    });
    return {
      isDisabled: updatedData.isDisabled,
    };
  }

  static async deleteKey(
    userId: number,
    id: number,
  ): Promise<{ isDeleted: boolean }> {
    const updatedData = await prisma.apiKey.update({
      data: {
        isDeleted: true,
      },
      where: {
        userId,
        id,
      },
    });
    return {
      isDeleted: updatedData.isDeleted,
    };
  }
}
