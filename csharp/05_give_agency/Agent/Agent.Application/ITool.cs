namespace Agent.Application;

public interface ITool
{
    string? ParseAndExecute(string command);
}