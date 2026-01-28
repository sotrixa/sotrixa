#!/bin/bash
# Monitor background agent status and costs
# Based on official Claude Code TaskOutput tool

set -euo pipefail

LOG_FILE=".claude/background-agents.log"
COST_FILE=".claude/subagent-costs.csv"

echo "=== Background Agents Monitor ==="
echo ""

# Show recent launches
if [[ -f "$LOG_FILE" ]]; then
  echo "Recent Background Agents:"
  tail -n 10 "$LOG_FILE"
  echo ""
else
  echo "No background agents launched yet"
  echo ""
fi

# Show subagent costs
if [[ -f "$COST_FILE" ]]; then
  echo "Subagent Costs (last 10):"
  tail -n 10 "$COST_FILE"
  echo ""

  # Calculate total cost from background agents
  if command -v awk >/dev/null 2>&1; then
    TOTAL=$(awk -F',' 'NR>1 {sum+=$3} END {printf "%.4f", sum}' "$COST_FILE")
    echo "Total Subagent Cost: \$$TOTAL"
  fi
else
  echo "No subagent cost data yet"
fi

echo ""
echo "=== Commands ==="
echo "View all background agents: tail -f .claude/background-agents.log"
echo "List active tasks: /tasks"
echo "Check task output: TaskOutput(task_id=\"...\", block=false)"
