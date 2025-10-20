using Agent.Application;

namespace Agent.Tests;

public class AgentTests
{
    [Test]
    public void UserInput_Shown_On_Display()
    {
        var input = new InputStub(["Hello, Agent!", ""]);
        var model = new LanguageModelSpy();
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, display);

        agent.Run();

        Assert.That(display.Content, Does.StartWith("User: Hello, Agent!\n"));
    }

    [Test]
    public void UserInput_Sent_To_Model()
    {
        var input = new InputStub(["Hello, Agent!", ""]);
        var model = new LanguageModelSpy();
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, display);

        agent.Run();

        Assert.That(model.CapturedPrompts, Does.Contain(
                new List<Message> {new("user", "Hello, Agent!")}
        ));
    }

    [Test]
    public void LanguageModelResponse_Shown_On_Display()
    {
        var input = new InputStub(["Hello, Agent!", ""]);
        var model = new LanguageModelStub("Hello, what can I do for you, today!");
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, display);

        agent.Run();

        Assert.That(display.Content, Does.StartWith(
            "User: Hello, Agent!\n" +
            "Assistant: Hello, what can I do for you, today!\n"
        ));
    }
    
    [Test]
    public void Displays_Back_And_Forth_Chat()
    {
        var input = new InputStub(["Hello, Agent!", "I have another Message for you.", ""]);
        var model = new RepeatingLanguageModel();
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, display);

        agent.Run();

        Assert.That(display.Content, Is.EqualTo(
            "User: Hello, Agent!\n" +
            "Assistant: You said: \"Hello, Agent!\"\n" +
            "User: I have another Message for you.\n" +
            "Assistant: You said: \"I have another Message for you.\"\n"
        ));
    }
    
    [Test]
    public void Sends_Whole_Context_To_Model()
    {
        var input = new InputStub(["Hello, Agent!", "I have another Message for you.", ""]);
        var model = new LanguageModelSpy();
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, display);

        agent.Run();

        Assert.That(model.CapturedPrompts, Is.EqualTo(new List<List<Message>>
        {
            new() { new Message("user", "Hello, Agent!") },
            new()
            {
                new Message("user", "Hello, Agent!"),
                new Message("assistant", "You said: \"Hello, Agent!\""),
                new Message("user", "I have another Message for you."),
            }
        }));
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
    public readonly List<List<Message>> CapturedPrompts = [];

    public Message Prompt(IEnumerable<Message> messages)
    {
        CapturedPrompts.Add(messages.ToList());
        return new Message("assistant", "You said: \"" + messages.Last().Content + "\"");
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