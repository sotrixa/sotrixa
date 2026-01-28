#!/bin/bash
# Cost Dashboard - Comprehensive cost analysis and visualization

CSV_FILE=".claude/context-usage.csv"
BUDGET_FILE=".claude/budget.conf"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    CLAUDE CODE COST DASHBOARD                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -f "$CSV_FILE" ]; then
    echo "❌ No cost data found. Run Claude Code to generate $CSV_FILE"
    exit 1
fi

# Check if CSV has data (more than just header)
DATA_ROWS=$(wc -l < "$CSV_FILE" | tr -d ' ')
if [ "$DATA_ROWS" -eq 0 ] || [ "$DATA_ROWS" -eq 1 ]; then
    echo "ℹ️  No usage data collected yet."
    echo ""
    echo "The cost tracking system is active, but no data has been logged."
    echo "Data will be collected as you use Claude Code in this session."
    echo ""
    echo "💡 To see data:"
    echo "  1. Continue using Claude Code (reading files, running commands, etc.)"
    echo "  2. Data is logged automatically after each tool use"
    echo "  3. Re-run this dashboard to see your statistics"
    echo ""
    exit 0
fi

# Load budget if exists
DAILY_BUDGET=5.00
WEEKLY_BUDGET=25.00
MONTHLY_BUDGET=100.00
if [ -f "$BUDGET_FILE" ]; then
    source "$BUDGET_FILE"
fi

# Calculate date ranges
TODAY=$(date +%Y-%m-%d)
THIS_WEEK_START=$(date -v-7d +%Y-%m-%d 2>/dev/null || date -d '7 days ago' +%Y-%m-%d)
THIS_MONTH_START=$(date -v-30d +%Y-%m-%d 2>/dev/null || date -d '30 days ago' +%Y-%m-%d)

echo "📅 Report Period"
echo "  Today: $TODAY"
echo "  Last 7 days: $THIS_WEEK_START - $TODAY"
echo "  Last 30 days: $THIS_MONTH_START - $TODAY"
echo ""

# Total exchanges
TOTAL_EXCHANGES=$(wc -l < "$CSV_FILE")
echo "📊 Usage Statistics"
echo "  Total API calls: $TOTAL_EXCHANGES"

# Today's exchanges
TODAY_EXCHANGES=$(grep "^$TODAY" "$CSV_FILE" 2>/dev/null | wc -l)
echo "  Today's calls: $TODAY_EXCHANGES"
echo ""

# Context Analysis
echo "📈 Context Usage"
AVG_CONTEXT=$(awk -F',' 'NR>1 {gsub(/%/,"",$2); sum+=$2; count++} END {if(count>0) printf "%.1f", sum/count; else print "0"}' "$CSV_FILE")
PEAK_CONTEXT=$(awk -F',' 'NR>1 {gsub(/%/,"",$2); if($2>max) max=$2} END {if(max>0) print max; else print "0"}' "$CSV_FILE")
echo "  Average: ${AVG_CONTEXT}%"
echo "  Peak: ${PEAK_CONTEXT}%"

if (( $(echo "$AVG_CONTEXT > 60" | bc -l) )); then
    echo -e "  Status: ${RED}⚠️  High - Use /clear more frequently${NC}"
elif (( $(echo "$AVG_CONTEXT > 40" | bc -l) )); then
    echo -e "  Status: ${YELLOW}⚠️  Moderate - Monitor closely${NC}"
else
    echo -e "  Status: ${GREEN}✅ Optimal${NC}"
fi
echo ""

# Cache Analysis
echo "💾 Cache Performance"
TOTAL_CACHED=$(awk -F',' '{sum+=$3} END {if(sum>0) print sum; else print "0"}' "$CSV_FILE")
TOTAL_INPUT=$(awk -F',' '{sum+=$3+$4} END {if(sum>0) print sum; else print "0"}' "$CSV_FILE")
if [ -n "$TOTAL_INPUT" ] && [ "$TOTAL_INPUT" -gt 0 ]; then
    CACHE_RATE=$(echo "scale=1; $TOTAL_CACHED * 100 / $TOTAL_INPUT" | bc)
    echo "  Cache hit rate: ${CACHE_RATE}%"

    if (( $(echo "$CACHE_RATE > 70" | bc -l) )); then
        echo -e "  Status: ${GREEN}✅ Excellent${NC}"
    elif (( $(echo "$CACHE_RATE > 50" | bc -l) )); then
        echo -e "  Status: ${YELLOW}⚠️  Good - Can improve${NC}"
    else
        echo -e "  Status: ${RED}⚠️  Low - Review caching strategy${NC}"
    fi

    # Calculate cache savings
    CACHE_SAVINGS=$(echo "scale=2; $TOTAL_CACHED / 1000000 * (3.00 - 0.30)" | bc)
    echo "  Cache savings: \$${CACHE_SAVINGS}"
fi
echo ""

# Cost Estimation (using Sonnet 4.5 pricing)
echo "💰 Cost Estimation (Sonnet 4.5 Pricing)"
TOTAL_INPUT_TOKENS=$(awk -F',' '{sum+=$3+$4} END {if(sum>0) print sum; else print "0"}' "$CSV_FILE")
CACHED_COST=$(echo "scale=4; ${TOTAL_CACHED:-0} / 1000000 * 0.30" | bc)
REGULAR_INPUT_COST=$(echo "scale=4; (${TOTAL_INPUT_TOKENS:-0} - ${TOTAL_CACHED:-0}) / 1000000 * 3.00" | bc)
TOTAL_INPUT_COST=$(echo "scale=2; ${CACHED_COST:-0} + ${REGULAR_INPUT_COST:-0}" | bc)

# Estimate output cost (assume 1:3 input:output ratio)
ESTIMATED_OUTPUT_TOKENS=$(echo "${TOTAL_INPUT_TOKENS:-0} / 3" | bc)
OUTPUT_COST=$(echo "scale=2; ${ESTIMATED_OUTPUT_TOKENS:-0} / 1000000 * 15.00" | bc)

TOTAL_COST=$(echo "scale=2; ${TOTAL_INPUT_COST:-0} + ${OUTPUT_COST:-0}" | bc)

echo "  Input cost: \$$TOTAL_INPUT_COST"
echo "  Output cost (est.): \$$OUTPUT_COST"
echo "  Total estimated: \$$TOTAL_COST"
echo ""

# Today's cost
TODAY_INPUT=$(grep "^$TODAY" "$CSV_FILE" 2>/dev/null | awk -F',' '{sum+=$3+$4} END {if(sum>0) print sum; else print "0"}')
if [ -n "$TODAY_INPUT" ] && [ "$TODAY_INPUT" != "0" ] && [ "$TODAY_INPUT" -gt 0 ]; then
    TODAY_COST=$(echo "scale=2; ($TODAY_INPUT / 1000000 * 3.00) * 1.5" | bc)
    echo "  Today's cost: \$$TODAY_COST"

    BUDGET_REMAINING=$(echo "scale=2; $DAILY_BUDGET - $TODAY_COST" | bc)
    BUDGET_PCT=$(echo "scale=0; $TODAY_COST * 100 / $DAILY_BUDGET" | bc)

    if (( $(echo "$TODAY_COST > $DAILY_BUDGET" | bc -l) )); then
        echo -e "  Daily budget: ${RED}⚠️  EXCEEDED (\$$DAILY_BUDGET)${NC}"
    elif (( $(echo "$BUDGET_PCT > 80" | bc -l) )); then
        echo -e "  Daily budget: ${YELLOW}⚠️  ${BUDGET_PCT}% used${NC}"
    else
        echo -e "  Daily budget: ${GREEN}✅ ${BUDGET_PCT}% used (\$$BUDGET_REMAINING remaining)${NC}"
    fi
fi
echo ""

# Trend Analysis
echo "📉 Cost Trends"
if [ "$TOTAL_EXCHANGES" -gt 10 ]; then
    FIRST_10=$(head -10 "$CSV_FILE" | awk -F',' '{sum+=$3+$4; count++} END {print sum/count}')
    LAST_10=$(tail -10 "$CSV_FILE" | awk -F',' '{sum+=$3+$4; count++} END {print sum/count}')

    TREND=$(echo "scale=0; (($LAST_10 - $FIRST_10) / $FIRST_10) * 100" | bc)

    if [ "$TREND" -lt 0 ]; then
        echo -e "  Token usage trend: ${GREEN}↓ Decreasing by ${TREND#-}%${NC}"
    elif [ "$TREND" -gt 20 ]; then
        echo -e "  Token usage trend: ${RED}↑ Increasing by ${TREND}%${NC}"
    else
        echo -e "  Token usage trend: ${YELLOW}→ Stable (±${TREND}%)${NC}"
    fi
fi
echo ""

# Recommendations
echo "💡 Recommendations"
RECOMMENDATION_COUNT=0

if (( $(echo "$AVG_CONTEXT > 60" | bc -l) )); then
    echo "  • Use /clear more frequently to reduce context buildup"
    RECOMMENDATION_COUNT=$((RECOMMENDATION_COUNT + 1))
fi

if (( $(echo "$CACHE_RATE < 60" | bc -l) )); then
    echo "  • Review caching strategy - target >70% cache hit rate"
    echo "  • Use forked context for complex operations"
    echo "  • Implement 1-hour cache for stable content"
    RECOMMENDATION_COUNT=$((RECOMMENDATION_COUNT + 3))
fi

if (( $(echo "$PEAK_CONTEXT > 80" | bc -l) )); then
    echo "  • Peak context very high - implement auto-compact at 50%"
    RECOMMENDATION_COUNT=$((RECOMMENDATION_COUNT + 1))
fi

if (( $(echo "$TODAY_COST > $DAILY_BUDGET" | bc -l) )); then
    echo "  • ⚠️  Daily budget exceeded - review expensive operations"
    echo "  • Consider using Task tool instead of direct Grep/Read"
    echo "  • Use Ralph for long autonomous work"
    RECOMMENDATION_COUNT=$((RECOMMENDATION_COUNT + 3))
fi

if [ "$RECOMMENDATION_COUNT" -eq 0 ]; then
    echo -e "  ${GREEN}✅ All metrics look good! Keep up the optimization work.${NC}"
fi
echo ""

# Quick Actions
echo "⚡ Quick Actions"
echo "  • Detailed analysis: .claude/analyze-costs.sh"
echo "  • Optimize session: Use cost-optimizer agent"
echo "  • Set budget: Edit .claude/budget.conf"
echo "  • Clear context: /clear"
echo ""

# Budget configuration hint
if [ ! -f "$BUDGET_FILE" ]; then
    echo "💡 Tip: Create .claude/budget.conf to set custom budgets:"
    echo "   DAILY_BUDGET=5.00"
    echo "   WEEKLY_BUDGET=25.00"
    echo "   MONTHLY_BUDGET=100.00"
    echo ""
fi

echo "════════════════════════════════════════════════════════════════"
echo "Last updated: $(date)"
echo "Run this dashboard anytime: .claude/cost-dashboard.sh"
echo "════════════════════════════════════════════════════════════════"
