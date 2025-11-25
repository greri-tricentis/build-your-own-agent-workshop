import { describe, it, expect, vi } from "vitest";
import { agent, Display, Input, LanguageModel, Message, Tool } from "./agent";

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
    expect(displaySpy).toHaveBeenNthCalledWith(2, "Assistant: Hello there!");
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
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.`
      },
      { role: "user", content: "Hello, Agent!" },
      { role: "assistant", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "assistant", content: "You said: \"I have another message for you!\"" }
    ]);
  });

  it("executes tool calls and includes results in context", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("What's the free disk space?")
      .mockResolvedValueOnce("");
    const languageModel: LanguageModel = vi.fn()
      .mockResolvedValueOnce({ role: "assistant", content: "<bash>df -h</bash>" })
      .mockResolvedValueOnce({ role: "assistant", content: "Done checking disk space." });
    const toolStub: Tool = vi.fn().mockImplementation((message: string) => {
      if (message === "<bash>df -h</bash>") {
        return Promise.resolve("Avail 44G");
      }
      return undefined;
    });

    await agent(inputStub, vi.fn(), languageModel, toolStub);

    expect(toolStub).toHaveBeenCalledWith("<bash>df -h</bash>");
    expect(languageModel).toHaveBeenLastCalledWith([
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.`
      },
      { role: "user", content: "What's the free disk space?" },
      { role: "assistant", content: "<bash>df -h</bash>" },
      { role: "user", content: "Avail 44G" },
      { role: "assistant", content: "Done checking disk space." }
    ]);
  });
  it("executes multiple tool calls in a loop until completion", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("Check disk space and list files")
      .mockResolvedValueOnce("");

    const languageModel: LanguageModel = vi.fn()
      .mockResolvedValueOnce({ role: "assistant", content: "<bash>df -h</bash>" })
      .mockResolvedValueOnce({ role: "assistant", content: "<bash>ls -la</bash>" })
      .mockResolvedValueOnce({ role: "assistant", content: "Done." });

    const toolStub: Tool = vi.fn()
      .mockResolvedValueOnce("Avail 44G")
      .mockResolvedValueOnce("file1.txt")
      .mockResolvedValueOnce(undefined);

    await agent(inputStub, vi.fn(), languageModel, toolStub);

    expect(toolStub).toHaveBeenNthCalledWith(1, "<bash>df -h</bash>");
    expect(toolStub).toHaveBeenNthCalledWith(2, "<bash>ls -la</bash>");
    expect(toolStub).toHaveBeenNthCalledWith(3, "Done.");
    expect(languageModel).toHaveBeenCalledTimes(3);
  });
});

