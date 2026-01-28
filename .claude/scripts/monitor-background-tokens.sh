#!/bin/bash
# Monitor background token usage
# Tracks tokens used by system operations like /resume, /cost, auto-compact

MONITOR_FILE=".claude/background-usage.log"
CSV_FILE=".claude/context-usage.csv"

# Detect if this is likely a background operation
# Background ops typically have very low token counts and happen outside normal flow

if [ ! -f "$CSV_FILE" ]; then
    exit 0
fi

# Get the last entry
LAST_ENTRY=$(tail -1 "$CSV_FILE")
if [ -z "$LAST_ENTRY" ]; then
    exit 0
fi

TIMESTAMP=$(echo "$LAST_ENTRY" | cut -d',' -f1)
CONTEXT_PCT=$(echo "$LAST_ENTRY" | cut -d',' -f2 | tr -d '%')
CACHED=$(echo "$LAST_ENTRY" | cut -d',' -f3)
INPUT=$(echo "$LAST_ENTRY" | cut -d',' -f4)

# Calculate total tokens
TOTAL=$((CACHED + INPUT))

# If tokens are very low (<100) and context didn't change much, likely background
# Check if this might be a background operation
if [ "$TOTAL" -lt 100 ] && [ "$CONTEXT_PCT" -lt 5 ]; then
    # Log as potential background operation
    echo "$TIMESTAMP,background,$TOTAL" >> "$MONITOR_FILE"
fi

# Calculate total background usage
if [ -f "$MONITOR_FILE" ]; then
    TOTAL_BG=$(awk -F',' '{sum+=$3} END {print sum}' "$MONITOR_FILE")
    BG_COST=$(echo "scale=4; $TOTAL_BG / 1000000 * 3.00" | bc)

    # If background usage exceeds $0.10, alert
    if (( $(echo "$BG_COST > 0.10" | bc -l) )); then
        # Create alert file
        echo "Background usage: $TOTAL_BG tokens (\$$BG_COST)" > ".claude/background-alert.txt"
    fi
fi
