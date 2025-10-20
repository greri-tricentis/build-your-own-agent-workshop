package com.workshop.agent.application;

public record Message(String role, String content) {
    @Override
    public String toString() {
        return "Message(" + role + ", \"" + content + "\")";
    }
}
