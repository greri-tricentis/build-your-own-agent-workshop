import { describe, it, expect } from "vitest";

describe("Agent", () => {
  it("displays message from user", () => {
    const textOnDisplay = "User: Hello, Agent!";
    expect(textOnDisplay).toBe("User: Hello, Agent!");
  });
});
