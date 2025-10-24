export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel) => Promise<void>;
export type Message = { role: "user" | "agent" | "system" ; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel) => {
  let context = [{ role: "system",
    content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.`
  }] as Message[];  
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
