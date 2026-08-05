import { prisma } from "db";
import { ApikeysModel } from "./model";

const API_KEY_LENGTH = 20;
const API_KEY_SET =
  "qwertyuipoasdfghjklzxcvbnmASDFGHJKLQWERTYUIPOZXCVBNM1234567890";

export abstract class ApiKeyService {
  static generateApiKey() {
    let suffixKey = "";
    for (let idx = 0; idx < API_KEY_LENGTH; idx++) {
      suffixKey += API_KEY_SET[Math.floor(Math.random() * API_KEY_SET.length)];
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
        isDeleted: true,
      },
      select: {
        id: true,
        apikey: true,
        name: true,
        lastUsed: true,
        creditsConsumed: true,
        isDisabled: true,
      },
    });

    return {
      keys: data.map((key) => ({
        id: key.id.toString(),
        apiKey: key.apikey,
        name: key.name,
        lastUsed: key.lastUsed!,
        creditsConsumed: key.creditsConsumed,
        isDisabled: key.isDisabled,
      })),
    };
  }

  static async updateApiKey(userId: number, id: number, isDisabled: boolean) {
    await prisma.apiKey.update({
      data: {
        isDisabled,
      },
      where: {
        userId,
        id,
      },
    });
  }

  static async enableKey(
    userId: number,
    id: number,
  ): Promise<{ isEnabled: boolean }> {
    const updatedData = await prisma.apiKey.update({
      data: {
        isDisabled: false,
      },
      where: {
        userId,
        id,
      },
    });
    return {
      isEnabled: updatedData.isDisabled,
    };
  }

  static async deleteKey(userId: number, id: number) {
    await prisma.apiKey.update({
      data: {
        isDeleted: true,
      },
      where: {
        userId,
        id,
      },
    });
  }
}
