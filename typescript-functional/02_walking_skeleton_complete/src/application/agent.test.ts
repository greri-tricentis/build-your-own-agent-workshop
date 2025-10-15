import { describe, it, expect } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";

describe("Agent", () => {
  let textOnDisplay = "";

  it("displays message from user, sends user input to llm and displays its answer", () => {
    agent(inputStub, displaySpy, languageModelStub);
    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: Hi there! Yes, you are right!\n"
    );
  });

  const languageModelStub: LanguageModel = (messages: Message[]) => {
    return { role: "agent", content: "Hi there! Yes, you are right!" };
  }

  const inputStub: Input = () => {
    return "Hello, Agent!"
  };

  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


