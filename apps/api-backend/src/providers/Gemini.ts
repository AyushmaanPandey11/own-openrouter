import { Messages } from "../types";
import { BaseLlm, LlmResponse } from "./Base";
import { GoogleGenAI } from "@google/genai";

export class Gemini implements BaseLlm {
  static instance: Gemini;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Gemini();
    }
    return this.instance;
  }

  async chat(model: string, message: Messages): Promise<LlmResponse> {
    const response = await this.ai.models.generateContent({
      model,
      contents: message.map((msg) => ({
        text: msg.content,
        role: msg.role,
      })),
    });
    return {
      completions: {
        choices: [
          {
            message: {
              content: response.text!,
            },
          },
        ],
      },
    };
  }
}
