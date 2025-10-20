import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { LanguageModel } from "../application/agent";

describe("Ollama", () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("sends prompt to chat api and parses response", async () => {
    let capturedRequest: any = null;
    server.use(
      http.post("http://localhost:11434/v1/chat/completions", async ({ request }) => {
        capturedRequest = await request.json();
        return HttpResponse.json({
          id: "chatcmpl-220",
          object: "chat.completion",
          created: 1760428830,
          model: "gemma3:1b",
          system_fingerprint: "fp_ollama",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "Hello there! How can I help you today? 😊", },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 22,
            completion_tokens: 12,
            total_tokens: 34,
          },
        });
      })
    );

    const promptOllama: LanguageModel = (messages) => {
      throw new Error("Not implemented");
    };
    const response = await promptOllama([{ role: "user", content: "Hello!" }]);

    expect(capturedRequest).toEqual({
      model: "gemma3:1b",
      messages: [
        { role: "user", content: "Hello!" },
      ],
    });
    expect(response).toEqual({
      role: "assistant",
      content: "Hello there! How can I help you today? 😊",
    });
  });
});
