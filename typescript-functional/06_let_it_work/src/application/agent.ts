export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel, tool?: Tool) => Promise<void>;
export type Message = { role: "user" | "agent" | "system"; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;
export type Tool = (message: string) => Promise<string> | undefined;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel, tool: Tool = () => undefined) => {
  let context = [{
    role: "system",
    content: `Always answer with a bash command using the syntax: <bash>command</bash>. 
For example: send <bash>ls -la</bash> to list all files. 
Send <bash>pwd</bash> to print the working directory. 
Only ever respond with a single bash command, and no other text.`
  }] as Message[];

  while (true) {
    const message = await input();
    if (message.trim() === "") {
      break;
    }
    const response = await promptLanguageModelAndRecordResponse(message);
    let toolResult = await tool(response.content);
    if (toolResult) {
      await promptLanguageModelAndRecordResponse(toolResult);
    }
  }

  async function promptLanguageModelAndRecordResponse(message: string) {
    recordUserMessage(message);
    const response = await languageModel(context);
    recordMessage(response);
    return response;
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
