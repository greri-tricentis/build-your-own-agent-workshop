package com.workshop.agent.cli;

import com.workshop.agent.application.*;
import com.workshop.agent.application.Tool;
import com.workshop.agent.infrastructure.*;

public class Main {
    public static void main(String[] args) {
        UserInput input = new ConsoleUserInput();
        LanguageModel model = new RepeatingLanguageModel();
        //LanguageModel model = new OllamaLanguageModel("http://localhost:11434", "gemma3:1b");
        Tool tool = new BashTool();
        Display display = new ConsoleDisplay();
        String systemPrompt = "You are a helpful assistant with access to the bash cli. " +
                "Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. " +
                "For example: send <bash>pwd</bash> to print the current working directory. " +
                "It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text.";
        Agent agent = new Agent(systemPrompt, input, model, /*tool,*/ display);

        agent.run();
    }
}