using Agent.Application;

namespace Agent.Tests;

public class AgentTests
{
    private readonly IUserInput _input = new InputStub(["Hello, Agent!"]);
    private DisplayStub _display = new();
    
    [SetUp]
    public void InitializeDisplay() {
        _display = new DisplayStub();
    }

    [Test]
    public void UserInput_Shown_On_Display()
    {
        ILanguageModel model = new LanguageModelSpy();
        var agent = new Application.Agent(_input, model, _display);

        agent.Run();

        Assert.That(_display.Content, Does.StartWith("User: Hello, Agent!\n"));
    }

    [Test]
    public void UserInput_Sent_To_Model()
    {
        var model = new LanguageModelSpy();
        var agent = new Application.Agent(_input, model, _display);

        agent.Run();

        Assert.That(model.CapturedPrompts, Does.Contain(
                new Message("user", "Hello, Agent!")
        ));
    }

    [Test]
    public void LanguageModelResponse_Shown_On_Display()
    {
        ILanguageModel model = new LanguageModelStub("Hello, what can I do for you, today!");
        var agent = new Application.Agent(_input, model, _display);

        agent.Run();

        Assert.That(_display.Content, Does.StartWith(
            "User: Hello, Agent!\n" +
            "Assistant: Hello, what can I do for you, today!\n"
        ));
    }
    
    [Test]
    public void Displays_Back_And_Forth_Chat()
    {
        InputStub input = new(["Hello, Agent!", "I have another Message for you."]);
        ILanguageModel model = new RepeatingLanguageModel();
        var agent = new Application.Agent(input, model, _display);

        agent.Run();

        Assert.That(_display.Content, Is.EqualTo(
            "User: Hello, Agent!\n" +
            "Assistant: You said: \"Hello, Agent!\"\n" +
            "User: I have another Message for you.\n" +
            "Assistant: You said: \"I have another Message for you.\"\n"
        ));
    }
}

public class RepeatingLanguageModel : ILanguageModel
{
    public Message Prompt(IEnumerable<Message> messages)
    {
        return new Message("assistant", "You said: \"" + messages.Last().Content + "\"");
    }
}

public class LanguageModelStub(string message) : ILanguageModel
{
    public Message Prompt(IEnumerable<Message> messages)
    {
        return new Message("assistant", message);
    }
}

public class LanguageModelSpy : ILanguageModel
{
    public readonly List<Message> CapturedPrompts = [];

    public Message Prompt(IEnumerable<Message> messages)
    {
        CapturedPrompts.AddRange(messages);
        return new Message("assistant", "Stub response");
    }
}

public class DisplayStub : IDisplay
{
    public string Content = "";

    public void Show(string text)
    {
        Content += text + "\n";
    }
}

public class InputStub(List<string> message) : IUserInput
{
    public string GetInput()
    {
        var first = message.First();
        if (message.Count > 1)
        {
            message.RemoveAt(0);
        }

        return first;
    }
}