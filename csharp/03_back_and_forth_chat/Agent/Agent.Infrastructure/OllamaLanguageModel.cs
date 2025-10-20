using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Agent.Application;

namespace Agent.Infrastructure;

public class OllamaLanguageModel(string serverUrl, string model) : ILanguageModel
{
    private readonly HttpClient _httpClient = new() { BaseAddress = new Uri(serverUrl) };

    private static readonly JsonSerializerOptions JsonSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public Message Prompt(IEnumerable<Message> messages)
    {
        var httpResponse = _httpClient.PostAsync("/v1/chat/completions",
            JsonContent.Create(
                new ChatRequest(model, messages.ToList()),
                new MediaTypeHeaderValue("application/json"),
                JsonSerializerOptions
            )
        ).GetAwaiter().GetResult();
        
        httpResponse.EnsureSuccessStatusCode();
        
        var chatCompletion = JsonSerializer.Deserialize<ChatCompletionResponse>(
            httpResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult(),
            JsonSerializerOptions
        );

        return chatCompletion?.Choices.FirstOrDefault()?.Message!;
    }
}