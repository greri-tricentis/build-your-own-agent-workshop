import { describe, it, expect, afterEach } from "vitest";
import { agent, Display, Input, LanguageModel, Message } from "./agent";
import _ from "lodash";

describe("Agent", () => {
  
  it("displays message from user, sends user input to llm and displays its answer", async () => {
    inputs = ["Hello, Agent!"];

    await agent(inputStub, displaySpy, languageModelStub);
    
    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: Hi there! Yes, you are right!\n"
    );
  });
  
  it.skip("displays ongoing chat", async () => {
    inputs = ["Hello, Agent!"];

    await agent(inputStub, displaySpy, languageModelStub);
    
    expect(textOnDisplay).toBe(
      "User: Hello, Agent!\n" +
      "Agent: Hi there! Yes, you are right!\n"
    );
  });

  let inputs: string[] = [];
  const inputStub: Input = () => {
    return inputs.shift()!;
  };
  
  const languageModelStub: LanguageModel = async (messages: Message[]) => {
    if (_.isEqual(messages[0], { role: "user", content: "Hello, Agent!" })) {
      return { role: "agent", content: "Hi there! Yes, you are right!" };
    }
    
    throw new Error("Unexpected input to language model");
  }
  
  let textOnDisplay = "";
  afterEach(() => {
    textOnDisplay = "";
  });
  const displaySpy: Display = (text: string) => {
    textOnDisplay += text + "\n";
  };
});


