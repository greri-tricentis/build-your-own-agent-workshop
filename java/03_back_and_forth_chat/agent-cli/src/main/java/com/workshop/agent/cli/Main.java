package com.workshop.agent.cli;

import com.workshop.agent.application.*;
import com.workshop.agent.infrastructure.ConsoleDisplay;
import com.workshop.agent.infrastructure.ConsoleUserInput;

public class Main {
    public static void main(String[] args) {
        UserInput input = new ConsoleUserInput();
        LanguageModel model = new RepeatingLanguageModel();
        //LanguageModel model = new OllamaLanguageModel("http://localhost:11434", "gemma3:1b");
        Display display = new ConsoleDisplay();

        Agent agent = new Agent(input, model, display);

        agent.run();
    }
}
