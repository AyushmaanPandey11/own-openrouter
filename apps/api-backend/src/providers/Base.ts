import { Messages } from "../types";

export type LlmResponse = {
  completions: {
    choices: {
      message: {
        content: String;
      };
    }[];
  };
  inputTokenConsumed: number;
  outputTokenConsumed: number;
};

export interface BaseLlm {
  chat(model: string, message: Messages): Promise<LlmResponse>;
}
