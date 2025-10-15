import { Message } from "../application/Message.js";

export interface ChatRequest {
  model: string;
  messages: Message[];
}
