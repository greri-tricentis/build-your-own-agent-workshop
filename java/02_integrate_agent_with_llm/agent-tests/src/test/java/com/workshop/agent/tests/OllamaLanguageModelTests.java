package com.workshop.agent.tests;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.workshop.agent.application.LanguageModel;
import com.workshop.agent.application.Message;
import org.junit.jupiter.api.*;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public class OllamaLanguageModelTests {
    private WireMockServer server;

    @BeforeEach
    public void startWireMock() {
        server = new WireMockServer();
        server.start();
    }

    @AfterEach
    public void stopWireMock() {
        server.stop();
    }

    @Test
    public void sends_prompt_to_and_parses_answer_from_model() {
        server.stubFor(post(urlEqualTo("/v1/chat/completions"))
                .withRequestBody(equalToJson("""
                        {
                          "model": "gemma3:1b",
                          "messages": [
                            {
                              "role": "user",
                              "content": "Hello!"
                            }
                          ]
                        }
                        """))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "id": "chatcmpl-220",
                                  "object": "chat.completion",
                                  "created": 1760428830,
                                  "model": "gemma3:1b",
                                  "system_fingerprint": "fp_ollama",
                                  "choices": [
                                    {
                                      "index": 0,
                                      "message": {
                                        "role": "assistant",
                                        "content": "Hello there! How can I help you today? 😊"
                                      },
                                      "finish_reason": "stop"
                                    }
                                  ],
                                  "usage": {
                                    "prompt_tokens": 22,
                                    "completion_tokens": 12,
                                    "total_tokens": 34
                                  }
                                }
                                """)));

        var languageModel = new OllamaLanguageModel(server.baseUrl(), "gemma3:1b");
        var message = new Message("user", "Hello!");

        var response = languageModel.prompt(List.of(message));

        server.verify(postRequestedFor(urlEqualTo("/v1/chat/completions"))
                .withRequestBody(equalToJson("""
                        {
                          "model": "gemma3:1b",
                          "messages": [
                            {
                              "role": "user",
                              "content": "Hello!"
                            }
                          ]
                        }
                        """)));
        assertThat(response).isEqualTo(new Message("user", "Hello there! How can I help you today? 😊"));

    }

    private class OllamaLanguageModel implements LanguageModel {
        public OllamaLanguageModel(String baseUrl, String model) {
        }

        public Message prompt(List<Message> message) {
            return null;
        }
    }
}
