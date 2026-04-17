import { Messages } from "../types";

export type LlmResponse = {
  completions: {
    choices: {
      message: {
        content: String;
      };
    }[];
  };
};

export interface BaseLlm {
  chat(model: string, message: Messages): Promise<LlmResponse>;
}
