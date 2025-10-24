using System.Diagnostics;
using System.Text.RegularExpressions;
using Agent.Application;

namespace Agent.Infrastructure;

public class BashTool : ITool
{
    private static readonly Regex BashCommandRegex = new("<bash>(.*?)</bash>", RegexOptions.Compiled);

    public string? ParseAndExecute(string command)
    {
        var match = BashCommandRegex.Match(command);
        if (!match.Success)
        {
            return null;
        }

        var bashCommand = match.Groups[1].Value;
        return ExecuteBashCommand(bashCommand);
    }

    private static string ExecuteBashCommand(string command)
    {
        try
        {
            var processStartInfo = new ProcessStartInfo
            {
                FileName = OperatingSystem.IsWindows() ? "cmd.exe" : "/bin/bash",
                Arguments = OperatingSystem.IsWindows() ? $"/c {command}" : $"-c \"{command}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(processStartInfo);
            if (process == null)
            {
                return "Error: Failed to start process";
            }

            var output = process.StandardOutput.ReadToEnd();
            var error = process.StandardError.ReadToEnd();
            process.WaitForExit();

            return string.IsNullOrWhiteSpace(error) ? output : $"{output}\nError: {error}";
        }
        catch (Exception ex)
        {
            return $"Error executing command: {ex.Message}";
        }
    }
}
