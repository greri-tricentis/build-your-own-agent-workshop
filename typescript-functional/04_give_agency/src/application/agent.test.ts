import { describe, it, expect, afterEach } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";
import _ from "lodash";

describe("Agent", () => {

  it("displays message from user, sends user input to llm and displays its answer", async () => {
    inputs = ["Hello, Agent!"];

    await agent(inputStub, displaySpy, repeatingLanguageModel);

    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: You said: \"Hello, Agent!\"\n"
    );
  });

  it.skip("displays ongoing chat", async () => {
    inputs = ["Hello, Agent!"];

    await agent(inputStub, displaySpy, repeatingLanguageModel);

    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: Hi there! Yes, you are right!\n"
    );
  });

  let inputs: string[] = [];
  const inputStub: Input = () => {
    return inputs.shift()!;
  };

  const repeatingLanguageModel: LanguageModel = async (messages: Message[]) => {
    const userMessage = messages[messages.length - 1];
    return {
      role: "agent",
      content: `You said: "${userMessage.content}"`
    };
  }

  let textOnDisplay = "";
  afterEach(() => {
    textOnDisplay = "";
  });
  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


