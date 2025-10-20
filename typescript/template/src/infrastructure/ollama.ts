import { LanguageModel , Message } from "../application/agent";

const createPromptOllama = (serverUrl: string, model: string): LanguageModel => {
  return async (messages: readonly Message[]): Promise<Message> => {
    const url = `${serverUrl}/v1/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const chatResponse = await response.json() as ChatResponse;
    if (!chatResponse.choices || chatResponse.choices.length === 0) {
      throw new Error("No choices returned from the model");
    }
    return chatResponse.choices[0].message;
  };
};

export type ChatResponse = {
  readonly choices: readonly Choice[];
};

export type Choice = {
  readonly message: Message;
};

export const promptOllama = createPromptOllama("http://localhost:11434", "gemma3:1b");