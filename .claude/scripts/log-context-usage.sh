#!/bin/bash
# Extract context usage from transcript and log to CSV

# Read JSON from stdin
INPUT=$(cat)

# Extract transcript path
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
    exit 0
fi

# Get the last line with usage data from transcript (macOS compatible)
LAST_USAGE=$(grep '"input_tokens":' "$TRANSCRIPT_PATH" | grep -v '"input_tokens":null' | tail -1 | jq -c '.message.usage // empty' 2>/dev/null)

if [ -z "$LAST_USAGE" ] || [ "$LAST_USAGE" = "null" ]; then
    exit 0
fi

# Extract token counts
CACHE_READ=$(echo "$LAST_USAGE" | jq -r '.cache_read_input_tokens // 0')
CACHE_CREATE=$(echo "$LAST_USAGE" | jq -r '.cache_creation_input_tokens // 0')
INPUT_TOKENS=$(echo "$LAST_USAGE" | jq -r '.input_tokens // 0')

# Calculate total input tokens and context percentage
TOTAL_INPUT=$((CACHE_READ + CACHE_CREATE + INPUT_TOKENS))
CACHE_TOKENS=$((CACHE_READ + CACHE_CREATE))

# Calculate context percentage (assuming 200k token limit)
CONTEXT_PCT=$(echo "scale=1; $TOTAL_INPUT * 100 / 200000" | bc 2>/dev/null || echo "0")

# Get timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Append to CSV (create with header if doesn't exist)
CSV_FILE=".claude/context-usage.csv"
if [ ! -f "$CSV_FILE" ] || [ ! -s "$CSV_FILE" ]; then
    echo "timestamp,context_used,cache_tokens,input_tokens" > "$CSV_FILE"
fi

# Append data
echo "${TIMESTAMP},${CONTEXT_PCT}%,${CACHE_TOKENS},${INPUT_TOKENS}" >> "$CSV_FILE"
