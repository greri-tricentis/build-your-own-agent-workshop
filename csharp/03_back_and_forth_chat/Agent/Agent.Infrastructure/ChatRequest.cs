using Agent.Application;

namespace Agent.Infrastructure;

public sealed record ChatRequest(string Model, List<Message> Messages)
{
    public override string ToString()
    {
        IEnumerable<string> enumerable = Messages.Select(m => m.ToString());
        var messagesStr = string.Join(", ", enumerable);
        return $"ChatRequest {{ model = {Model}, messages = [{messagesStr}] }}";
    }

    public bool Equals(ChatRequest? other)
    {
        if (ReferenceEquals(this, other)) return true;
        if (other is null) return false;

        return Model == other.Model && Messages.SequenceEqual(other.Messages);
    }

    public override int GetHashCode()
    {
        var hash = new HashCode();
        hash.Add(Model);
        foreach (var m in Messages) hash.Add(m);
        return hash.ToHashCode();
    }
}