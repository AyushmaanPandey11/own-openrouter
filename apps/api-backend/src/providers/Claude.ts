import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";
import Anthropic from "@anthropic-ai/sdk";

export class Claude implements BaseLlm {
  static instance: Claude;
  private ai: Anthropic;

  constructor() {
    this.ai = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY!,
    });
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Claude();
    }
    return this.instance;
  }

  async chat(model: string, message: Messages): Promise<LlmResponse> {
    const response = await this.ai.messages.create({
      model,
      messages: message.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: 1024,
    });
    const textBlock = response.content.find((block) => block.type === "text");
    return {
      completions: {
        choices: [
          {
            message: {
              content: textBlock?.text!,
            },
          },
        ],
      },
      inputTokenConsumed: response.usage.input_tokens!,
      outputTokenConsumed: response.usage.output_tokens!,
    };
  }
}
