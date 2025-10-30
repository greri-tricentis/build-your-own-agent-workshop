package com.workshop.agent.tests;

import com.workshop.agent.application.Display;

public class DisplaySpy implements Display {
    public String content;

    @Override
    public void show(String content) {
        this.content = content;
    }
}
