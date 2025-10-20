package com.workshop.agent.infrastructure;

import com.workshop.agent.application.LanguageModel;
import com.workshop.agent.application.Message;

import java.util.List;

public class RepeatingLanguageModel implements LanguageModel {
    @Override
    public Message prompt(List<Message> messages) {
        Message lastMessage = messages.get(messages.size() - 1);
        return new Message("assistant", "You said: \"" + lastMessage.content() + "\"");
    }
}
