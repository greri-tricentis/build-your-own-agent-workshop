using Agent.Infrastructure;
using AgentLoop = Agent.Application.Agent;

var input = new ConsoleUserInput();
var model = new RepeatingLanguageModel();
//var model = new OllamaLanguageModel("http://localhost:11434", "gemma3:1b");
var display = new ConsoleDisplay();

var agent = new AgentLoop(input, model, display);

agent.Run();