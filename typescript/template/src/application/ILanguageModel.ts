import { Message } from "./Message.js";

export interface ILanguageModel {
  prompt(messages: Message[]): Promise<Message>;
}
