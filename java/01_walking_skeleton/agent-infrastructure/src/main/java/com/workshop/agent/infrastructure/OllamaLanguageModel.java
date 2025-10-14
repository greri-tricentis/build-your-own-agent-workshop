package com.workshop.agent.infrastructure;

import com.workshop.agent.application.LanguageModel;
import com.workshop.agent.application.Message;

import java.util.List;

public class OllamaLanguageModel implements LanguageModel {
    public OllamaLanguageModel(String baseUrl, String model) {
    }

    @Override
    public Message prompt(List<Message> message) {
        return null;
    }
}
