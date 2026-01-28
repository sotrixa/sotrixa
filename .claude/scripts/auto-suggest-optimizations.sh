#!/bin/bash
# Automatic Optimization Suggestions
# Analyzes session and suggests specific optimizations

CSV_FILE=".claude/context-usage.csv"

echo "🤖 Automatic Optimization Suggestions"
echo "======================================"
echo ""

if [ ! -f "$CSV_FILE" ] || [ ! -s "$CSV_FILE" ]; then
    echo "ℹ️  Not enough data yet. Run more Claude Code sessions."
    exit 0
fi

SUGGESTIONS=()

# Check 1: High context usage
AVG_CONTEXT=$(awk -F',' '{gsub(/%/,"",$2); sum+=$2; count++} END {printf "%.0f", sum/count}' "$CSV_FILE")
if [ "$AVG_CONTEXT" -gt 60 ]; then
    SUGGESTIONS+=("🔴 HIGH PRIORITY: Average context is ${AVG_CONTEXT}%. Run /clear more frequently between tasks.")
fi

# Check 2: Low cache hit rate
TOTAL_CACHED=$(awk -F',' '{sum+=$3} END {print sum}' "$CSV_FILE")
TOTAL_INPUT=$(awk -F',' '{sum+=$3+$4} END {print sum}' "$CSV_FILE")
if [ "$TOTAL_INPUT" -gt 0 ]; then
    CACHE_RATE=$(echo "scale=0; $TOTAL_CACHED * 100 / $TOTAL_INPUT" | bc)
    if [ "$CACHE_RATE" -lt 50 ]; then
        SUGGESTIONS+=("🟡 MEDIUM PRIORITY: Cache hit rate is ${CACHE_RATE}%. Consider:")
        SUGGESTIONS+=("   • Adding 'context: fork' to more skills")
        SUGGESTIONS+=("   • Using Task tool for exploration instead of direct Grep/Read")
        SUGGESTIONS+=("   • Implementing 1-hour cache for stable content")
    fi
fi

# Check 3: Frequent high context peaks
HIGH_CONTEXT_COUNT=$(awk -F',' '{gsub(/%/,"",$2); if($2>80) count++} END {print count}' "$CSV_FILE")
TOTAL_COUNT=$(wc -l < "$CSV_FILE")
if [ "$TOTAL_COUNT" -gt 10 ]; then
    HIGH_CONTEXT_PCT=$(echo "scale=0; $HIGH_CONTEXT_COUNT * 100 / $TOTAL_COUNT" | bc)
    if [ "$HIGH_CONTEXT_PCT" -gt 20 ]; then
        SUGGESTIONS+=("🟡 MEDIUM PRIORITY: Context exceeds 80% in ${HIGH_CONTEXT_PCT}% of exchanges.")
        SUGGESTIONS+=("   • Set CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50 for earlier compaction")
        SUGGESTIONS+=("   • Use context handoffs before /clear to preserve key decisions")
    fi
fi

# Check 4: Repetitive patterns (same file read multiple times)
if [ -f ".claude/bash-commands.log" ]; then
    REPEATED_READS=$(grep -E "cat |Read" .claude/bash-commands.log 2>/dev/null | sort | uniq -c | awk '$1 > 3 {count++} END {print count+0}')
    if [ "$REPEATED_READS" -gt 5 ]; then
        SUGGESTIONS+=("🟢 LOW PRIORITY: ${REPEATED_READS} files were read 3+ times.")
        SUGGESTIONS+=("   • Consider caching frequently accessed files")
        SUGGESTIONS+=("   • Use prompt caching for large stable documents")
    fi
fi

# Check 5: Token usage trending up
if [ "$TOTAL_COUNT" -gt 20 ]; then
    FIRST_10_AVG=$(head -10 "$CSV_FILE" | awk -F',' '{sum+=$3+$4} END {print sum/10}')
    LAST_10_AVG=$(tail -10 "$CSV_FILE" | awk -F',' '{sum+=$3+$4} END {print sum/10}')
    TREND=$(echo "scale=0; (($LAST_10_AVG - $FIRST_10_AVG) / $FIRST_10_AVG) * 100" | bc)

    if [ "$TREND" -gt 30 ]; then
        SUGGESTIONS+=("🟡 MEDIUM PRIORITY: Token usage increased ${TREND}% over recent sessions.")
        SUGGESTIONS+=("   • Review what changed in workflow")
        SUGGESTIONS+=("   • Consider using Ralph for long autonomous tasks")
        SUGGESTIONS+=("   • Run cost-optimizer agent for detailed analysis")
    fi
fi

# Check 6: Budget concerns
if [ -f ".claude/budget.conf" ]; then
    source ".claude/budget.conf"
    TODAY=$(date +%Y-%m-%d)
    TODAY_TOKENS=$(grep "^$TODAY" "$CSV_FILE" 2>/dev/null | awk -F',' '{sum+=$3+$4} END {print sum}')
    if [ -n "$TODAY_TOKENS" ] && [ "$TODAY_TOKENS" != "0" ]; then
        TODAY_COST=$(echo "scale=2; ($TODAY_TOKENS / 1000000 * 3.00) * 1.5" | bc)
        if (( $(echo "$TODAY_COST > ($DAILY_BUDGET * 0.8)" | bc -l) )); then
            SUGGESTIONS+=("🔴 HIGH PRIORITY: Today's cost (\$$TODAY_COST) approaching budget (\$$DAILY_BUDGET).")
            SUGGESTIONS+=("   • Use Haiku model for simple tasks (3x cheaper)")
            SUGGESTIONS+=("   • Defer non-urgent work to off-hours")
            SUGGESTIONS+=("   • Consider implementing Batch API for background tasks")
        fi
    fi
fi

# Check 7: Optimization opportunities
if [ ! -f ".claude/agents/quick-reviewer.md" ]; then
    SUGGESTIONS+=("🟢 LOW PRIORITY: Smart routing agents not configured.")
    SUGGESTIONS+=("   • Create quick-reviewer (Haiku) and deep-reviewer (Sonnet) agents")
    SUGGESTIONS+=("   • Route simple reviews to Haiku for 3x cost savings")
fi

# Output suggestions
if [ ${#SUGGESTIONS[@]} -eq 0 ]; then
    echo "✅ Everything looks optimized! No suggestions at this time."
    echo ""
    echo "Current performance:"
    echo "  • Average context: ${AVG_CONTEXT}%"
    echo "  • Cache hit rate: ${CACHE_RATE}%"
    echo "  • Status: Optimal"
else
    echo "Found ${#SUGGESTIONS[@]} optimization opportunities:"
    echo ""
    for suggestion in "${SUGGESTIONS[@]}"; do
        echo "$suggestion"
    done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Run this script anytime: .claude/auto-suggest-optimizations.sh"
echo "📊 For detailed analysis: .claude/cost-dashboard.sh"
echo "🔍 For deep dive: Use cost-optimizer agent"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
