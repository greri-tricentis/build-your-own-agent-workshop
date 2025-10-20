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
        role: "system", content: `Always answer with a bash command using the syntax: <bash>command</bash>. 
For example: send <bash>ls -la</bash> to list all files. 
Send <bash>pwd</bash> to print the working directory. 
Only ever respond with a single bash command, and no other text.` },
      { role: "user", content: "Hello, Agent!" },
      { role: "agent", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "agent", content: "You said: \"I have another message for you!\"" }
    ]);
  });

  it("parses tool call and runs it, and reports result to agent", async () => {
    inputs = [
      "What's the free disk space on my computer?",
      ""
    ];
    agentAnswers = [
      "<bash>df -h</bash>",
      "<bash>echo \"You have 44GB of free disk space available.\"</bash>",
      "Done checking disk space."
    ];

    await agent(inputStub, displaySpy, languageModelStub, toolStub);

    expect(textOnDisplay).toBe(
      "User: What's the free disk space on my computer?\n" +
      "Agent: <bash>df -h</bash>\n" +
      "User: Avail 44G\n" +
      "Agent: <bash>echo \"You have 44GB of free disk space available.\"</bash>\n" +
      "User: You have 44GB of free disk space available.\n" +
      "Agent: Done checking disk space.\n"
    );
    expect(promptedMessages).toEqual([
      {
        role: "system", content: `Always answer with a bash command using the syntax: <bash>command</bash>. 
For example: send <bash>ls -la</bash> to list all files. 
Send <bash>pwd</bash> to print the working directory. 
Only ever respond with a single bash command, and no other text.` },
      { role: "user", content: "What's the free disk space on my computer?" },
      { role: "agent", content: "<bash>df -h</bash>" },
      { role: "user", content: "Avail 44G" },
      { role: "agent", content: "<bash>echo \"You have 44GB of free disk space available.\"</bash>" },
      { role: "user", content: "You have 44GB of free disk space available." },
      { role: "agent", content: "Done checking disk space." },
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
    if (message === "<bash>echo \"You have 44GB of free disk space available.\"</bash>") {
      return Promise.resolve("You have 44GB of free disk space available.");
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


