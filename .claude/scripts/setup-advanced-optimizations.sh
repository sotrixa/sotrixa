#!/bin/bash
# Setup Advanced Optimizations for Claude Code

echo "🚀 Setting up Advanced Claude Code Optimizations"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f ".claude/settings.json" ]; then
    echo "❌ Error: Must be run from project root directory"
    exit 1
fi

# Detect shell
SHELL_RC=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
else
    echo "⚠️  Could not detect shell type. Please manually add to your shell RC file:"
    echo "   export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50"
    echo ""
fi

# 1. Set up auto-compact at 50%
echo "1. Setting up auto-compact at 50%..."
if [ -n "$SHELL_RC" ]; then
    if grep -q "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE" "$SHELL_RC"; then
        echo "   ✅ Already configured in $SHELL_RC"
    else
        echo "" >> "$SHELL_RC"
        echo "# Claude Code: Auto-compact at 50% to save costs" >> "$SHELL_RC"
        echo "export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50" >> "$SHELL_RC"
        echo "   ✅ Added to $SHELL_RC"
        echo "   ⚠️  Run: source $SHELL_RC  (or restart terminal)"
    fi
fi
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50
echo "   ✅ Enabled for current session"
echo ""

# 2. Verify pricing status line
echo "2. Verifying pricing status line..."
if grep -q "status-line-with-pricing.sh" .claude/settings.json; then
    echo "   ✅ Pricing status line configured"
else
    echo "   ⚠️  Pricing status line not configured"
    echo "   Run: Update .claude/settings.json to use status-line-with-pricing.sh"
fi
echo ""

# 3. Verify cost optimizer agent
echo "3. Verifying cost optimizer agent..."
if [ -f ".claude/agents/cost-optimizer.md" ]; then
    echo "   ✅ Cost optimizer agent created"
else
    echo "   ❌ Cost optimizer agent missing"
fi
echo ""

# 4. Create .env.local for additional settings (if doesn't exist)
echo "4. Creating environment configuration..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Claude Code Advanced Optimizations
# Auto-compact at 50% instead of 95% to maintain lean context
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50

# Disable background tasks if you want manual control (optional)
# CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1
EOF
    echo "   ✅ Created .env.local with optimization settings"
else
    echo "   ℹ️  .env.local already exists"
fi
echo ""

# 5. Verify gitignore
echo "5. Verifying .gitignore..."
if grep -q "context-usage.csv" .gitignore && grep -q ".env.local" .gitignore; then
    echo "   ✅ Gitignore properly configured"
else
    if ! grep -q ".env.local" .gitignore; then
        echo ".env.local" >> .gitignore
        echo "   ✅ Added .env.local to .gitignore"
    fi
    if ! grep -q "/tmp/claude-session-cost" .gitignore; then
        echo "/tmp/claude-session-cost-*" >> .gitignore
        echo "   ✅ Added session cost temp files to .gitignore"
    fi
fi
echo ""

# 6. Create cost analysis helper script
echo "6. Creating cost analysis helper..."
cat > .claude/analyze-costs.sh << 'EOFSCRIPT'
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
EOFSCRIPT
chmod +x .claude/analyze-costs.sh
echo "   ✅ Created .claude/analyze-costs.sh"
echo ""

# 7. Create quick reference card
echo "7. Creating quick reference card..."
cat > .claude/QUICK_REFERENCE.txt << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║        CLAUDE CODE COST OPTIMIZATION QUICK REFERENCE           ║
╚════════════════════════════════════════════════════════════════╝

📊 STATUS LINE
  Format: [Model] Context: X% 🟢 | Cache: Y% 🟢 | $0.02¢ (↓$0.15¢)
  💚 <50% Good | 💛 50-80% Warning | 🔴 >80% Clear needed

🎯 GOLDEN RULES
  1. Use Task tool for "where is X?" (not Grep/Read directly)
  2. Be concise in prompts
  3. Use skills with forked context (/code-review, /commit-standard)
  4. /clear when context > 70%
  5. Use Ralph for multi-story work

⚡ QUICK COMMANDS
  /clear              Reset context (use when >70%)
  /cost               View session costs (if available)
  /compact            Manually compact context

🔧 COST OPTIMIZATION
  Analyze session:    Use cost-optimizer agent
  View trends:        .claude/analyze-costs.sh
  Check config:       .claude/verify-optimization.sh

💰 MODEL COSTS (per 1M tokens)
  Haiku:   $1 input,  $5 output    (simple tasks)
  Sonnet:  $3 input, $15 output    (complex tasks)
  Cache:   $0.30 read (90% cheaper!)

📁 KEY FILES
  Status line:        .claude/status-line-with-pricing.sh
  Full guide:         .claude/CONTEXT_MANAGEMENT.md
  Advanced tips:      .claude/ADVANCED_OPTIMIZATIONS.md
  Quick tips:         .claude/CONTEXT_QUICK_REFERENCE.md

🎓 BEST PRACTICES
  ✅ Monitor status line constantly
  ✅ Use forked context for complex operations
  ✅ Let me use Task tool automatically for searches
  ✅ /clear between unrelated tasks
  ✅ Run cost analysis weekly

❌ AVOID
  ❌ Multiple Grep/Read for same search
  ❌ Verbose prompts
  ❌ Ignoring context warnings
  ❌ Working past 80% context
  ❌ Using Sonnet for simple tasks

🎯 TARGET METRICS
  Context usage:     < 50% average
  Cache hit rate:    > 70%
  Cost per session:  Track and optimize weekly

Press Ctrl+C to exit | View full docs: .claude/MASTER_OPTIMIZATION_GUIDE.md
EOF
echo "   ✅ Created .claude/QUICK_REFERENCE.txt"
echo ""

# Summary
echo "================================================"
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code to activate changes"
echo "  2. Check status line shows: Context% | Cache% | Cost"
echo "  3. Run test session and verify optimizations"
echo "  4. View quick reference: cat .claude/QUICK_REFERENCE.txt"
echo "  5. After session: .claude/analyze-costs.sh"
echo ""
echo "📖 Documentation:"
echo "  - Master guide:  .claude/MASTER_OPTIMIZATION_GUIDE.md"
echo "  - Advanced tips: .claude/ADVANCED_OPTIMIZATIONS.md"
echo "  - Quick ref:     .claude/CONTEXT_QUICK_REFERENCE.md"
echo ""
echo "🎯 Expected savings: 70-90% cost reduction"
echo ""
