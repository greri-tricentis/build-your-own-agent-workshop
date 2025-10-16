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

  it("displays ongoing chat", async () => {
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
  });

  it("parses tool call and runs it", async () => {
    inputs = ["What's the free disk space on my computer?", ""];
    agentAnswers = ["<bash>df -h</bash>"];

    await agent(inputStub, displaySpy, languageModelStub, toolStub);

    expect(textOnDisplay).toBe(
      "User: What's the free disk space on my computer?\n" +
      "Agent: <bash>df -h</bash>\n" +
      "User: Avail 44G\n"
    );
  });

  let inputs: string[] = [];
  const inputStub: Input = async () => {
    return inputs.shift()!;
  };

  const repeatingLanguageModel: LanguageModel = async (messages: Message[]) => {
    const userMessage = messages[messages.length - 1];
    return {
      role: "agent",
      content: `You said: "${userMessage.content}"`
    };
  }

  let agentAnswers: string[] = [];
  const languageModelStub: LanguageModel = async (messages: Message[]) => {
    const answer = agentAnswers.shift();
    return { role: "agent", content: answer || "" };
  }

  const toolStub: Tool = (message: string) => {
    if(message === "<bash>df -h</bash>") {
      return Promise.resolve("Avail 44G");
    }
    return undefined;
  }

  let textOnDisplay = "";
  afterEach(() => {
    textOnDisplay = "";
  });
  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


