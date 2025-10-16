export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel) => Promise<void>;
export type Message = { role: "user" | "agent" | "system" ; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel) => {
  while(true) {
    const message = await input();
    if (message.trim() === "") {
      break;
    }
    display(`User: ${message}`);
    const response = await languageModel([{ role: "user", content: message }]);
    display(`Agent: ${response.content}`);
  }
};
