export type Input = () => Promise<string>;
export type Display = (text: string) => void;
export type Agent = (input: Input, display: Display, languageModel: LanguageModel, tool?: Tool) => Promise<void>;
export type Message = { role: "user" | "agent" | "system"; content: string };
export type LanguageModel = (messages: Message[]) => Promise<Message>;
export type Tool = (message: string) => Promise<string> | undefined;

export const agent: Agent = async (input: Input, display: Display, languageModel: LanguageModel, tool: Tool = () => undefined) => {
  let context = [{
    role: "system",
    content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.`
  }] as Message[];

  while (true) {
    const message = await input();
    if (message.trim() === "") {
      break;
    }

    let response = await promptLanguageModelAndRecordResponse(message);

    while (true) {
      let toolResult = await tool(response.content);
      if (!toolResult) {
        break;
      }
      response = await promptLanguageModelAndRecordResponse(toolResult);
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
