package com.workshop.agent.cli;

import com.workshop.agent.application.*;
import com.workshop.agent.application.Tool;
import com.workshop.agent.infrastructure.*;

public class Main {
    public static void main(String[] args) {
        UserInput input = new ConsoleUserInput();
        //LanguageModel model = new RepeatingLanguageModel();
        LanguageModel model = new OllamaLanguageModel("http://localhost:11434", "gemma3:1b");
        Tool tool = new BashTool();
        Display display = new ConsoleDisplay();

        Agent agent = new Agent(input, model, tool, display);

        agent.run();
    }
}