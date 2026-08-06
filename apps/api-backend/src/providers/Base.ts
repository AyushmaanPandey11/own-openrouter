import { Messages } from "../types";

export type LlmResponse = {
  completions: {
    choices: {
      message: {
        content: string;
      };
    }[];
  };
  inputTokenConsumed: number;
  outputTokenConsumed: number;
};

export interface BaseLlm {
  chat(model: string, message: Messages): Promise<LlmResponse>;
}
