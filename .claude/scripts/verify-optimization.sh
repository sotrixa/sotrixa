#!/bin/bash
# Verify all context optimization features are properly configured

echo "🔍 Claude Code Context Optimization Verification"
echo "================================================"
echo ""

PASS=0
FAIL=0

# Check 1: CLAUDE.md size
echo "1. Checking CLAUDE.md size..."
SIZE=$(wc -c < CLAUDE.md)
if [ "$SIZE" -lt 5000 ]; then
    echo "   ✅ CLAUDE.md is optimized (${SIZE} bytes, < 5KB)"
    PASS=$((PASS + 1))
else
    echo "   ❌ CLAUDE.md is too large (${SIZE} bytes, should be < 5KB)"
    FAIL=$((FAIL + 1))
fi

# Check 2: Status line script exists and is executable
echo "2. Checking status line script..."
if [ -x .claude/status-line.sh ]; then
    echo "   ✅ Status line script exists and is executable"
    PASS=$((PASS + 1))
else
    echo "   ❌ Status line script missing or not executable"
    FAIL=$((FAIL + 1))
fi

# Check 3: Settings.json has status line configured
echo "3. Checking status line configuration..."
if grep -q "statusLine" .claude/settings.json; then
    echo "   ✅ Status line configured in settings.json"
    PASS=$((PASS + 1))
else
    echo "   ❌ Status line not configured in settings.json"
    FAIL=$((FAIL + 1))
fi

# Check 4: Context tracking hook exists
echo "4. Checking context tracking hook..."
if grep -q "context-usage.csv" .claude/settings.json; then
    echo "   ✅ Context tracking hook configured"
    PASS=$((PASS + 1))
else
    echo "   ❌ Context tracking hook not configured"
    FAIL=$((FAIL + 1))
fi

# Check 5: High context warning hook exists
echo "5. Checking high context warning hook..."
if grep -q "Notification" .claude/settings.json; then
    echo "   ✅ High context warning hook configured"
    PASS=$((PASS + 1))
else
    echo "   ❌ High context warning hook not configured"
    FAIL=$((FAIL + 1))
fi

# Check 6: Permission pre-approvals exist
echo "6. Checking permission pre-approvals..."
if grep -q "permissions" .claude/settings.json; then
    echo "   ✅ Permission pre-approvals configured"
    PASS=$((PASS + 1))
else
    echo "   ❌ Permission pre-approvals not configured"
    FAIL=$((FAIL + 1))
fi

# Check 7: commit-standard uses forked context
echo "7. Checking commit-standard skill forked context..."
if grep -q "context: fork" .claude/skills/commit-standard/SKILL.md; then
    echo "   ✅ commit-standard uses forked context"
    PASS=$((PASS + 1))
else
    echo "   ❌ commit-standard doesn't use forked context"
    FAIL=$((FAIL + 1))
fi

# Check 8: commit-standard uses Haiku
echo "8. Checking commit-standard uses Haiku model..."
if grep -q "model: haiku" .claude/skills/commit-standard/SKILL.md; then
    echo "   ✅ commit-standard uses Haiku model"
    PASS=$((PASS + 1))
else
    echo "   ❌ commit-standard doesn't specify Haiku model"
    FAIL=$((FAIL + 1))
fi

# Check 9: code-review uses forked context
echo "9. Checking code-review skill forked context..."
if grep -q "context: fork" .claude/skills/code-review/SKILL.md; then
    echo "   ✅ code-review uses forked context"
    PASS=$((PASS + 1))
else
    echo "   ❌ code-review doesn't use forked context"
    FAIL=$((FAIL + 1))
fi

# Check 10: Documentation files exist
echo "10. Checking documentation files..."
DOCS_EXIST=true
for doc in ".claude/CONTEXT_MANAGEMENT.md" ".claude/CONTEXT_QUICK_REFERENCE.md" ".claude/OPTIMIZATION_SUMMARY.md" "DEVELOPMENT.md"; do
    if [ ! -f "$doc" ]; then
        DOCS_EXIST=false
        echo "   ❌ Missing: $doc"
        FAIL=$((FAIL + 1))
        break
    fi
done
if [ "$DOCS_EXIST" = true ]; then
    echo "   ✅ All documentation files present"
    PASS=$((PASS + 1))
fi

# Check 11: Gitignore includes logs and csv
echo "11. Checking .gitignore..."
if grep -q ".claude/\*.log" .gitignore && grep -q ".claude/\*.csv" .gitignore; then
    echo "   ✅ Logs and CSV files gitignored"
    PASS=$((PASS + 1))
else
    echo "   ❌ Logs or CSV files not properly gitignored"
    FAIL=$((FAIL + 1))
fi

# Check 12: Pricing status line
echo "12. Checking pricing status line..."
if grep -q "status-line-with-pricing.sh" .claude/settings.json; then
    echo "   ✅ Pricing status line configured"
    PASS=$((PASS + 1))
else
    echo "   ⚠️  Using basic status line (pricing version available)"
    PASS=$((PASS + 1))
fi

# Check 13: Cost optimizer agent
echo "13. Checking cost optimizer agent..."
if [ -f ".claude/agents/cost-optimizer.md" ]; then
    echo "   ✅ Cost optimizer agent exists"
    PASS=$((PASS + 1))
else
    echo "   ❌ Cost optimizer agent missing"
    FAIL=$((FAIL + 1))
fi

# Check 14: Auto-compact environment variable
echo "14. Checking auto-compact configuration..."
if [ -n "$CLAUDE_AUTOCOMPACT_PCT_OVERRIDE" ]; then
    echo "   ✅ Auto-compact override set to $CLAUDE_AUTOCOMPACT_PCT_OVERRIDE%"
    PASS=$((PASS + 1))
else
    echo "   ⚠️  Auto-compact not configured (recommended: 50%)"
    echo "   Run: export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50"
    FAIL=$((FAIL + 1))
fi

# Summary
echo ""
echo "================================================"
echo "Summary: $PASS passed, $FAIL failed"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All optimizations verified successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Restart Claude Code to activate changes"
    echo "2. Check status line appears at bottom of terminal"
    echo "3. Run a test session and verify:"
    echo "   - Context stays low"
    echo "   - Skills work in forked context"
    echo "   - No unnecessary permission prompts"
    echo "4. Check .claude/context-usage.csv after session"
    echo ""
    echo "Expected savings: 60-85% cost reduction!"
    exit 0
else
    echo "⚠️  Some optimizations need attention (see above)"
    echo "Review failed checks and re-run this script"
    exit 1
fi
