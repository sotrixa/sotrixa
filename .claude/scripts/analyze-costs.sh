#!/bin/bash
# Analyze cost patterns from context-usage.csv

CSV_FILE=".claude/context-usage.csv"

if [ ! -f "$CSV_FILE" ]; then
    echo "No cost data yet. Run Claude Code first to generate $CSV_FILE"
    exit 1
fi

echo "📊 Cost Analysis Report"
echo "======================"
echo ""

# Count total exchanges
TOTAL=$(wc -l < "$CSV_FILE")
echo "Total exchanges: $TOTAL"
echo ""

# Average context usage
AVG_CONTEXT=$(awk -F',' '{gsub(/%/,"",$2); sum+=$2; count++} END {printf "%.1f", sum/count}' "$CSV_FILE")
echo "Average context usage: ${AVG_CONTEXT}%"

# Peak context usage
PEAK_CONTEXT=$(awk -F',' '{gsub(/%/,"",$2); if($2>max) max=$2} END {print max}' "$CSV_FILE")
echo "Peak context usage: ${PEAK_CONTEXT}%"
echo ""

# Cache efficiency
TOTAL_CACHED=$(awk -F',' '{sum+=$3} END {print sum}' "$CSV_FILE")
TOTAL_INPUT=$(awk -F',' '{sum+=$3+$4} END {print sum}' "$CSV_FILE")
if [ "$TOTAL_INPUT" -gt 0 ]; then
    CACHE_RATE=$(echo "scale=1; $TOTAL_CACHED * 100 / $TOTAL_INPUT" | bc)
    echo "Cache hit rate: ${CACHE_RATE}%"
fi
echo ""

# Estimated costs (rough estimates, adjust for your model)
# Using Sonnet 4.5 pricing: $3/MTok input, $15/MTok output, $0.30/MTok cache reads
INPUT_COST=$(echo "scale=4; $TOTAL_INPUT / 1000000 * 0.30" | bc)
echo "Estimated input cost (with caching): \$${INPUT_COST}"
echo ""

# Recommendations
echo "💡 Recommendations:"
if (( $(echo "$AVG_CONTEXT > 60" | bc -l) )); then
    echo "  ⚠️  Average context is high. Consider using /clear more frequently."
fi

if (( $(echo "$CACHE_RATE < 50" | bc -l) )); then
    echo "  ⚠️  Cache hit rate is low. Review caching strategy."
fi

if (( $(echo "$AVG_CONTEXT < 50" | bc -l) )) && (( $(echo "$CACHE_RATE > 70" | bc -l) )); then
    echo "  ✅ Excellent optimization! Keep it up."
fi
