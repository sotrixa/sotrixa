# Context Optimization Quick Reference

**Goal**: Save as much money as possible on Claude Code API usage.

## Watch the Status Line

```
[Sonnet 4.5] Context: 42% 💚 | Cache: 85% 💚
                 ↑              ↑
              How full      How efficient
              your context  your caching is
              window is     (higher better)
```

**Action thresholds:**
- < 50% 💚: Keep working
- 50-80% 💛: Consider wrapping up current task
- > 80% 🔴: Use `/clear` before continuing

## The 5 Golden Rules

### 1. Use Task Tool for Exploration
```
❌ "Where is the authentication code?"
   [Then I run multiple Grep/Read commands]

✅ "Where is the authentication code?"
   [I automatically use Task tool with Explore agent]
```
**Savings**: 60-80% less context usage

### 2. Be Concise
```
❌ "Can you please help me understand what this file does and
    how it works and what patterns it uses and explain the logic?"

✅ "Explain src/auth/handler.ts"
```
**Savings**: 50-70% fewer tokens per exchange

### 3. Use Forked Context Skills
```
✅ /code-review
   [Runs in separate context, doesn't clutter main conversation]

❌ Running review commands directly in main conversation
```
**Savings**: Keeps main context clean

### 4. Use /clear Strategically
```
✅ After completing a feature
✅ Before starting unrelated work
✅ When status line shows > 70%

❌ In middle of debugging
❌ During multi-step refactoring
```

### 5. Use Ralph for Long Autonomous Work
```
✅ Use Ralph (Amp CLI) for multi-story implementation
   ./scripts/ralph/ralph.sh

❌ Manual iteration in Claude Code for 10+ steps
```
**Savings**: Ralph's context is separate from Claude Code

## Cost Comparison

**Without optimization:**
```
Task: "Find all auth code"
- 10 Grep commands
- 20 Read commands
- All results in main context
= 150K tokens @ $0.45
```

**With optimization:**
```
Task: "Find all auth code"
- 1 Task tool call with Explore agent
- Agent runs in separate context
- Returns summary only
= 15K tokens @ $0.04
```

**💰 11x cheaper!**

## Real-Time Monitoring

The status line updates every 300ms showing:
1. **Context %** - How much of your 200K context window is used
2. **Cache %** - How much is being read from cache (10x cheaper)

**Goal**: Keep context low, cache high.

## When to Use What

| Task | Use | Why |
|------|-----|-----|
| "Where is X?" | Task/Explore agent | Runs in separate context |
| "Fix bug Y" | Direct work | Need interactive debugging |
| Multi-story feature | Ralph | Autonomous loops separate from main context |
| Code review | /code-review skill | Forked context |
| Quick edit | Direct Edit/Write | Simple, no overhead |

## Files Reference

- **Full guide**: `.claude/CONTEXT_MANAGEMENT.md`
- **Configuration**: `.claude/settings.json`
- **Status line script**: `.claude/status-line.sh`
- **Project rules**: `CLAUDE.md` (context section)

## Expected Results

Following these rules:
- **60-80%** less context for exploration
- **40-60%** less overall costs
- **90%** less redundant context via caching

**Target**: Save $hundreds per month on API costs while maintaining full productivity.
