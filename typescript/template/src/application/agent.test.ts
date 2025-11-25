import { describe, it, expect, vi } from "vitest";
import { agent, Display, Input, LanguageModel, Message, Tool } from "./agent";

describe("Agent", () => {

  it("displays message from user, sends user input to llm and displays its answer", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("Hello, Agent!")
      .mockResolvedValueOnce("");
    const displaySpy: Display = vi.fn();
    const languageModel: LanguageModel = vi.fn().mockImplementation(async (messages: Message[]) => {
      const userMessage = messages[messages.length - 1];
      return {
        role: "agent",
        content: `You said: "${userMessage.content}"`
      };
    });

    await agent(inputStub, displaySpy, languageModel);

    expect(displaySpy).toHaveBeenNthCalledWith(1, "User: Hello, Agent!");
    expect(displaySpy).toHaveBeenNthCalledWith(2, "Agent: You said: \"Hello, Agent!\"");
  });

  it("displays ongoing chat, and sends whole context to llm", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("Hello, Agent!")
      .mockResolvedValueOnce("I have another message for you!")
      .mockResolvedValueOnce("");
    const displaySpy: Display = vi.fn();
    const languageModel: LanguageModel = vi.fn().mockImplementation(async (messages: Message[]) => {
      const userMessage = messages[messages.length - 1];
      return {
        role: "agent",
        content: `You said: "${userMessage.content}"`
      };
    });

    await agent(inputStub, displaySpy, languageModel);

    expect(displaySpy).toHaveBeenNthCalledWith(1, "User: Hello, Agent!");
    expect(displaySpy).toHaveBeenNthCalledWith(2, "Agent: You said: \"Hello, Agent!\"");
    expect(displaySpy).toHaveBeenNthCalledWith(3, "User: I have another message for you!");
    expect(displaySpy).toHaveBeenNthCalledWith(4, "Agent: You said: \"I have another message for you!\"");
    expect(languageModel).toHaveBeenLastCalledWith([
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.` },
      { role: "user", content: "Hello, Agent!" },
      { role: "agent", content: "You said: \"Hello, Agent!\"" },
      { role: "user", content: "I have another message for you!" },
      { role: "agent", content: "You said: \"I have another message for you!\"" }
    ]);
  });

  it("parses tool call and runs it, and reports result to agent", async () => {
    const inputStub: Input = vi.fn()
      .mockResolvedValueOnce("What's the free disk space on my computer?")
      .mockResolvedValueOnce("");
    const displaySpy: Display = vi.fn();
    const languageModel: LanguageModel = vi.fn()
      .mockResolvedValueOnce({ role: "agent", content: "<bash>df -h</bash>" })
      .mockResolvedValueOnce({ role: "agent", content: "<bash>echo \"You have 44GB of free disk space available.\"</bash>" })
      .mockResolvedValueOnce({ role: "agent", content: "Done checking disk space." });
    const toolStub: Tool = vi.fn().mockImplementation((message: string) => {
      if (message === "<bash>df -h</bash>") {
        return Promise.resolve("Avail 44G");
      }
      if (message === "<bash>echo \"You have 44GB of free disk space available.\"</bash>") {
        return Promise.resolve("You have 44GB of free disk space available.");
      }
      return undefined;
    });

    await agent(inputStub, displaySpy, languageModel, toolStub);

    expect(displaySpy).toHaveBeenNthCalledWith(1, "User: What's the free disk space on my computer?");
    expect(displaySpy).toHaveBeenNthCalledWith(2, "Agent: <bash>df -h</bash>");
    expect(displaySpy).toHaveBeenNthCalledWith(3, "User: Avail 44G");
    expect(displaySpy).toHaveBeenNthCalledWith(4, "Agent: <bash>echo \"You have 44GB of free disk space available.\"</bash>");
    expect(displaySpy).toHaveBeenNthCalledWith(5, "User: You have 44GB of free disk space available.");
    expect(displaySpy).toHaveBeenNthCalledWith(6, "Agent: Done checking disk space.");
    expect(languageModel).toHaveBeenLastCalledWith([
      {
        role: "system", content: `You are a helpful assistant with access to the bash cli. Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. For example: send <bash>pwd</bash> to print the current working directory. It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.` },
      { role: "user", content: "What's the free disk space on my computer?" },
      { role: "agent", content: "<bash>df -h</bash>" },
      { role: "user", content: "Avail 44G" },
      { role: "agent", content: "<bash>echo \"You have 44GB of free disk space available.\"</bash>" },
      { role: "user", content: "You have 44GB of free disk space available." },
      { role: "agent", content: "Done checking disk space." },
    ]); 
    expect(toolStub).toHaveBeenCalledWith("<bash>df -h</bash>");
    expect(toolStub).toHaveBeenCalledWith("<bash>echo \"You have 44GB of free disk space available.\"</bash>");
    expect(toolStub).toHaveBeenCalledTimes(3);
  });
});


