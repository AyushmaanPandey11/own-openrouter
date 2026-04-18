import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";
import OpenAI from "openai";

export class OpenAi implements BaseLlm {
  static instance: OpenAi;
  private ai: OpenAI;

  constructor() {
    this.ai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY!,
    });
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new OpenAi();
    }
    return this.instance;
  }

  async chat(model: string, message: Messages): Promise<LlmResponse> {
    const response = await this.ai.responses.create({
      model,
      input: message.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    return {
      completions: {
        choices: [
          {
            message: {
              content: response.output_text,
            },
          },
        ],
      },
      inputTokenConsumed: response.usage?.input_tokens!,
      outputTokenConsumed: response.usage?.output_tokens!,
    };
  }
}
