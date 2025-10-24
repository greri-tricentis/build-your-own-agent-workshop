#!/bin/bash

# Capture maven test output
output=$(mvn test 2>&1)
exit_code=$?

if [ $exit_code -eq 0 ]; then
    # Extract number of tests from Maven output
    # Maven typically shows: "Tests run: X, Failures: Y, Errors: Z, Skipped: W"
    test_count=$(echo "$output" | grep -oP "Tests run: \K\d+" | tail -1)

    if [ -z "$test_count" ]; then
        test_count=0
    fi

    echo "✅ All $test_count tests passed"
else
    # Tests failed - show only relevant output
    echo "$output" | \
        grep -v "^\[INFO\]" | \
        grep -v "Reactor Summary" | \
        grep -v "BUILD FAILURE" | \
        grep -v "Total time:" | \
        grep -v "Finished at:" | \
        grep -v "Failed to execute goal" | \
        grep -v "surefire-reports" | \
        grep -v "dump files" | \
        grep -v "re-run Maven" | \
        grep -v "Re-run Maven" | \
        grep -v "For more information" | \
        grep -v "Help 1" | \
        grep -v "After correcting" | \
        grep -v "mvn <args>" | \
        grep -v "^$" | \
        grep -v "^-*$" | \
        grep -v "^\[ERROR\]\s*$"
fi

exit $exit_code
