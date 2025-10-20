namespace Agent.Application;

public class Agent()
{
    private readonly IUserInput _input;
    private readonly IDisplay _display;

    public Agent(IUserInput input, IDisplay display, ILanguageModel model) : this()
    {
        _input = input;
        _display = display;
    }

    public void Run()
    {
        var userInput = _input.GetInput();
        _display.Show("User: " + userInput);
    }
}