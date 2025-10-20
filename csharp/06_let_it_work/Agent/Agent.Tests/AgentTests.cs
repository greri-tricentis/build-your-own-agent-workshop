using Agent.Application;

namespace Agent.Tests;

public class AgentTests
{
    [Test]
    public void UserInput_Shown_On_Display()
    {
        var input = new InputStub(["Hello, Agent!", ""]);
        var model = new RepeatingLanguageModel();
        var tool = new ToolStub(null);
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, tool, display);

        agent.Run();

        Assert.That(display.Content, Does.StartWith("User: Hello, Agent!\n"));
    }

    [Test]
    public void UserInput_Sent_To_Model()
    {
        var input = new InputStub(["Hello, Agent!", ""]);
        var model = new RepeatingLanguageModel();
        var tool = new ToolStub(null);
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, tool, display);

        agent.Run();

        Assert.That(model.CapturedPrompts, Does.Contain(
            new List<Message>
            {
                new("system", "Always answer with a bash command using the syntax: <bash>command</bash>. " +
                              "For example: send <bash>ls -la</bash> to list all files. " +
                              "Send <bash>pwd</bash> to print the working directory. " +
                              "Only ever respond with a single bash command, and no other text."),
                new("user", "Hello, Agent!")
            }
        ));
    }

    [Test]
    public void LanguageModelResponse_Shown_On_Display()
    {
        var input = new InputStub(["Hello, Agent!", ""]);
        var model = new RepeatingLanguageModel();
        var tool = new ToolStub(null);
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, tool, display);

        agent.Run();

        Assert.That(display.Content, Does.StartWith(
            "User: Hello, Agent!\n" +
            "Assistant: You said: \"Hello, Agent!\"\n"
        ));
    }

    [Test]
    public void Displays_Back_And_Forth_Chat()
    {
        var input = new InputStub(["Hello, Agent!", "I have another Message for you.", ""]);
        var model = new RepeatingLanguageModel();
        var tool = new ToolStub(null);
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, tool, display);

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
        var model = new RepeatingLanguageModel();
        var tool = new ToolStub(null);
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, tool, display);

        agent.Run();

        Assert.That(model.CapturedPrompts, Is.EquivalentTo(new List<List<Message>>
        {
            new()
            {
                new Message("system", "Always answer with a bash command using the syntax: <bash>command</bash>. " +
                                      "For example: send <bash>ls -la</bash> to list all files. " +
                                      "Send <bash>pwd</bash> to print the working directory. " +
                                      "Only ever respond with a single bash command, and no other text."),
                new Message("user", "Hello, Agent!")
            },
            new()
            {
                new Message("system", "Always answer with a bash command using the syntax: <bash>command</bash>. " +
                                      "For example: send <bash>ls -la</bash> to list all files. " +
                                      "Send <bash>pwd</bash> to print the working directory. " +
                                      "Only ever respond with a single bash command, and no other text."),
                new Message("user", "Hello, Agent!"),
                new Message("assistant", "You said: \"Hello, Agent!\""),
                new Message("user", "I have another Message for you."),
            }
        }));
    }

    [Test]
    public void Parses_ToolCall_RunsIt_And_Reports_Results_Back_To_Agent()
    {
        var input = new InputStub(["What's the free disk space on my computer?", ""]);
        var model = new LanguageModelStub(["<bash>df -h</bash>", "Your free disk space is: 44G"]);
        var tool = new ToolStub("Avail 44G");
        var display = new DisplayStub();
        var agent = new Application.Agent(input, model, tool, display);

        agent.Run();

        Assert.That(tool.ExecutedCommands, Is.EquivalentTo(new List<string> { "<bash>df -h</bash>" }));
        Assert.That(model.CapturedPrompts[1], Is.EquivalentTo(new List<Message>
        {
            new("system", "Always answer with a bash command using the syntax: <bash>command</bash>. " +
                          "For example: send <bash>ls -la</bash> to list all files. " +
                          "Send <bash>pwd</bash> to print the working directory. " +
                          "Only ever respond with a single bash command, and no other text."),
            new("user", "What's the free disk space on my computer?"),
            new("assistant", "<bash>df -h</bash>"),
            new("user", "Avail 44G")
        }));
        Assert.That(display.Content, Does.EndWith("Assistant: Your free disk space is: 44G\n"));
    }
}

public class ToolStub(string? result) : ITool
{
    public readonly List<string> ExecutedCommands = [];

    public string? ParseAndExecute(string command)
    {
        ExecutedCommands.Add(command);
        return result;
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

public class LanguageModelStub(List<string> answer) : ILanguageModel
{
    public readonly List<List<Message>> CapturedPrompts = [];

    public Message Prompt(IEnumerable<Message> messages)
    {
        CapturedPrompts.Add(messages.ToList());
        var content = answer.First();
        if (answer.Count > 1)
        {
            answer.RemoveAt(0);
        }
        return new Message("assistant", content);
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