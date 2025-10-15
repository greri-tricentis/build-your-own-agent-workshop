import { Message } from "../application/Message.js";

export interface ChatResponse {
  choices: Choice[];
}

export interface Choice {
  message: Message;
}
