export type Input = () => string;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel) => void;
export type Message = { role: "user" | "agent" | "system" ; content: string };
export type LanguageModel = (messages: Message[]) => Message;

export const agent: Agent = (input: Input, display: Display, languageModel: LanguageModel) => {
  const message = input();
  display(`User: ${message}`);
  const response = languageModel([{ role: "user", content: message }]);
  display(`Agent: ${response.content}`);
};
