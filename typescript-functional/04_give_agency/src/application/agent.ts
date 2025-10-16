export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel, tool?: Tool) => Promise<void>;
export type Message = { role: "user" | "agent" | "system" ; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;
export type Tool = (message: string) => Promise<string> | undefined;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel, tool: Tool = () => undefined) => {
  let context = [] as Message[];
  while(true) {
    const message = await input();
    if (message.trim() === "") {
      break;
    }
    display(`User: ${message}`);
    context.push({ role: "user", content: message });
    const response = await languageModel(context);
    display(`Agent: ${response.content}`);
    context.push(response);
    let toolResult = await tool(response.content);
    if(toolResult) {
      display(`User: ${toolResult}`);
      context.push({ role: "user", content: toolResult });  
      const response = await languageModel(context);
      display(`Agent: ${response.content}`);
      context.push(response);
    }
  }
}
