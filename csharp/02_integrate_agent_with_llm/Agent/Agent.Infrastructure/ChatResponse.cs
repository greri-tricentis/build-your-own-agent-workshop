using Agent.Application;

namespace Agent.Infrastructure;

public record ChatCompletionResponse(List<Choice> Choices);

public record Choice(Message Message);