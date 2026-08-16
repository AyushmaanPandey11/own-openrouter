import { prisma } from "db";
import { ApikeysModel } from "./model";
import { createHash, randomBytes } from "crypto";

export abstract class ApiKeyService {
  static generateApiKey() {
    const secret = randomBytes(24).toString("base64url");
    return `sk-or-v1-${secret}`;
  }

  static hashApiKey(apiKey: string) {
    return createHash("sha256").update(apiKey).digest("hex");
  }

  static async createApiKey(
    userId: number,
    name: string,
  ): Promise<{ id: string; apiKey: string }> {
    const rawKey = this.generateApiKey();
    const keyHash = this.hashApiKey(rawKey);
    const keyPrefix = rawKey.slice(0, 14); // "sk-or-v1-ab12" style

    const apiKeyDb = await prisma.apiKey.create({
      data: { name, userId, keyHash, keyPrefix },
    });

    // rawKey is returned ONLY here — it is never stored or retrievable again
    return { id: apiKeyDb.id.toString(), apiKey: rawKey };
  }

  static async getApiKeys(
    userId: number,
  ): Promise<ApikeysModel["getApiKeysResponseSchema"]> {
    const data = await prisma.apiKey.findMany({
      where: {
        userId,
        isDeleted: false,
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
        isDisabled: false,
      },
    });
    return {
      isEnabled: updatedData.isDisabled,
    };
  }

  static async updateApiKey(userId: number, id: number, isDisabled: boolean) {
    const { count } = await prisma.apiKey.updateMany({
      where: { id, userId, isDeleted: false },
      data: { isDisabled },
    });
    if (count === 0) throw new Error("Api key not found");
  }

  static async deleteKey(userId: number, id: number) {
    const { count } = await prisma.apiKey.updateMany({
      where: { id, userId, isDeleted: false },
      data: { isDeleted: true },
    });
    if (count === 0) throw new Error("Api key not found");
  }
}
