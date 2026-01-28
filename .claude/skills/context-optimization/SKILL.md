---
name: context-optimization
description: Complete context management and cost optimization guide. Use when optimizing token usage, reducing context bloat, or learning cost-saving strategies.
---

# Context Optimization Guide

Full context management strategies for cost savings.

## Core Rules - Follow Always

1. **Use Task tool for exploration** - Don't run Grep/Read directly for "where is X?" queries
2. **Use forked context skills** - `/code-review` and `/commit-standard` run in isolated contexts
3. **Be concise** - "Explain file.ts" not paragraphs. Every token costs money.
4. **Use /compact before /clear** - `/compact` summarizes (preserves context), `/clear` resets (loses everything)
5. **Use /cost to track spending** - Check token usage and costs per session
6. **Use Ralph for long work** - Multi-story features run autonomously without inflating context
7. **Switch models strategically** - `/model haiku` (cheap/fast), `/model sonnet` (default), `/model opus` (complex only)
8. **Use background subagents** - Launch parallel agents with `run_in_background: true` to keep main thread active

## Detailed Best Practices

### Exploration Strategy

**❌ Don't do this:**
```javascript
// Running searches in main conversation
Grep(pattern="authentication")
Read(file_path="src/auth/login.ts")
Read(file_path="src/auth/middleware.ts")
Read(file_path="src/auth/session.ts")
// Each file read adds to main context!
```

**✅ Do this instead:**
```javascript
// Use Task tool with Explore agent
Task(
  subagent_type="Explore",
  prompt="How does authentication work? Find all auth-related files and patterns"
)
// Agent works in isolated context, only returns summary
```

**Savings**: 60-80% reduction vs direct searches

### Model Selection

```bash
# Simple tasks (commits, quick reviews, simple edits)
/model haiku

# Default work (implementation, debugging, planning)
/model sonnet

# Complex reasoning (architecture decisions, critical bugs)
/model opus
```

**Cost comparison:**
- Haiku: $0.25/1M input tokens
- Sonnet: $3/1M input tokens (12x more expensive)
- Opus: $15/1M input tokens (60x more expensive)

### Compaction Strategy

**When to compact:**
- Context: 50-70% → Use `/compact`
- Context: 70-80% → Use `/compact` urgently
- Context: 80%+ → Use `/clear` (last resort)

**Why `/compact` first:**
- Preserves conversation summary
- Keeps context of what was done
- Allows continuation without context loss

**When to use `/clear`:**
- Switching to completely different topic
- Context beyond recovery (>80%)
- Fresh start needed

### Forked Context Skills

**What are they:**
Skills that run in separate context, don't bloat main conversation.

**Examples:**
- `/commit-standard` - Creates commits in forked context using Haiku
- `/code-review` - Reviews code in forked context using Explore agent

**How they work:**
1. Invoked with `/skill-name`
2. Run in isolated subprocess
3. Return only final result to main conversation
4. Context discarded after completion

**When to create:**
- Repetitive workflows (commits, reviews)
- Self-contained operations
- Can run on cheaper models

### Background Subagents

**Pattern:**
```javascript
// Launch multiple agents in parallel
Task(subagent_type="Explore", prompt="Find auth patterns", run_in_background=true)
Task(subagent_type="Bash", prompt="npm test", run_in_background=true)
Task(subagent_type="Plan", prompt="Plan migration", run_in_background=true)

// Main conversation continues (not blocked)
// Each agent runs in isolated context
// Only final results added to main thread
```

**Savings**: Agents don't inflate main context, 60-80% faster execution

## Cost Tracking

### Commands
```bash
/cost              # Current session costs
/compact           # Summarize context
/clear             # Reset context
/model <name>      # Switch model
```

### Monitoring Files
- `.claude/context-usage.csv` - Context tracking
- `.claude/subagent-costs.csv` - Subagent costs
- `.claude/session.log` - Session activity
- `.claude/bash-commands.log` - Command audit

### Cost Dashboard
```bash
./.claude/scripts/cost-dashboard.sh
```

## Quick Reference Table

| Scenario | Don't Do | Do Instead | Savings |
|----------|----------|------------|---------|
| Codebase search | Grep + Read multiple files | Task(Explore agent) | 60-80% |
| Simple commits | Sonnet for commits | /commit-standard (Haiku) | 92% |
| Code review | Manual review in main | /code-review (forked) | 70% |
| Long work | Multi-turn conversation | Ralph autonomous | 80-90% |
| Parallel tasks | Sequential execution | Background subagents | 60-80% |
| Context >70% | Keep going or /clear | /compact first | Context preserved |

## Expected Results

**Following these practices:**
- **60-80% token reduction** overall
- **11x cheaper** for typical workflows
- **Faster execution** with parallel agents
- **Better context management** with compaction

**Without these practices:**
- 150K tokens @ $0.45 per session
- Context bloat → forced /clear
- Lost conversation history

**With these practices:**
- 15K tokens @ $0.04 per session
- Lean context throughout
- Preserved history

## Environment Setup

Add to shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
# Auto-compact at 70% (default 95%)
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70
```

## Related Documentation

- `.claude/CONTEXT_MANAGEMENT.md` - Full written guide
- `.claude/ORCHESTRATION.md` - Background agent patterns
- `/orchestration-guide` - Orchestration skill
- `CLAUDE.md` - Core rules only

## Status Line

Watch terminal bottom:
```
[Sonnet 4.5] Context: 42% 💚 | Cache: 85% 💚
```

**Thresholds:**
- 💚 < 50%: Good, continue
- 💛 50-80%: Warning, consider /compact
- 🔴 > 80%: Danger, use /clear

**Remember**: Every token costs money. Be concise, use agents, track costs, compact early.
