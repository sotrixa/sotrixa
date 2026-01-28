# Context Management Guide

## Goal: Minimize Context Window Usage = Lower Costs

This guide outlines strategies to save money on API calls while maintaining full productivity.

## Core Principles

### 1. Use Forked Context for Complex Operations

**What it does**: Runs operations in isolated sub-contexts that don't clutter main conversation.

**When to use**:
- Complex multi-step analysis
- Code reviews
- Large file operations
- Research tasks

**How to enable**: Add to skill YAML frontmatter:
```yaml
context: fork
agent: Explore  # optional: specify agent type
```

**Configured skills with forked context**:
- `code-review` - Uses forked context with Explore agent

### 2. Use Task Tool with Specialized Agents

**Why**: Agents run in separate contexts and don't bloat main conversation.

**Use cases**:
- Codebase exploration: `subagent_type=Explore`
- Feature planning: `subagent_type=Plan`
- Code simplification: `subagent_type=code-simplifier`
- PR reviews: `subagent_type=pr-review-toolkit:*`

**Example**:
```
User: "Where are errors handled in the codebase?"
✅ Use: Task tool with Explore agent
❌ Don't: Run Grep/Read commands directly in main conversation
```

### 3. Be Concise in Prompts

**Cost impact**: Every token in every message counts toward context.

**Best practices**:
- Get to the point quickly
- Avoid repeating information already in context
- Use specific file paths instead of descriptions
- Reference previous messages by summary, not by quoting

**Example**:
```
❌ "Can you please help me understand what this file does and how it works and what patterns it uses?"
✅ "Explain src/auth/handler.ts"
```

### 4. Use /clear Strategically

**When to clear**:
- After completing a major task
- When switching to unrelated work
- When context feels bloated
- Before starting new features

**When NOT to clear**:
- In the middle of debugging
- During multi-step refactoring
- When context is still relevant

### 5. Leverage Prompt Caching

**What it is**: Claude Code automatically caches frequently used content.

**How to benefit**:
- Keep CLAUDE.md concise but comprehensive
- Reuse file paths and patterns
- Repeated reads of same files are cached

**Monitor**: Check `cache_read_input_tokens` vs `cache_creation_input_tokens` in status line.

### 6. Use Ralph for Long-Running Work

**Why**: Ralph (Amp CLI) handles autonomous loops without inflating Claude Code context.

**Use Ralph for**:
- Multi-story feature implementation
- Batch processing of similar tasks
- Long autonomous execution cycles

**Use Claude Code for**:
- Planning and research (GSD)
- Quick fixes
- Interactive debugging
- Architectural decisions

### 7. Minimize Tool Results in Context

**Best practices**:
- Don't read entire large files - use `offset` and `limit`
- Use Grep with `output_mode: files_with_matches` instead of `content` when you just need to know which files match
- Use Glob patterns efficiently - be specific to avoid hundreds of results
- For large diffs, focus on specific files instead of `git diff` everything

### 8. Status Line Monitoring

**Purpose**: Real-time context usage tracking.

**Location**: `.claude/status-line.sh` (created automatically)

**What it shows**:
- Current model
- Context usage percentage
- Token breakdown (input/output/cached)

**How to read**:
```
[Sonnet 4.5] Context: 42% | Cache: 85%
```
- 42% = Current context window usage
- 85% = Cache hit rate (higher is better)

## Quick Reference

| Scenario | Strategy | Tool/Method |
|----------|----------|-------------|
| Code review | Forked context | `/code-review` skill |
| Find where X is used | Agent in separate context | Task tool with Explore |
| Multi-story implementation | Use Ralph | `./scripts/ralph/ralph.sh` |
| Quick bug fix | Direct work | Read/Edit/Bash |
| Large file search | Focused search | Grep with file patterns |
| Switch topics | Clear context | `/clear` command |
| Monitor usage | Check status line | Status line at bottom |

## Cost Breakdown

**Approximate token costs** (as of Jan 2025):
- Sonnet 4.5: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Cached reads: ~$0.30 per 1M tokens (10x cheaper!)

**Example session costs**:
```
Without optimization:
  50K context → 150K tokens total → $0.45 per exchange

With optimization:
  10K context + 40K cached → 50K tokens total → $0.04 per exchange

💰 11x cheaper!
```

## Monitoring Commands

**Check context usage**:
- Status line shows live percentage
- Look for the display at bottom of terminal

**Manual check** (if status line not configured):
```bash
# Context usage is shown in Claude Code UI
# No manual command needed
```

## Advanced: Optimize CLAUDE.md

CLAUDE.md is included in every request as project context.

**Best practices**:
- Keep it focused and essential
- Remove outdated information
- Use links to detailed docs instead of embedding everything
- Structure with clear sections for easy caching
- Current size: ~8KB (reasonable)

## Review Checklist

Before each session, consider:
- [ ] Is my task suitable for Ralph (autonomous) vs Claude Code (interactive)?
- [ ] Can I use forked context or Task tool for this?
- [ ] Are my prompts concise?
- [ ] Do I need to /clear before starting?

After intensive work:
- [ ] Check context usage in status line
- [ ] Run `/clear` before switching to new topic
- [ ] Archive completed work notes to reduce context

## Expected Savings

Following these practices:
- **60-80% reduction** in context usage for exploration tasks (using Task/Explore)
- **40-60% reduction** in overall session costs (using forked context, concise prompts)
- **90% reduction** in redundant context (using prompt caching effectively)

**ROI**: Time spent optimizing < Money saved within first week of active development.
