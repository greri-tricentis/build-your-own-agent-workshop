export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel) => Promise<void>;
export type Message = { role: "user" | "agent" | "system" ; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel) => {
  let context = [{ role: "system", content: "You're a bash expert with a bash tool. Use with <bash>{command}</bash> to run the command. For example, send <bash>ls -la</bash> to list files. One command per answer." }] as Message[];  
  while(true) {
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
