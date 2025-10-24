namespace Agent.Application;

public class Agent()
{
    private readonly string _systemPrompt;
    private readonly IUserInput _input;
    private readonly IDisplay _display;
    private readonly ILanguageModel _model;
    private readonly ITool _tool;

    public Agent(string systemPrompt, IUserInput input, ILanguageModel model, ITool tool, IDisplay display) : this()
    {
        _systemPrompt = systemPrompt;
        _input = input;
        _display = display;
        _model = model;
        _tool = tool;
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
            _display.Show(answer);
            context.Add(answer);

            while (true)
            {
                var toolResult = _tool.ParseAndExecute(answer.Content);
                if (toolResult == null)
                {
                    break;
                }

                var toolResultMessage = new Message("user", toolResult);
                context.Add(toolResultMessage);
                _display.Show(toolResultMessage);
                answer = _model.Prompt(context);
                _display.Show(answer);
                context.Add(answer);
            }
        }
    }
}