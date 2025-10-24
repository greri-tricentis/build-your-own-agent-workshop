package com.workshop.agent.infrastructure;

import com.workshop.agent.application.UserInput;

import java.util.Scanner;

public class ConsoleUserInput implements UserInput {
    private final Scanner scanner;

    public ConsoleUserInput() {
        this.scanner = new Scanner(System.in);
    }

    @Override
    public String getInput() {
        System.out.print("> ");
        if (scanner.hasNextLine()) {
            return scanner.nextLine();
        }
        return "";
    }
}