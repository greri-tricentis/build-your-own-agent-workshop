import { describe, it, expect } from "vitest";

describe("Agent", () => {
  let textOnDisplay = "";

  it("displays message from user", () => {
    const message = input();
    display(`User: ${message}`);
    expect(textOnDisplay).toBe("User: Hello, Agent!");
  });
  
  type Input = () => string;
  type Display = (text: string) => void;
  
  const input: Input = () => {
    return "Hello, Agent!"
  };


  const display: Display = (text: string) => {
    textOnDisplay += text
  };
});


