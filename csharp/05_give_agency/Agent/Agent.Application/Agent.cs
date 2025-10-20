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
        var context = new List<Message>
        {
            new("system", "Always answer with a bash command using the syntax: <bash>command</bash>. " +
                          "For example: send <bash>ls -la</bash> to list all files. " +
                          "Send <bash>pwd</bash> to print the working directory. " +
                          "Only ever respond with a single bash command, and no other text.")
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