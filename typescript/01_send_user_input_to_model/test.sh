#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

# Run tests and capture output
output=$(pnpm test -- --run 2>&1)
exit_code=$?

# Count number of tests from output
test_count=$(echo "$output" | grep -oP '\d+(?= passed)' | head -1)

# If tests passed (exit code 0), show minimal output
if [ $exit_code -eq 0 ]; then
  echo "✅ All $test_count tests passed"
else
  # If tests failed, show full output
  echo "$output"
fi

# Exit with the same code as the test run
exit $exit_code
