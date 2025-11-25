import { describe, it, expect, vi } from "vitest";
import { agent, Display, Input, LanguageModel } from "./agent";

describe("Agent", () => {

  it("displays message from user, sends user input to llm and displays its answer", async () => {
    const inputStub: Input = vi.fn().mockReturnValue("Hello, Agent!");
    const displaySpy: Display = vi.fn();
    const languageModel: LanguageModel = vi.fn().mockResolvedValue({
      role: "assistant",
      content: "Hi there! Yes, you are right!"
    });

    await agent(inputStub, displaySpy, languageModel);

    expect(displaySpy).toHaveBeenNthCalledWith(1, "User: Hello, Agent!");
    expect(displaySpy).toHaveBeenNthCalledWith(2, "Agent: Hi there! Yes, you are right!");
    expect(languageModel).toHaveBeenCalledWith([{ role: "user", content: "Hello, Agent!" }]);
  });
});


