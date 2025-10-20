package com.workshop.agent.tests;

import com.workshop.agent.application.*;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public class AgentTests {
    private final UserInput input = new InputStub("Hello, Agent!");
    private final DisplayStub display = new DisplayStub();

    @Test
    public void shows_user_input_on_display() {
        LanguageModel model = new RepeatingLanguageModel();
        Agent agent = new Agent(input, model, display);

        agent.run();

        assertThat(display.content).startsWith("User: Hello, Agent!\n");
    }

    @Test
    public void sends_user_input_to_model() {
        RepeatingLanguageModel model = new RepeatingLanguageModel();
        Agent agent = new Agent(input, model, display);

        agent.run();

        assertThat(model.capturedPrompts).hasSize(1);
        assertThat(model.capturedPrompts.get(0)).containsExactly(
                new Message("user", "Hello, Agent!")
        );
    }

    @Test
    public void shows_model_response_on_display() {
        LanguageModel model = new RepeatingLanguageModel();
        Agent agent = new Agent(input, model, display);

        agent.run();

        assertThat(display.content).isEqualTo(
                """
                        User: Hello, Agent!
                        Assistant: You said: "Hello, Agent!"
                        """
        );
    }
}

class RepeatingLanguageModel implements LanguageModel {
    public final List<List<Message>> capturedPrompts = new ArrayList<>();

    @Override
    public Message prompt(List<Message> messages) {
        capturedPrompts.add(new ArrayList<>(messages));
        Message lastMessage = messages.get(messages.size() - 1);
        return new Message("assistant", "You said: \"" + lastMessage.content() + "\"");
    }
}

class DisplayStub implements Display {
    public String content = "";

    @Override
    public void show(Message message) {
        String role = message.role();
        String capitalizedRole = Character.toUpperCase(role.charAt(0)) + role.substring(1);
        content += capitalizedRole + ": " + message.content() + "\n";
    }
}

class InputStub implements UserInput {
    private final String message;

    public InputStub(String message) {
        this.message = message;
    }

    @Override
    public String getInput() {
        return message;
    }
}
