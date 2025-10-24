namespace Agent.Application;

public class Agent()
{
    private readonly string _systemPrompt;
    private readonly IUserInput _input;
    private readonly IDisplay _display;
    private readonly ILanguageModel _model;

    public Agent(string systemPrompt, IUserInput input, ILanguageModel model, IDisplay display) : this()
    {
        _systemPrompt = systemPrompt;
        _input = input;
        _display = display;
        _model = model;
    }

    public void Run()
    {
        var context = new List<Message>
        {
            new("system", _systemPrompt)
        };

        while (true)
        {
            var userInput = _input.GetInput();
            if (string.IsNullOrWhiteSpace(userInput))
            {
                break;
            }
            var userMessage = new Message("user", userInput);
            _display.Show(userMessage);
            context.Add(userMessage);
            var answer = _model.Prompt(context);
            context.Add(answer);
            _display.Show(answer);

        }
    }
}