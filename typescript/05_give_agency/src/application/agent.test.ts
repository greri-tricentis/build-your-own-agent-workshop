import { describe, it, expect, vi } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";

describe("Agent", () => {

  it("displays single turn conversation", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("Hello, Agent!")
      .mockResolvedValueOnce("");
    const displaySpy: Display = vi.fn();
    const languageModel: LanguageModel = vi.fn().mockResolvedValue({
      role: "agent",
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
        role: "agent",
        content: `You said: "${userMessage.content}"`
      };
    });

    await agent(inputStub, vi.fn(), languageModel);

    expect(languageModel).toHaveBeenLastCalledWith([
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.`
      },
      { role: "user", content: "Hello, Agent!" },
      { role: "agent", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "agent", content: "You said: \"I have another message for you!\"" }
    ]);
  });
});


