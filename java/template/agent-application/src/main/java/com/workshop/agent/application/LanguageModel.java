package com.workshop.agent.application;

import java.util.List;

public interface LanguageModel {
    Message prompt(List<Message> messages);
}
