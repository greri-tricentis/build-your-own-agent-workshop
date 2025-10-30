package com.workshop.agent.application;

public record Message(String role, String message) {

    @Override
    public String toString() {
        return this.role() + ": " + this.message();
    }
}
