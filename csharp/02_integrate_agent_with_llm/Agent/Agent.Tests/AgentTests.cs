using Agent.Application;

namespace Agent.Tests;

public class AgentTests
{
    private readonly IUserInput _input = new InputStub("Hello, Agent!");
    private readonly DisplayStub _display = new();

    [Test]
    public void UserInput_Shown_On_Display()
    {
        ILanguageModel model = new RepeatingLanguageModel();
        var agent = new Application.Agent(_input, model, _display);

        agent.Run();

        Assert.That(_display.Content, Does.StartWith("User: Hello, Agent!\n"));
    }

    [Test]
    public void UserInput_Sent_To_Model()
    {
        var model = new RepeatingLanguageModel();
        var agent = new Application.Agent(_input, model, _display);

        agent.Run();

        Assert.That(model.CapturedPrompts, Has.Count.EqualTo(1));
        Assert.That(model.CapturedPrompts[0], Is.EquivalentTo(
            new List<Message>
            {
                new("user", "Hello, Agent!")
            }
        ));
    }

    [Test]
    public void LanguageModelResponse_Shown_On_Display()
    {
        ILanguageModel model = new RepeatingLanguageModel();
        var agent = new Application.Agent(_input, model, _display);

        agent.Run();

        Assert.That(_display.Content, Is.EqualTo(
            "User: Hello, Agent!\n" +
            "Assistant: You said: \"Hello, Agent!\"\n"
        ));
    }
}

public class RepeatingLanguageModel : ILanguageModel
{
    public readonly List<List<Message>> CapturedPrompts = [];

    public Message Prompt(IEnumerable<Message> messages)
    {
        var list = messages.ToList();
        CapturedPrompts.Add(list);
        return new Message("assistant", "You said: \"" + list.Last().Content + "\"");
    }
}

public class DisplayStub : IDisplay
{
    public string Content = "";

    public void Show(Message message)
    {
        Content += $"{char.ToUpper(message.Role[0]) + message.Role.Substring(1)}: {message.Content}\n";
    }
}

public class InputStub(string message) : IUserInput
{
    public string GetInput()
    {
        return message;
    }
}