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
        var context = new List<Message>();

        while (true)
        {
            var userInput = _input.GetInput();
            if (string.IsNullOrWhiteSpace(userInput))
            {
                break;
            }
            _display.Show("User: " + userInput);
            context.Add(new Message("user", userInput));
            var answer = _model.Prompt(context);
            context.Add(answer);
            _display.Show("Assistant: " + answer.Content);

        }
    }
}