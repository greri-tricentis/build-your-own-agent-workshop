package com.workshop.agent.infrastructure;

import com.workshop.agent.application.Display;
import com.workshop.agent.application.Message;

public class ConsoleDisplay implements Display {
    @Override
    public void show(Message message) {
        String role = message.role();
        String capitalizedRole = Character.toUpperCase(role.charAt(0)) + role.substring(1);
        System.out.println(capitalizedRole + ": " + message.content());
    }
}