import { describe, it, expect, afterEach } from "vitest";
import { agent, Display, Input, LanguageModel, Message, Tool } from "./agent";
import _ from "lodash";

describe("Agent", () => {

  it("displays message from user, sends user input to llm and displays its answer", async () => {
    inputs = ["Hello, Agent!", ""];

    await agent(inputStub, displaySpy, repeatingLanguageModel);

    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: You said: \"Hello, Agent!\"\n"
    );
  });

  it("displays ongoing chat, and sends whole context to llm", async () => {
    inputs = [
      "Hello, Agent!",
      "I have another message for you!",
      ""
    ];

    await agent(inputStub, displaySpy, repeatingLanguageModel);

    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: You said: \"Hello, Agent!\"\n" +
      "User: I have another message for you!\n" +
      "Agent: You said: \"I have another message for you!\"\n"
    );
    expect(promptedMessages).toEqual([
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.` },
      { role: "user", content: "Hello, Agent!" },
      { role: "agent", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "agent", content: "You said: \"I have another message for you!\"" }
    ]);
  });

  it("parses tool call and runs it, and reports result to agent", async () => {
    inputs = ["What's the free disk space on my computer?", ""];
    agentAnswers = [
      "<bash>df -h</bash>",
      "You have 44GB of free disk space available."
    ];

    await agent(inputStub, displaySpy, languageModelStub, toolStub);

    expect(textOnDisplay).toBe(
      "User: What's the free disk space on my computer?\n" +
      "Agent: <bash>df -h</bash>\n" +
      "User: Avail 44G\n" +
      "Agent: You have 44GB of free disk space available.\n"
    );
    expect(promptedMessages).toEqual([
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.` },
      { role: "user", content: "What's the free disk space on my computer?" },
      { role: "agent", content: "<bash>df -h</bash>" },
      { role: "user", content: "Avail 44G" },
      { role: "agent", content: "You have 44GB of free disk space available." }
    ]);
  });

  let inputs: string[] = [];
  const inputStub: Input = async () => {
    return inputs.shift()!;
  };

  let promptedMessages: Message[] = [];
  const repeatingLanguageModel: LanguageModel = async (messages: Message[]) => {
    promptedMessages = messages;
    const userMessage = messages[messages.length - 1];
    return {
      role: "agent",
      content: `You said: "${userMessage.content}"`
    };
  }

  let agentAnswers: string[] = [];
  const languageModelStub: LanguageModel = async (messages: Message[]) => {
    promptedMessages = messages;
    const answer = agentAnswers.shift();
    return { role: "agent", content: answer || "" };
  }

  const toolStub: Tool = (message: string) => {
    if (message === "<bash>df -h</bash>") {
      return Promise.resolve("Avail 44G");
    }
    return undefined;
  }

  let textOnDisplay = "";
  afterEach(() => {
    textOnDisplay = "";
    promptedMessages = [];
  });
  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


