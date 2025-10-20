namespace Agent.Application;

public interface ILanguageModel
{
    Message Prompt(IEnumerable<Message> messages);
}