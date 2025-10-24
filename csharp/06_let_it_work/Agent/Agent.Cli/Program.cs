using Agent.Infrastructure;
using AgentLoop = Agent.Application.Agent;

var input = new ConsoleUserInput();
var model = new RepeatingLanguageModel();
//var model = new OllamaLanguageModel("http://localhost:11434", "gemma3:1b");
var tool = new BashTool();
var display = new ConsoleDisplay();
const string systemPrompt = "You are a helpful assistant with access to the bash cli. " +
                            "Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. " +
                            "For example: send <bash>pwd</bash> to print the current working directory. " +
                            "It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.";

var agent = new AgentLoop(systemPrompt, input, model, tool, display);

agent.Run();