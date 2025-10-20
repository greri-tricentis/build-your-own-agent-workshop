package com.workshop.agent.tests;

import com.workshop.agent.application.*;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
public class AgentTests {
    private final DisplayStub display = new DisplayStub();

    @Test
    public void shows_user_input_on_display() {
        UserInput input = new InputStub("Hello, Agent!", "");
        LanguageModel model = new RepeatingLanguageModel();
        ToolStub tool = new ToolStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(display.content).startsWith("User: Hello, Agent!\n");
    }

    @Test
    public void sends_user_input_to_model() {
        UserInput input = new InputStub("Hello, Agent!", "");
        RepeatingLanguageModel model = new RepeatingLanguageModel();
        ToolStub tool = new ToolStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(model.capturedPrompts).hasSize(1);
        assertThat(model.capturedPrompts.get(0)).containsExactly(
                new Message("system", "Always answer with a bash tool call using the syntax: <bash>command</bash>. " +
                        "For example: send <bash>ls -la</bash> to list all files. " +
                        "Send <bash>pwd</bash> to print the working directory. " +
                        "Only ever respond with a single bash tool call, and no other text."),
                new Message("user", "Hello, Agent!")
        );
    }

    @Test
    public void shows_model_response_on_display() {
        UserInput input = new InputStub("Hello, Agent!", "");
        LanguageModel model = new RepeatingLanguageModel();
        ToolStub tool = new ToolStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(display.content).isEqualTo(
                """
                        User: Hello, Agent!
                        Assistant: You said: "Hello, Agent!"
                        """
        );
    }

    @Test
    public void displays_back_and_forth_chat() {
        UserInput input = new InputStub("Hello, Agent!", "I have another Message for you.", "");
        RepeatingLanguageModel model = new RepeatingLanguageModel();
        DisplayStub display = new DisplayStub();
        ToolStub tool = new ToolStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(display.content).isEqualTo(
                """
                        User: Hello, Agent!
                        Assistant: You said: "Hello, Agent!"
                        User: I have another Message for you.
                        Assistant: You said: "I have another Message for you."
                        """
        );
    }

    @Test
    public void sends_whole_context_to_model() {
        UserInput input = new InputStub("Hello, Agent!", "I have another Message for you.", "");
        RepeatingLanguageModel model = new RepeatingLanguageModel();
        DisplayStub display = new DisplayStub();
        ToolStub tool = new ToolStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(model.capturedPrompts).hasSize(2);
        assertThat(model.capturedPrompts.get(0)).containsExactly(
                new Message("system", "Always answer with a bash tool call using the syntax: <bash>command</bash>. " +
                        "For example: send <bash>ls -la</bash> to list all files. " +
                        "Send <bash>pwd</bash> to print the working directory. " +
                        "Only ever respond with a single bash tool call, and no other text."),
                new Message("user", "Hello, Agent!")
        );
        assertThat(model.capturedPrompts.get(1)).containsExactly(
                new Message("system", "Always answer with a bash tool call using the syntax: <bash>command</bash>. " +
                        "For example: send <bash>ls -la</bash> to list all files. " +
                        "Send <bash>pwd</bash> to print the working directory. " +
                        "Only ever respond with a single bash tool call, and no other text."),
                new Message("user", "Hello, Agent!"),
                new Message("assistant", "You said: \"Hello, Agent!\""),
                new Message("user", "I have another Message for you.")
        );
    }

    @Test
    public void parses_tool_call_runs_it_and_reports_results_back_to_agent() {
        UserInput input = new InputStub("What's the free disk space on my computer?", "");
        LanguageModelStub model = new LanguageModelStub(List.of("<bash>df -h</bash>", "Your free disk space is: 44G"));
        ToolStub tool = new ToolStub(List.of(
                Optional.of("Avail 44G"),
                Optional.empty()
        ));
        DisplayStub display = new DisplayStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(tool.requestedToolCalls).containsExactly("<bash>df -h</bash>", "Your free disk space is: 44G");
        assertThat(model.capturedPrompts.get(1)).containsExactly(
                new Message("system", "Always answer with a bash tool call using the syntax: <bash>command</bash>. " +
                        "For example: send <bash>ls -la</bash> to list all files. " +
                        "Send <bash>pwd</bash> to print the working directory. " +
                        "Only ever respond with a single bash tool call, and no other text."),
                new Message("user", "What's the free disk space on my computer?"),
                new Message("assistant", "<bash>df -h</bash>"),
                new Message("user", "Avail 44G")
        );
        assertThat(display.content).endsWith("Assistant: Your free disk space is: 44G\n");
    }

    @Test
    public void agent_can_execute_multiple_consecutive_tool_calls() {
        UserInput input = new InputStub("List files and show current directory", "");
        LanguageModelStub model = new LanguageModelStub(List.of(
                "<bash>ls</bash>",
                "<bash>pwd</bash>",
                "I found files and the directory is /home/user"
        ));
        List<Optional<String>> toolResults = List.of(
                Optional.of("file1.txt file2.txt"),
                Optional.of("/home/user"),
                Optional.empty()
        );
        ToolStub tool = new ToolStub(toolResults);
        DisplayStub display = new DisplayStub();
        Agent agent = new Agent(input, model, tool, display);

        agent.run();

        assertThat(tool.requestedToolCalls).containsExactly(
                "<bash>ls</bash>",
                "<bash>pwd</bash>",
                "I found files and the directory is /home/user"
        );
        assertThat(model.capturedPrompts).hasSize(3);
        assertThat(model.capturedPrompts.get(2)).contains(new Message("assistant", "<bash>pwd</bash>"));
        assertThat(display.content).endsWith("Assistant: I found files and the directory is /home/user\n");
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
    private final List<String> messages;

    public InputStub(String... messages) {
        this.messages = new ArrayList<>(List.of(messages));
    }

    @Override
    public String getInput() {
        if (messages.isEmpty()) {
            return "";
        }
        return messages.remove(0);
    }
}

class ToolStub implements com.workshop.agent.application.Tool {
    private final List<Optional<String>> results;
    public final List<String> requestedToolCalls = new ArrayList<>();

    public ToolStub() {
        this.results = new ArrayList<>();
        this.results.add(Optional.empty());
    }

    public ToolStub(List<Optional<String>> results) {
        this.results = new ArrayList<>(results);
    }

    @Override
    public Optional<String> parseAndExecute(String command) {
        requestedToolCalls.add(command);
        Optional<String> currentResult = results.get(0);
        if (results.size() > 1) {
            results.remove(0);
        }
        return currentResult;
    }
}

class LanguageModelStub implements LanguageModel {
    private final List<String> answers;
    public final List<List<Message>> capturedPrompts = new ArrayList<>();

    public LanguageModelStub(List<String> answers) {
        this.answers = new ArrayList<>(answers);
    }

    @Override
    public Message prompt(List<Message> messages) {
        capturedPrompts.add(new ArrayList<>(messages));
        String content = answers.get(0);
        if (answers.size() > 1) {
            answers.remove(0);
        }
        return new Message("assistant", content);
    }
}
