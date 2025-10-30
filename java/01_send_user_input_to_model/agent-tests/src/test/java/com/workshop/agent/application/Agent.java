package com.workshop.agent.application;

public class Agent {
    private final UserInput input;
    private final Display display;

    public Agent(UserInput input, Display display) {
        this.input = input;
        this.display = display;
    }

    public void run() {
        Message userMessage = input.read();
        display.show(userMessage.toString());
    }

}
