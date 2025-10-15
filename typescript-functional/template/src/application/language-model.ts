export type Role = "user" | "assistant" | "system";

export type Message = {
  readonly role: Role;
  readonly content: string;
};

export type PromptLanguageModel = (messages: readonly Message[]) => Promise<Message>;

export const createMessage = (role: Role, content: string): Message => ({
  role,
  content,
});