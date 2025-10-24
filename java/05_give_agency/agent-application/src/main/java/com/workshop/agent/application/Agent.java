package com.workshop.agent.application;

import java.util.ArrayList;
import java.util.List;

public class Agent {
    private final UserInput input;
    private final Display display;
    private final LanguageModel model;

    public Agent(UserInput input, LanguageModel model, Display display) {
        this.input = input;
        this.display = display;
        this.model = model;
    }

    public void run() {
        List<Message> context = new ArrayList<>();
        context.add(new Message("system", "You are a helpful assistant with access to the bash cli. " +
                "Run a command using messages like <bash>ls -la</bash>, always wrapping the desired command in the xml tag. " +
                "For example: send <bash>pwd</bash> to print the current working directory. " +
                "It is VERY important that YOU DO wrap your command in the xml tag and do not include any other text."));

        while (true) {
            String userInput = input.getInput();
            if (userInput == null || userInput.isBlank()) {
                break;
            }
            Message userMessage = new Message("user", userInput);
            display.show(userMessage);
            context.add(userMessage);
            Message answer = model.prompt(context);
            context.add(answer);
            display.show(answer);
        }
    }
}
