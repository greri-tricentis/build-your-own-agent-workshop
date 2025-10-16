import { agent, LanguageModel, Message } from "./application/agent"
import { createInterface } from "readline/promises"
import { stdin as input, stdout as output } from "node:process"

export async function userInput(): Promise<string> {
  const rl = createInterface({ input, output })
  const answer = await rl.question("> ")
  rl.close()
  return answer
}

const llmStub: LanguageModel = async (messages: Message[]) => {
    const userMessage = messages[messages.length - 1];
    return {
        role: "agent",
        content: `You said: "${userMessage.content}"`
    };
};

async function main() {
    agent(
        userInput,
        (text) => console.log(text),
        llmStub
    );
}

main();
