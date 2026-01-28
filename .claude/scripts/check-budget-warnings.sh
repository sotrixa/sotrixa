#!/bin/bash
# Check budget warnings (soft alerts, not hard stops)
# Reads budget.conf and compares against actual usage

BUDGET_FILE=".claude/budget.conf"
CSV_FILE=".claude/context-usage.csv"
ALERTS_LOG=".claude/alerts.log"

# Exit if no budget config
if [ ! -f "$BUDGET_FILE" ]; then
  exit 0
fi

# Exit if no usage data yet
if [ ! -f "$CSV_FILE" ] || [ ! -s "$CSV_FILE" ]; then
  exit 0
fi

# Source budget configuration
source "$BUDGET_FILE"

# Only check if alerts are enabled
if [ "$ENABLE_DAILY_ALERTS" != "true" ] && [ "$ENABLE_WEEKLY_ALERTS" != "true" ] && [ "$ENABLE_MONTHLY_ALERTS" != "true" ]; then
  exit 0
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
TODAY=$(date +%Y-%m-%d)

# Calculate today's token usage and cost
TODAY_TOKENS=$(grep "^$TODAY" "$CSV_FILE" 2>/dev/null | awk -F',' '{sum+=$3+$4} END {print sum}')

if [ -z "$TODAY_TOKENS" ] || [ "$TODAY_TOKENS" = "0" ]; then
  exit 0
fi

# Rough cost estimate (Sonnet 4.5: $3/MTok input, $15/MTok output)
# Average estimate at ~$4/MTok blended
TODAY_COST=$(echo "scale=2; $TODAY_TOKENS / 1000000 * 4.00" | bc 2>/dev/null || echo "0")

# Check daily budget warnings
if [ "$ENABLE_DAILY_ALERTS" = "true" ]; then
  DAILY_PCT=$(echo "scale=0; $TODAY_COST / $DAILY_BUDGET * 100" | bc 2>/dev/null || echo "0")

  if [ "$DAILY_PCT" -ge "$CRITICAL_THRESHOLD" ]; then
    echo "[$TIMESTAMP] 🔴 BUDGET CRITICAL: Daily cost \$$TODAY_COST reached $DAILY_PCT% of \$$DAILY_BUDGET budget" >> "$ALERTS_LOG"
  elif [ "$DAILY_PCT" -ge "$WARNING_THRESHOLD" ]; then
    echo "[$TIMESTAMP] 🟡 BUDGET WARNING: Daily cost \$$TODAY_COST at $DAILY_PCT% of \$$DAILY_BUDGET budget" >> "$ALERTS_LOG"
  fi
fi

# Check weekly budget (if enabled)
if [ "$ENABLE_WEEKLY_ALERTS" = "true" ]; then
  WEEK_START=$(date -v-Mon +%Y-%m-%d 2>/dev/null || date -d "monday" +%Y-%m-%d 2>/dev/null)
  WEEK_TOKENS=$(awk -v start="$WEEK_START" -F',' '$1 >= start {sum+=$3+$4} END {print sum}' "$CSV_FILE")
  WEEK_COST=$(echo "scale=2; $WEEK_TOKENS / 1000000 * 4.00" | bc 2>/dev/null || echo "0")
  WEEK_PCT=$(echo "scale=0; $WEEK_COST / $WEEKLY_BUDGET * 100" | bc 2>/dev/null || echo "0")

  if [ "$WEEK_PCT" -ge "$CRITICAL_THRESHOLD" ]; then
    echo "[$TIMESTAMP] 🔴 BUDGET CRITICAL: Weekly cost \$$WEEK_COST reached $WEEK_PCT% of \$$WEEKLY_BUDGET budget" >> "$ALERTS_LOG"
  elif [ "$WEEK_PCT" -ge "$WARNING_THRESHOLD" ]; then
    echo "[$TIMESTAMP] 🟡 BUDGET WARNING: Weekly cost \$$WEEK_COST at $WEEK_PCT% of \$$WEEKLY_BUDGET budget" >> "$ALERTS_LOG"
  fi
fi

exit 0
