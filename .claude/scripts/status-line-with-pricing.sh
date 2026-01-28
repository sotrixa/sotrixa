#!/bin/bash
# Claude Code Status Line with Real-Time Pricing
# Shows: Model | Context % | Cache % | Session Cost | Total Saved

input=$(cat)

# Extract key metrics
MODEL=$(echo "$input" | jq -r '.model.display_name // "Claude"')
MODEL_ID=$(echo "$input" | jq -r '.model.id // ""')
USED_PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | awk '{printf "%.0f", $1}')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

# Pricing per million tokens (adjust for your model)
case "$MODEL_ID" in
    *"sonnet-4"*|*"sonnet-3"*)
        INPUT_PRICE=3.00
        OUTPUT_PRICE=15.00
        CACHE_WRITE_PRICE=3.75
        CACHE_READ_PRICE=0.30
        ;;
    *"opus-4"*)
        INPUT_PRICE=15.00
        OUTPUT_PRICE=75.00
        CACHE_WRITE_PRICE=18.75
        CACHE_READ_PRICE=1.50
        ;;
    *"haiku-4"*)
        INPUT_PRICE=1.00
        OUTPUT_PRICE=5.00
        CACHE_WRITE_PRICE=1.25
        CACHE_READ_PRICE=0.10
        ;;
    *"haiku-3"*)
        INPUT_PRICE=0.25
        OUTPUT_PRICE=1.25
        CACHE_WRITE_PRICE=0.30
        CACHE_READ_PRICE=0.03
        ;;
    *)
        # Default to Sonnet 4.5 pricing
        INPUT_PRICE=3.00
        OUTPUT_PRICE=15.00
        CACHE_WRITE_PRICE=3.75
        CACHE_READ_PRICE=0.30
        ;;
esac

# Calculate costs and cache efficiency if data available
COST_INFO=""
CACHE_INFO=""
if [ "$USAGE" != "null" ]; then
    # Extract token counts
    INPUT_TOKENS=$(echo "$USAGE" | jq -r '.input_tokens // 0')
    OUTPUT_TOKENS=$(echo "$USAGE" | jq -r '.output_tokens // 0')
    CACHE_READ=$(echo "$USAGE" | jq -r '.cache_read_input_tokens // 0')
    CACHE_CREATE=$(echo "$USAGE" | jq -r '.cache_creation_input_tokens // 0')

    # Calculate costs (convert to millions, multiply by price)
    INPUT_COST=$(echo "scale=4; $INPUT_TOKENS / 1000000 * $INPUT_PRICE" | bc)
    OUTPUT_COST=$(echo "scale=4; $OUTPUT_TOKENS / 1000000 * $OUTPUT_PRICE" | bc)
    CACHE_READ_COST=$(echo "scale=4; $CACHE_READ / 1000000 * $CACHE_READ_PRICE" | bc)
    CACHE_WRITE_COST=$(echo "scale=4; $CACHE_CREATE / 1000000 * $CACHE_WRITE_PRICE" | bc)

    # Total cost for this exchange
    TOTAL_COST=$(echo "scale=4; $INPUT_COST + $OUTPUT_COST + $CACHE_READ_COST + $CACHE_WRITE_COST" | bc)

    # Calculate savings from cache (vs. paying full input price)
    CACHE_SAVINGS=$(echo "scale=4; ($CACHE_READ / 1000000 * $INPUT_PRICE) - $CACHE_READ_COST" | bc)

    # Accumulate session totals (stored in temp file)
    COST_FILE="/tmp/claude-session-cost-$$"
    if [ -f "$COST_FILE" ]; then
        PREV_TOTAL=$(cat "$COST_FILE")
        SESSION_COST=$(echo "scale=4; $PREV_TOTAL + $TOTAL_COST" | bc)
    else
        SESSION_COST=$TOTAL_COST
    fi
    echo "$SESSION_COST" > "$COST_FILE"

    # Format cost display (show in cents with exactly 2 decimal places)
    COST_CENTS=$(printf "%.2f" $(echo "scale=4; $TOTAL_COST * 100" | bc))
    SESSION_CENTS=$(printf "%.2f" $(echo "scale=4; $SESSION_COST * 100" | bc))
    SAVED_CENTS=$(printf "%.2f" $(echo "scale=4; $CACHE_SAVINGS * 100" | bc))

    COST_INFO=" | \$${COST_CENTS}¢"

    # Only show savings if significant
    if (( $(echo "$CACHE_SAVINGS > 0.0001" | bc -l) )); then
        COST_INFO="${COST_INFO} (↓\$${SAVED_CENTS}¢)"
    fi

    # Cache hit rate calculation
    TOTAL_INPUT=$((CACHE_READ + CACHE_CREATE + INPUT_TOKENS))
    if [ "$TOTAL_INPUT" -gt 0 ]; then
        CACHE_HIT_PCT=$((CACHE_READ * 100 / TOTAL_INPUT))

        # Color coding for cache efficiency
        if [ "$CACHE_HIT_PCT" -ge 70 ]; then
            CACHE_COLOR="💚"  # Great cache usage
        elif [ "$CACHE_HIT_PCT" -ge 40 ]; then
            CACHE_COLOR="💛"  # Decent cache usage
        else
            CACHE_COLOR="🔴"  # Poor cache usage
        fi

        CACHE_INFO=" | Cache: ${CACHE_HIT_PCT}% ${CACHE_COLOR}"
    fi
fi

# Color code context usage
if [ "$USED_PCT" -ge 80 ]; then
    CONTEXT_COLOR="🔴"  # Danger - use /clear
elif [ "$USED_PCT" -ge 50 ]; then
    CONTEXT_COLOR="💛"  # Warning
else
    CONTEXT_COLOR="💚"  # Good
fi

# Output format: [Model] Context: X% 🟢 | Cache: Y% 🟢 | $0.02¢ (↓$0.15¢)
echo "[${MODEL}] Context: ${USED_PCT}% ${CONTEXT_COLOR}${CACHE_INFO}${COST_INFO}"
