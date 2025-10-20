package com.workshop.agent.infrastructure;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workshop.agent.application.LanguageModel;
import com.workshop.agent.application.Message;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class OllamaLanguageModel implements LanguageModel {
    private final String baseUrl;
    private final String model;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OllamaLanguageModel(String baseUrl, String model) {
        this.baseUrl = baseUrl;
        this.model = model;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public Message prompt(List<Message> messages) {
        try {
            ChatCompletionRequest request = new ChatCompletionRequest(model, messages);
            String requestBody = objectMapper.writeValueAsString(request);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Failed to get response from model: " + response.statusCode());
            }

            ChatCompletionResponse chatResponse = objectMapper.readValue(response.body(), ChatCompletionResponse.class);
            String content = chatResponse.choices().get(0).message().content();

            return new Message("assistant", content);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Error calling language model", e);
        }
    }

    private record ChatCompletionRequest(
            String model,
            List<Message> messages
    ) {}

    private record ChatCompletionResponse(
            List<Choice> choices
    ) {}

    private record Choice(
            Message message
    ) {}
}
