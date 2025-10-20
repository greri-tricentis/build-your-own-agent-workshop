using System.Text.Json;
using WireMock.Logging;
using WireMock.RequestBuilders;
using WireMock.ResponseBuilders;
using WireMock.Server;

namespace Agent.Tests;

public class OllamaLanguageModelTests
{
    private WireMockServer _server;

    [SetUp]
    public void StartWireMock()
    {
        _server = WireMockServer.Start();
    }

    [TearDown]
    public void StopWireMock()
    {
        _server.Stop();
        _server.Dispose();
    }

    [Test]
    public void SendPromptTo_AndParseAnswer_FromLanguageModel()
    {
        _server.Given(Request.Create()
                .UsingPost()
                .WithPath("/v1/chat/completions")
                .WithBodyAsJson("""
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
            .RespondWith(Response.Create()
                .WithStatusCode(200)
                .WithHeader("Content-Type", "application/json")
                .WithBody("""
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
                          """));
        // var languageModel = new OllamaLanguageModel(_server.Url!, "gemma3:1b");
        // var message = new Message("user", "Hello!");
        //
        // var response = languageModel.Prompt([message]);
        //
        // Assert.That(AllPostRequestsForPath("/v1/chat/completions"), Has.Count.EqualTo(1));
        // Assert.That(FirstActualPostRequestFor("/v1/chat/completions"), Is.EqualTo(new ChatRequest("gemma3:1b", [message])));
        // Assert.That(response, Is.EqualTo(new Message("assistant", "Hello there! How can I help you today? 😊")));
    }

    // private ChatRequest? FirstActualPostRequestFor(string path)
    // {
    //     var requestMessageBody = AllPostRequestsForPath(path).Single().RequestMessage.Body!;
    //     var actualRequest = JsonSerializer.Deserialize<ChatRequest>(requestMessageBody, JsonSerializerOptions);
    //     return actualRequest;
    // }

    private IReadOnlyList<ILogEntry> AllPostRequestsForPath(string path)
    {
        return _server.FindLogEntries(Request.Create().UsingPost().WithPath(path));
    }

    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
}