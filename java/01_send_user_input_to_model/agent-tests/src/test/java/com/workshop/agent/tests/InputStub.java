package com.workshop.agent.tests;

import com.workshop.agent.application.Message;
import com.workshop.agent.application.UserInput;

public class InputStub implements UserInput {
    private final String fakeInput;

    public InputStub(String fakeInput) {
        this.fakeInput = fakeInput;
    }

    @Override
    public Message read() {
        return new Message("user", fakeInput);
    }
}
