package com.workshop.agent.application;

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
        String userInput = input.getInput();
        Message userMessage = new Message("user", userInput);
        display.show(userMessage);
        Message answer = model.prompt(List.of(userMessage));
        display.show(answer);
    }
}
