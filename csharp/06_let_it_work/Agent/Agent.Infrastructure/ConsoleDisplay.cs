using Agent.Application;

namespace Agent.Infrastructure;

public class ConsoleDisplay : IDisplay
{
    public void Show(Message message)
    {
        var role = char.ToUpper(message.Role[0]) + message.Role.Substring(1);
        Console.WriteLine($"{role}: {message.Content}");
    }
}
