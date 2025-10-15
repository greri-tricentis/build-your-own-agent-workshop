import { ILanguageModel } from "../application/ILanguageModel.js";
import { Message } from "../application/Message.js";
import { ChatRequest } from "./ChatRequest.js";
import { ChatResponse } from "./ChatResponse.js";

export class OllamaLanguageModel implements ILanguageModel {
  private serverUrl: string;
  private model: string;

  constructor(serverUrl: string, model: string) {
    this.serverUrl = serverUrl;
    this.model = model;
  }

  async prompt(messages: Message[]): Promise<Message> {
    const request: ChatRequest = {
      model: this.model,
      messages: messages,
    };

    const response = await fetch(`${this.serverUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const chatResponse = await response.json() as ChatResponse;

    if (!chatResponse.choices || chatResponse.choices.length === 0) {
      throw new Error("No choices returned from the model");
    }

    return chatResponse.choices[0].message;
  }
}
