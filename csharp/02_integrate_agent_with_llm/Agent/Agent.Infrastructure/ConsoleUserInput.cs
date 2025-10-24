using Agent.Application;

namespace Agent.Infrastructure;

public class ConsoleUserInput : IUserInput
{
    public string GetInput()
    {
        Console.Write("> ");
        return Console.ReadLine() ?? string.Empty;
    }
}
