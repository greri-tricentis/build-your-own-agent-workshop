using Agent.Application;

namespace Agent.Tests;

public class AgentTests
{
    [Test]
    public void Test1()
    {
        IUserInput input = new InputStub("Hello, Agent!");
        IDisplay display = new DisplayStub();
        var agent = new Application.Agent(input, display);

        agent.Run();

        var textOnDisplay = ((DisplayStub)display).Content;
        Assert.That(textOnDisplay, Is.EqualTo("User: Hello, Agent!\n"));
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