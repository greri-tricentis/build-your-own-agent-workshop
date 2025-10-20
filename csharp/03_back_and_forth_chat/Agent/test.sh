#!/usr/bin/env bash
set -euo pipefail

# Find the first .sln file in the current directory
DEFAULT_SOLUTION=$(find . -maxdepth 1 -name "*.sln" -type f | head -n 1)
if [[ -z "$DEFAULT_SOLUTION" ]]; then
    DEFAULT_SOLUTION="Agent.sln"  # Fallback if no .sln found
fi

show_usage() {
    echo "Usage: $0 [solution/project] [--filter <test_filter>] [--verbose] [--help]"
    echo ""
    echo "Arguments:"
    echo "  solution/project    Path to solution (.sln) or project (.csproj) file"
    echo "                      Default: $DEFAULT_SOLUTION"
    echo ""
    echo "Options:"
    echo "  --filter <pattern>  Run only tests matching the pattern"
    echo "  --verbose          Show full dotnet test output instead of summary"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run all tests in $DEFAULT_SOLUTION"
    echo "  $0 UnitTests/Core                     # Run tests in specific project"
    echo "  $0 --filter TestMethodName           # Run specific test method"
    echo "  $0 UnitTests/Core --filter ClassName # Run tests in specific class"
    echo "  $0 --verbose                         # Run with full output"
    echo "  $0 --verbose --filter TestName       # Verbose output with filter"
}

target=""
test_filter=""
verbose=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --filter)
            if [[ $# -lt 2 ]]; then
                echo "Error: --filter requires a pattern argument" >&2
                exit 1
            fi
            test_filter="$2"
            shift 2
            ;;
        --verbose|-v)
            verbose=true
            shift
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        -*)
            echo "Error: Unknown option $1" >&2
            show_usage
            exit 1
            ;;
        *)
            if [[ -z "$target" ]]; then
                target="$1"
            else
                echo "Error: Multiple targets specified" >&2
                show_usage
                exit 1
            fi
            shift
            ;;
    esac
done

if [[ -z "$target" ]]; then
    target="$DEFAULT_SOLUTION"
fi

extract_passed_tests() {
    local output="$1"
    local passed_tests=""
    
    if test_summary=$(echo "$output" | grep -o 'Test summary: total: [0-9]\+, failed: [0-9]\+, succeeded: [0-9]\+, skipped: [0-9]\+'); then
        passed_tests=$(echo "$test_summary" | grep -o 'succeeded: [0-9]\+' | grep -o '[0-9]\+')
    elif vstest_summary=$(echo "$output" | grep -o 'Failed:[[:space:]]*[0-9]\+, Passed:[[:space:]]*[0-9]\+, Skipped:[[:space:]]*[0-9]\+, Total:[[:space:]]*[0-9]\+'); then
        passed_tests=$(echo "$vstest_summary" | grep -o 'Passed:[[:space:]]*[0-9]\+' | grep -o '[0-9]\+')
    else
        passed_tests=$(echo "$output" | grep -o 'succeeded: [0-9]\+' | grep -o '[0-9]\+' | head -1)
        if [[ -z "$passed_tests" ]]; then
            passed_tests=$(echo "$output" | grep -o 'Passed:[[:space:]]*[0-9]\+' | grep -o '[0-9]\+' | head -1)
        fi
    fi
    
    echo "${passed_tests:-0}"
}

show_success_summary() {
    local passed_tests="$1"
    local test_filter="$2"
    
    if [[ -n "$test_filter" ]]; then
        echo "✅ All $passed_tests filtered tests passed (filter: $test_filter)"
    else
        echo "✅ All $passed_tests tests passed"
    fi
}

show_test_failure() {
    echo ""
    echo "❌ Tests failed"
    exit 1
}

if [[ ! -f "$target" && ! -d "$target" ]]; then
    echo "Error: Target '$target' not found" >&2
    exit 1
fi

cmd="dotnet test \"$target\""

if [[ -n "$test_filter" ]]; then
    cmd="$cmd --filter \"$test_filter\""
fi

if [[ "$verbose" == true ]]; then
    temp_output=$(mktemp)
    
    if eval "$cmd" 2>&1 | tee "$temp_output"; then
        echo ""
        output=$(cat "$temp_output")
        passed_tests=$(extract_passed_tests "$output")
        show_success_summary "$passed_tests" "$test_filter"
    else
        show_test_failure
    fi
    
    rm -f "$temp_output"
else
    if output=$(eval "$cmd" 2>&1); then
        passed_tests=$(extract_passed_tests "$output")
        show_success_summary "$passed_tests" "$test_filter"
    else
        echo "$output"
        show_test_failure
    fi
fi