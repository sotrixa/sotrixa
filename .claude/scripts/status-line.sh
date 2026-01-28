#!/bin/bash
# Claude Code Status Line
# Shows: Model | Context Usage | Cache Efficiency

input=$(cat)

# Extract key metrics
MODEL=$(echo "$input" | jq -r '.model.display_name // "Claude"')
USED_PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | awk '{printf "%.0f", $1}')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

# Calculate cache efficiency if data available
CACHE_INFO=""
if [ "$USAGE" != "null" ]; then
    CACHE_READ=$(echo "$USAGE" | jq -r '.cache_read_input_tokens // 0')
    CACHE_CREATE=$(echo "$USAGE" | jq -r '.cache_creation_input_tokens // 0')
    INPUT_TOKENS=$(echo "$USAGE" | jq -r '.input_tokens // 0')

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
    CONTEXT_COLOR="🔴"  # Danger - consider /clear
elif [ "$USED_PCT" -ge 50 ]; then
    CONTEXT_COLOR="💛"  # Warning
else
    CONTEXT_COLOR="💚"  # Good
fi

# Output format: [Model] Context: X% 🟢 | Cache: Y% 🟢
echo "[${MODEL}] Context: ${USED_PCT}% ${CONTEXT_COLOR}${CACHE_INFO}"
