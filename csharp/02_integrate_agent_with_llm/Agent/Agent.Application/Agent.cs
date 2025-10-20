namespace Agent.Application;

public class Agent()
{
    private readonly IUserInput _input;
    private readonly IDisplay _display;
    private readonly ILanguageModel _model;

    public Agent(IUserInput input, ILanguageModel model, IDisplay display) : this()
    {
        _input = input;
        _display = display;
        _model = model;
    }

    public void Run()
    {
        var userInput = _input.GetInput();
        _display.Show("User: " + userInput);
        var message = _model.Prompt([new Message("user", userInput)]);
        _display.Show("Assistant: " + message.Content);
    }
}