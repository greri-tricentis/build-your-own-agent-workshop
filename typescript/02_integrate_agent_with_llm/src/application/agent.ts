export type Input = () => string;
export type Display = (text: string) => void;
export type Agent = (input: Input, languageModel: LanguageModel, display: Display) => void;
export type Message = { role: "user" | "assistant" | "system"; content: string };
export type LanguageModel = (messages: Message[]) => Message;

export const agent: Agent = (input: Input, languageModel: LanguageModel, display: Display) => {
  const message = input();
  display(`User: ${message}`);
  const response = languageModel([{ role: "user", content: message }]);
  display(`Agent: ${response.content}`);
};
