export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel) => Promise<void>;
export type Message = { role: "user" | "agent" | "system" ; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel) => {
  let context = [{ role: "system", 
    content: `Always answer with a bash command using the syntax: <bash>command</bash>. 
For example: send <bash>ls -la</bash> to list all files. 
Send <bash>pwd</bash> to print the working directory. 
Only ever respond with a single bash command, and no other text.`
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
