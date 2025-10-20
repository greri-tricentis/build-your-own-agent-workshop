using Agent.Infrastructure;
using AgentLoop = Agent.Application.Agent;

var input = new ConsoleUserInput();
var model = new RepeatingLanguageModel();
//var model = new OllamaLanguageModel("http://localhost:11434", "gemma3:1b");
var tool = new BashTool();
var display = new ConsoleDisplay();

var agent = new AgentLoop(input, model, tool, display);

agent.Run();