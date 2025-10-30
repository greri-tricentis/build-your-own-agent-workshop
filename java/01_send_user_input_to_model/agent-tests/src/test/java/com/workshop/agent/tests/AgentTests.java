package com.workshop.agent.tests;

import com.workshop.agent.application.Agent;
import com.workshop.agent.application.UserInput;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;

public class AgentTests {
    //1. walking skeleton, where user inputs a message, and the llm responds with the message


    //1.2 send the message to the llm, and show the response on the display
    //1.3 integrate with a real llm (ollama)

    @Test
    public void user_input_shown_on_display() {
        //user needs to be able to input the message to the Agent, and then it is shown on the display
        DisplaySpy display = new DisplaySpy();
        UserInput input = new InputStub("Hello Agent!");
        Agent agent = new Agent(input, display);

        agent.run();

        assertThat(display.content).isEqualTo("user: Hello Agent!");
    }
}
