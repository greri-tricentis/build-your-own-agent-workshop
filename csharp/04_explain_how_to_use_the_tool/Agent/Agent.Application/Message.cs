namespace Agent.Application;

public record Message(string Role, string Content)
{
    public override string ToString()
    {
        return $"Message({Role}, \"{Content}\")";
    }
};