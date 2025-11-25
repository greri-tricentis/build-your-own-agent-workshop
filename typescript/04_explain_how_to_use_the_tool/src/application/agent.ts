export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel) => Promise<void>;
export type Message = { role: "user" | "assistant" | "system"; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel) => {
  let context = [] as Message[];
  while (true) {
    const message = await input();
    if (message.trim() === "") {
      break;
    }
    context.push({ role: "user", content: message });
    display(`User: ${message}`);
    const response = await languageModel(context);
    context.push(response);
    display(`Agent: ${response.content}`);
  }
};
