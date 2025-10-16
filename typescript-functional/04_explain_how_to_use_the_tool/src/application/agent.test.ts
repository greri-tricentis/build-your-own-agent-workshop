import { describe, it, expect, afterEach } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";
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
      { role: "user", content: "Hello, Agent!" },
      { role: "agent", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "agent", content: "You said: \"I have another message for you!\"" }
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

  let textOnDisplay = "";
  afterEach(() => {
    textOnDisplay = "";
    promptedMessages = [];
  });
  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


