import { describe, it, expect } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";
import _ from "lodash";

describe("Agent", () => {
  let textOnDisplay = "";

  it("displays message from user, sends user input to llm and displays its answer", async () => {
    await agent(inputStub, displaySpy, languageModelStub);
    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: Hi there! Yes, you are right!\n"
    );
  });

  const languageModelStub: LanguageModel = async (messages: Message[]) => {
    if (_.isEqual(messages[0], { role: "user", content: "Hello, Agent!" })) {
      return { role: "agent", content: "Hi there! Yes, you are right!" };
    }

    throw new Error("Unexpected input to language model");
  }

  const inputStub: Input = () => {
    return "Hello, Agent!"
  };

  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


