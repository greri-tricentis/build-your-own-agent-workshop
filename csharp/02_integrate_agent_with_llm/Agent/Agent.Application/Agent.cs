namespace Agent.Application;

public class Agent()
{
    private readonly IUserInput _input;
    private readonly IDisplay _display;
    private readonly ILanguageModel _model;

    public Agent(IUserInput input, IDisplay display, ILanguageModel model) : this()
    {
        _input = input;
        _display = display;
        _model = model;
    }

    public void Run()
    {
        var userInput = _input.GetInput();
        _display.Show("User: " + userInput);
        _model.Prompt([new Message("user", userInput)]);
    }
}