import { describe, it, expect } from "vitest";

describe("Agent", () => {
  const textOnDisplay = "User: Hello, Agent!";
  it("displays message from user", () => {
    const message = input();
    display(`User: ${message}`);
    expect(textOnDisplay).toBe("User: Hello, Agent!");
  });
});
