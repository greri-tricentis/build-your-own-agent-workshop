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
    recordUserMessage(message);
    const response = await languageModel(context);
    recordMessage(response);
    let toolResult = await tool(response.content);
    if(toolResult) {
      recordUserMessage(toolResult);
      const response = await languageModel(context);
      recordMessage(response);
    }
  }

  function recordUserMessage(message: string) {
    recordMessage({ role: "user", content: message });
  }

  function recordMessage(response: Message) {
    const capitalizedRole = response.role.charAt(0).toUpperCase() + response.role.slice(1);
    display(`${capitalizedRole}: ${response.content}`);
    context.push(response);
  }

}
