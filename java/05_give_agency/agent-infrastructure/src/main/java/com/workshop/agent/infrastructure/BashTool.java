package com.workshop.agent.infrastructure;

import com.workshop.agent.application.Tool;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BashTool implements Tool {
    private static final Pattern BASH_COMMAND_PATTERN = Pattern.compile("<bash>(.*?)</bash>");

    @Override
    public Optional<String> parseAndExecute(String command) {
        Matcher matcher = BASH_COMMAND_PATTERN.matcher(command);
        if (!matcher.find()) {
            return Optional.empty();
        }

        String bashCommand = matcher.group(1);
        return Optional.of(executeBashCommand(bashCommand));
    }

    private String executeBashCommand(String command) {
        try {
            String os = System.getProperty("os.name").toLowerCase();
            ProcessBuilder processBuilder;

            if (os.contains("win")) {
                processBuilder = new ProcessBuilder("cmd.exe", "/c", command);
            } else {
                processBuilder = new ProcessBuilder("/bin/bash", "-c", command);
            }

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return output + "\nError: Command exited with code " + exitCode;
            }

            return output.toString();
        } catch (Exception ex) {
            return "Error executing command: " + ex.getMessage();
        }
    }
}