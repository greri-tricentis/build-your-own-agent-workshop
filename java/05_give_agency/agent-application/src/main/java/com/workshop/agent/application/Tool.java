package com.workshop.agent.application;

import java.util.Optional;

public interface Tool {
    Optional<String> parseAndExecute(String command);
}