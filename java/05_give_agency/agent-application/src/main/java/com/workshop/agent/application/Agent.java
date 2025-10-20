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
        context.add(new Message("system", "Always answer with a bash command using the syntax: <bash>command</bash>. " +
                "For example: send <bash>ls -la</bash> to list all files. " +
                "Send <bash>pwd</bash> to print the working directory. " +
                "Only ever respond with a single bash command, and no other text."));

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
