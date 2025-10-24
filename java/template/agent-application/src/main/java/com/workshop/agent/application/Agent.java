package com.workshop.agent.application;

import java.util.ArrayList;
import java.util.List;

public class Agent {
    private final String systemPrompt;
    private final UserInput input;
    private final Display display;
    private final LanguageModel model;
    private final Tool tool;

    public Agent(String systemPrompt, UserInput input, LanguageModel model, Tool tool, Display display) {
        this.systemPrompt = systemPrompt;
        this.input = input;
        this.display = display;
        this.model = model;
        this.tool = tool;
    }

    public void run() {
        List<Message> context = new ArrayList<>();
        context.add(new Message("system", systemPrompt));

        while (true) {
            String userInput = input.getInput();
            if (userInput == null || userInput.isBlank()) {
                break;
            }
            Message userMessage = new Message("user", userInput);
            display.show(userMessage);
            context.add(userMessage);

            Message answer = model.prompt(context);
            display.show(answer);
            context.add(answer);

            while (true) {
                var toolResult = tool.parseAndExecute(answer.content());
                if (toolResult.isEmpty()) {
                    break;
                }

                Message toolResultMessage = new Message("user", toolResult.get());
                context.add(toolResultMessage);
                display.show(toolResultMessage);
                answer = model.prompt(context);
                display.show(answer);
                context.add(answer);
            }
        }
    }
}
