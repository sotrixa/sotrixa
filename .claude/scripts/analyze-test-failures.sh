#!/bin/bash
# Parse test failures from Bash commands

# Read JSON input from stdin
INPUT=$(cat)

# Get command and output
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
OUTPUT=$(echo "$INPUT" | jq -r '.tool_result.output // empty')

# Check if this looks like a test command
if ! echo "$COMMAND" | grep -qE '(test|spec|jest|mocha|pytest|phpunit|go test|cargo test|npm.*test|yarn.*test)'; then
  exit 0
fi

# Check for common test failure patterns in output
if echo "$OUTPUT" | grep -qE '(FAIL|FAILED|ERROR|AssertionError|Test.*failed|✗|✕|×)'; then
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  # Extract failure summary (first 5 failure lines)
  FAILURES=$(echo "$OUTPUT" | grep -E '(FAIL|FAILED|ERROR|AssertionError)' | head -5)

  # Create test failures log if it doesn't exist
  LOG_FILE=".claude/test-failures.log"

  # Log the failure
  {
    echo "=================================================="
    echo "[${TIMESTAMP}] TEST FAILURES DETECTED"
    echo "Command: ${COMMAND}"
    echo "--------------------------------------------------"
    echo "$FAILURES"
    echo "=================================================="
    echo ""
  } >> "$LOG_FILE"

  # Also alert in alerts.log
  echo "[${TIMESTAMP}] ❌ TEST FAILURES: ${COMMAND}" >> .claude/alerts.log
fi

exit 0
