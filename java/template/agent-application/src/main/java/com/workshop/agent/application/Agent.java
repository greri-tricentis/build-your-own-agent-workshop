package com.workshop.agent.application;

import java.util.ArrayList;
import java.util.List;

public class Agent {
    private final UserInput input;
    private final Display display;
    private final LanguageModel model;
    private final Tool tool;

    public Agent(UserInput input, LanguageModel model, Tool tool, Display display) {
        this.input = input;
        this.display = display;
        this.model = model;
        this.tool = tool;
    }

    public void run() {
        List<Message> context = new ArrayList<>();
        context.add(new Message("system", "Always answer with a bash tool call using the syntax: <bash>command</bash>. " +
                "For example: send <bash>ls -la</bash> to list all files. " +
                "Send <bash>pwd</bash> to print the working directory. " +
                "Only ever respond with a single bash tool call, and no other text."));

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
