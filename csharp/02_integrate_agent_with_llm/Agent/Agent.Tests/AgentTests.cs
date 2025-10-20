using Agent.Application;
using DevLab.JmesPath.Functions;

namespace Agent.Tests;

public class AgentTests
{
    [Test]
    public void UserInput_Shown_On_Display()
    {
        IUserInput input = new InputStub("Hello, Agent!");
        IDisplay display = new DisplayStub();
        ILanguageModel model = new LanguageModelSpy();
        var agent = new Application.Agent(input, display, model);

        agent.Run();

        var textOnDisplay = ((DisplayStub)display).Content;
        Assert.That(textOnDisplay, Does.StartWith("User: Hello, Agent!\n"));
    }

    [Test]
    public void UserInput_Sent_To_Model()
    {
        IUserInput input = new InputStub("Hello, Agent!");
        IDisplay display = new DisplayStub();
        ILanguageModel model = new LanguageModelSpy();
        var agent = new Application.Agent(input, display, model);

        agent.Run();

        List<Message> prompts = ((LanguageModelSpy)model).CapturedPrompts;
        Assert.That(prompts, Is.EqualTo(
            new List<Message>
            {
                new("user", "Hello, Agent!")
            }
        ));
    }

    [Test]
    public void LanguageModelResponse_Shown_On_Display()
    {
        IUserInput input = new InputStub("Hello, Agent!");
        IDisplay display = new DisplayStub();
        ILanguageModel model = new LanguageModelStub("Hello, what can I do for you, today!");
        var agent = new Application.Agent(input, display, model);

        agent.Run();

        var textOnDisplay = ((DisplayStub)display).Content;
        Assert.That(textOnDisplay, Is.EqualTo(
            "User: Hello, Agent!\n" +
            "Assistant: Hello, what can I do for you, today!\n"
        ));
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

public class InputStub(string message) : IUserInput
{
    public string GetInput()
    {
        return message;
    }
}