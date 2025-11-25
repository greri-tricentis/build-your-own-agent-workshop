import { describe, it, expect, vi } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";

describe("Agent", () => {

  it("displays single turn conversation", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("Hello, Agent!")
      .mockResolvedValueOnce("");
    const displaySpy: Display = vi.fn();
    const languageModel: LanguageModel = vi.fn().mockResolvedValue({
      role: "assistant",
      content: "Hello there!"
    });

    await agent(inputStub, displaySpy, languageModel);

    expect(displaySpy).toHaveBeenNthCalledWith(1, "User: Hello, Agent!");
    expect(displaySpy).toHaveBeenNthCalledWith(2, "Agent: Hello there!");
  });

  it("sends conversation context to llm across multiple turns", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("Hello, Agent!")
      .mockResolvedValueOnce("I have another message for you!")
      .mockResolvedValueOnce("");
    const languageModel: LanguageModel = vi.fn().mockImplementation(async (messages: Message[]) => {
      const userMessage = messages[messages.length - 1];
      return {
        role: "assistant",
        content: `You said: "${userMessage.content}"`
      };
    });

    await agent(inputStub, vi.fn(), languageModel);

    expect(languageModel).toHaveBeenLastCalledWith([
      { role: "user", content: "Hello, Agent!" },
      { role: "assistant", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "assistant", content: "You said: \"I have another message for you!\"" }
    ]);
  });
});


