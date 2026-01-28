#!/bin/bash
# Cost Guard Hook - Warns when approaching expensive operations

# Read hook data from stdin
hook_data=$(cat)

# Extract tool name
tool=$(echo "$hook_data" | jq -r '.tool')

# Check for expensive operations
case "$tool" in
  "Task")
    subagent=$(echo "$hook_data" | jq -r '.tool_input.subagent_type // ""')
    model=$(echo "$hook_data" | jq -r '.tool_input.model // ""')

    # Warn if using expensive models without subagent optimization
    if [[ "$subagent" == "Explore" || "$subagent" == "Bash" ]]; then
      echo "⚠️  Use cheap-explore or cheap-bash instead of $subagent" >&2
      exit 1
    fi

    if [[ "$model" == "opus" ]]; then
      echo "⚠️  Opus requested - confirm this needs complex reasoning" >&2
      # Don't block, just warn
    fi
    ;;

  "WebSearch")
    # Web searches are expensive - ensure they're necessary
    query=$(echo "$hook_data" | jq -r '.tool_input.query // ""')
    echo "💰 WebSearch costs extra - query: ${query:0:50}..." >&2
    ;;
esac

exit 0
