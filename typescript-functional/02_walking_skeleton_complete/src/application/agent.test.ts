import { describe, it, expect } from "vitest";

describe("Agent", () => {
  let textOnDisplay = "";

  it("displays message from user", () => {
    agent(inputStub, displaySpy);
    expect(textOnDisplay).toBe("User: Hello, Agent!");
  });
  
  type Input = () => string;
  type Display = (text: string) => void;
  type Agent = (input: Input, display: Display) => void;

  const agent: Agent = (input: Input, display: Display) => {
    const message = input();
    display(`User: ${message}`);
  };

  const inputStub: Input = () => {
    return "Hello, Agent!"
  };

  const displaySpy: Display = (text: string) => {
    textOnDisplay += text
  };
});


