using Agent.Application;

namespace Agent.Tests;

public class AgentTests
{
    [Test]
    public void UserInput_Appears_On_Display()
    {
        IUserInput input = new InputStub("Hello, Agent!");
        IDisplay display = new DisplayStub();
        ILanguageModel model = new LanguageModelSpy();
        var agent = new Application.Agent(input, display, model);

        agent.Run();

        var textOnDisplay = ((DisplayStub)display).Content;
        Assert.That(textOnDisplay, Is.EqualTo("User: Hello, Agent!\n"));
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
                new("user", " Hello, Agent!")
            }
        ));
    }
}

public class LanguageModelSpy : ILanguageModel
{
    public readonly List<Message> CapturedPrompts = [];

    public Message Prompt(IEnumerable<Message> messages)
    {
        CapturedPrompts.AddRange(messages);
        return null;
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