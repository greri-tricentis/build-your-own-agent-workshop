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
            display.show(answer);
            context.add(answer);

            String toolResult = tool.parseAndExecute(answer.content());
            if (toolResult == null) continue;

            context.add(new Message("user", toolResult));
            Message answerAfterTool = model.prompt(context);
            display.show(answerAfterTool);
            // not yet adding answerAfterTool to context
        }
    }
}
