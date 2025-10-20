using Agent.Application;

namespace Agent.Infrastructure;

public class RepeatingLanguageModel : ILanguageModel
{
    public Message Prompt(IEnumerable<Message> messages)
    {
        var list = messages.ToList();
        return new Message("assistant", "You said: \"" + list.Last().Content + "\"");
    }
}
