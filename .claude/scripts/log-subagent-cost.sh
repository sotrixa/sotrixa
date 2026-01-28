#!/bin/bash
# Log subagent token usage and costs

# Read JSON from stdin
INPUT=$(cat)

# Extract agent information
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"')
AGENT_ID=$(echo "$INPUT" | jq -r '.agent_id // "unknown"')

# Extract token usage from the subagent stop event
# Try to get usage from the input data
INPUT_TOKENS=$(echo "$INPUT" | jq -r '.usage.input_tokens // 0')
OUTPUT_TOKENS=$(echo "$INPUT" | jq -r '.usage.output_tokens // 0')
CACHE_READ=$(echo "$INPUT" | jq -r '.usage.cache_read_input_tokens // 0')
CACHE_CREATE=$(echo "$INPUT" | jq -r '.usage.cache_creation_input_tokens // 0')

# Calculate total tokens
TOTAL_TOKENS=$((INPUT_TOKENS + OUTPUT_TOKENS + CACHE_READ + CACHE_CREATE))

# Calculate approximate cost (Sonnet 4.5 pricing)
# Input: $3/MTok, Output: $15/MTok, Cache write: $3.75/MTok, Cache read: $0.30/MTok
INPUT_COST=$(echo "scale=6; $INPUT_TOKENS * 3 / 1000000" | bc 2>/dev/null || echo "0")
OUTPUT_COST=$(echo "scale=6; $OUTPUT_TOKENS * 15 / 1000000" | bc 2>/dev/null || echo "0")
CACHE_READ_COST=$(echo "scale=6; $CACHE_READ * 0.30 / 1000000" | bc 2>/dev/null || echo "0")
CACHE_CREATE_COST=$(echo "scale=6; $CACHE_CREATE * 3.75 / 1000000" | bc 2>/dev/null || echo "0")
TOTAL_COST=$(echo "scale=6; $INPUT_COST + $OUTPUT_COST + $CACHE_READ_COST + $CACHE_CREATE_COST" | bc 2>/dev/null || echo "0")

# Get timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Create CSV if it doesn't exist
CSV_FILE=".claude/subagent-costs.csv"
if [ ! -f "$CSV_FILE" ] || [ ! -s "$CSV_FILE" ]; then
  echo "timestamp,agent_type,agent_id,input_tokens,output_tokens,cache_read,cache_create,total_tokens,cost_usd" > "$CSV_FILE"
fi

# Append data
echo "${TIMESTAMP},${AGENT_TYPE},${AGENT_ID},${INPUT_TOKENS},${OUTPUT_TOKENS},${CACHE_READ},${CACHE_CREATE},${TOTAL_TOKENS},${TOTAL_COST}" >> "$CSV_FILE"

# Log to alerts if cost is high (> $0.10)
if (( $(echo "$TOTAL_COST > 0.10" | bc -l 2>/dev/null || echo 0) )); then
  echo "[${TIMESTAMP}] 💰 High-cost subagent: ${AGENT_TYPE} - \$${TOTAL_COST} (${TOTAL_TOKENS} tokens)" >> .claude/alerts.log
fi

exit 0
