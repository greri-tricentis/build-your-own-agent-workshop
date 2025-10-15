import { describe, it, expect } from "vitest";
import { agent, Display, Input } from "./agent";

describe("Agent", () => {
  let textOnDisplay = "";

  it("displays message from user", () => {
    agent(inputStub, displaySpy);
    expect(textOnDisplay).toBe("User: Hello, Agent!");
  });
  
  it("sends user input to llm and displays its answer", () => {
    agent(inputStub, displaySpy, languageModel);
    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: Hi there! Yes, you are right!"
    );
  });

  const inputStub: Input = () => {
    return "Hello, Agent!"
  };

  const displaySpy: Display = (text: string) => {
    textOnDisplay += text
  };
});


