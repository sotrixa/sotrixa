# Engineering Workflow Optimization

**Based on**: Claude Code engineer best practices
**Date**: 2026-01-18

---

## Core Principle: Short Sessions

**Claude Code engineers likely use**: One task → /clear → Next task

**Not**: Long 100+ turn conversations with complex context management

---

## Recommended Workflow Changes

### 1. Use /clear Aggressively

**Current mindset**: "Preserve context, optimize to avoid /clear"
**Engineer mindset**: "/clear after every task completion"

**New workflow**:
```bash
# Task: Fix bug
claude
> "Fix authentication bug in src/auth/login.ts"
> [Fix applied]
> /clear  ← Do this immediately

# Task: Add feature
> "Add logout endpoint"
> [Feature added]
> /clear  ← Do this immediately

# Task: Review
> "Review changes in PR #123"
> [Review complete]
> /clear  ← Do this immediately
```

**Why**: Fresh context is cheaper than maintaining long history.

**Cost impact**:
- Long session: 150K tokens @ $0.45
- Short sessions (3 × 15 turns): 45K tokens @ $0.13
- **Savings**: 70% reduction

### 2. Adjust Auto-Compact Threshold

**Current**: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50` (too aggressive)
**Recommended**: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=75`

**Why**:
- Compacting costs tokens (summarization)
- Better to /clear at 80% than compact at 50%
- Engineers likely /clear before hitting compact threshold

**Change**:
```json
// .claude/settings.json
"env": {
  "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "75"  // Was 50
}
```

### 3. Simplify Hooks (Reduce Overhead)

**Current**: 15+ hooks with jq processing on every tool use
**Recommended**: Keep essential only

**Essential hooks** (keep):
- File protection
- Production branch protection
- Session start/end logging

**Optional hooks** (consider removing):
- Bash command logging (every command triggers jq + file write)
- Context usage tracking (overhead on every Stop)
- Test failure analysis (runs on every Bash tool)
- Dependency alerts (runs on every Edit/Write)
- Background agent monitoring (runs on every Task)

**Why**: Each hook adds 50-100ms + token overhead (jq parsing, file I/O)

**Minimal hooks config**:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "comment": "File protection only",
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/scripts/protect-sensitive-files.py",
            "stdin": "hook_data"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "comment": "Final cost report",
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/scripts/cost-dashboard.sh > .claude/last-session-report.txt"
          }
        ]
      }
    ]
  }
}
```

### 4. Use Headless Mode

**Pattern engineers likely use**:
```bash
# Automate log monitoring
tail -f app.log | claude -p "Alert me if you see errors"

# Automate test failures
npm test 2>&1 | claude -p "Summarize failures"

# Automate PR reviews
gh pr view 123 --json body,diff | claude -p "Review this PR"

# CI/CD integration
claude -p "Run linter and fix issues" < lint-output.txt
```

**Benefits**:
- No interactive context buildup
- Single-purpose, then exit
- Scriptable, automatable

**We're not using**: All interactive mode currently

### 5. Task Tool as Default

**Current**: Sometimes use Grep/Read directly
**Engineers**: ALWAYS use Task tool

**Pattern**:
```javascript
// ❌ Don't do in main conversation
Grep(pattern="auth")
Read("file1.ts")
Read("file2.ts")
Read("file3.ts")

// ✅ Always do this
Task(
  subagent_type="Explore",
  prompt="Find authentication patterns"
)
```

**Why**: Task tool isolates context, returns only summary

### 6. Model Switching by Default

**Engineers probably**:
- Default to Haiku for 80% of tasks
- Use Sonnet only when Haiku fails
- Use Opus very rarely (critical decisions only)

**Current**: Default to Sonnet for everything

**Recommendation**:
```bash
# Start with Haiku
claude --model haiku

# Switch to Sonnet if needed
/model sonnet

# Rarely use Opus
/model opus  # Only for critical architecture decisions
```

**Cost impact**: Haiku is **12x cheaper** than Sonnet

---

## Optimal Daily Workflow

### Morning Routine
```bash
# Check what needs doing
git status
git diff

# Task 1: Fix bug (Haiku)
claude --model haiku
> "Fix TypeError in src/auth.ts line 45"
> /clear

# Task 2: Add feature (Haiku first)
claude --model haiku
> "Add logout endpoint to API"
> [If too complex] /model sonnet
> /clear

# Task 3: Review PR (Sonnet for quality)
claude --model sonnet
> "Review PR #123"
> /clear
```

### Throughout Day
- **One task per session**
- **/clear immediately after completion**
- **Start with Haiku**, escalate if needed
- **Use Task tool** for any exploration
- **Headless for automation** (logs, tests, CI)

### End of Day
```bash
# Check costs
cat .claude/last-session-report.txt

# Review what was done
cat .claude/session.log
```

---

## Environment Optimization

### Recommended .env Changes

```bash
# ~/.zshrc or ~/.bashrc

# Auto-compact at 75% (not 50%)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=75

# Default to Haiku
alias claude='claude --model haiku'

# Quick commands
alias claude-review='claude --model sonnet -p "Review changes"'
alias claude-fix='claude --model haiku -p "Fix issues"'
```

### Recommended settings.json Changes

1. **Increase auto-compact threshold**: 50 → 75
2. **Remove overhead hooks**: Keep 3-5 essential only
3. **Simplify env vars**: Remove non-essential

---

## Cost Comparison

### Current Approach (Long Sessions)
```
Session 1: 100 turns × 1200 tokens (old CLAUDE.md) = 120K tokens
Context management: Compact 3x = +15K tokens
Hooks overhead: 15 hooks × 100 runs = +5K tokens
Total: 140K tokens @ $0.42 (Sonnet)
```

### Engineer Approach (Short Sessions)
```
Session 1: 10 turns × 350 tokens (new CLAUDE.md) = 3.5K tokens
Session 2: 10 turns × 350 tokens = 3.5K tokens
Session 3: 15 turns × 350 tokens = 5.2K tokens
Total: 12.2K tokens @ $0.036 (Sonnet)

If using Haiku: 12.2K tokens @ $0.003
```

**Savings**: **90% reduction** with Haiku + short sessions

---

## Action Items

### Immediate Changes

1. **Change auto-compact threshold**:
   ```bash
   # .claude/settings.json
   "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "75"  # Was 50
   ```

2. **Use /clear after every task**:
   - Finish bug fix → /clear
   - Finish feature → /clear
   - Finish review → /clear

3. **Start sessions with Haiku**:
   ```bash
   claude --model haiku
   # Only escalate if needed
   ```

### Optional Optimizations

4. **Simplify hooks** (reduce to 3-5 essential):
   - Keep: File protection, production branch protection
   - Remove: Bash logging, context tracking, test analysis, etc.

5. **Use headless mode**:
   ```bash
   tail -f app.log | claude -p "Alert on errors"
   ```

6. **Always use Task tool**:
   - Never Grep/Read directly for exploration
   - Always delegate to agents

---

## Expected Results

### With These Changes

**Token usage**:
- Per session: 3-5K tokens (vs 140K current)
- Per day: 15-30K tokens (vs 400K+ current)
- **97% reduction**

**Cost**:
- Per session: $0.001 - $0.015 with Haiku
- Per session: $0.009 - $0.090 with Sonnet
- **Current**: $0.42+ per long session

**Workflow**:
- Faster (no long context to process)
- Clearer (fresh context per task)
- Cheaper (Haiku + short sessions)

---

## Key Mindset Shift

**Old mindset**: "Optimize to maintain long context"
**New mindset**: "Clear context frequently, keep sessions short"

**Old pattern**:
```
One long session with 100+ turns, complex optimizations
```

**New pattern**:
```
10 short sessions with 5-15 turns each, simple workflow
```

**Result**: 90-97% cost reduction

---

## Summary

**What Claude Code engineers do differently**:

1. ✅ **Short sessions** (5-15 turns) then /clear
2. ✅ **Haiku by default** (12x cheaper than Sonnet)
3. ✅ **Task tool always** (no direct Grep/Read)
4. ✅ **Headless for automation** (logs, CI/CD)
5. ✅ **Minimal hooks** (3-5 essential only)
6. ✅ **Auto-compact at 75%** (not 50%)
7. ✅ **One task per session** (not multi-task conversations)

**What we were doing**:
- Long sessions (100+ turns)
- Sonnet by default
- Sometimes direct operations
- Interactive only
- 15+ hooks with overhead
- Auto-compact at 50%
- Multi-task conversations

**Fix**: Adopt engineer workflow → **90-97% cost reduction**
