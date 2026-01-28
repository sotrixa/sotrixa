# Cost Optimization Settings (Jan 2026)

Applied: 2026-01-26

## Problem
- Output tokens 14x input (should be 3-5x max)
- Cache write/read ratio 1:10 (should be 1:50+)
- Parallel GSD agents creating duplicate context
- Total cost ~$30+/day

## Applied Fixes

### 1. Token Limits (balanced for code generation)
```json
"CLAUDE_CODE_MAX_OUTPUT_TOKENS": "16000"  // was 24000 (allows 400-line files)
"MAX_THINKING_TOKENS": "8000"             // was 16000
```
**Note:** 16k tokens = ~300-400 lines of code. Enough for large components/APIs.
Real savings come from BUILD MODE (no verbose explanations), not file size limits.

### 2. Cache Strategy (3x better reuse)
```json
"CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "88"  // was 70
```
Compact later → longer context → better cache hits

### 3. GSD Parallelization (60% fewer agents)
```json
"parallelization": "conservative"  // was "enabled"
"depth": "focused"                 // was "comprehensive"
```

### 4. Agent Output Formats
- **deep-reviewer**: Verbose format → BUILD MODE (concise)
- **cheap-review**: Already optimized
- Max 10 lines per category

### 5. Cost Guard Hook
New PreToolUse hook blocks:
- Using `Explore` instead of `cheap-explore`
- Using `Bash` instead of `cheap-bash`
- Warns on `opus` model usage
- Tracks WebSearch costs

## Expected Savings

| Category | Before | After | Savings |
|----------|--------|-------|---------|
| Output tokens | 2M/day | 900k/day | 55% |
| Cache efficiency | 1:10 | 1:35 | 3.5x |
| GSD parallelization | 10 agents | 3-4 agents | 60% |
| **Total cost** | **$30/day** | **$10-12/day** | **60%** |

**Output reduction strategy:**
- BUILD MODE: No "I'll help you...", "Let me explain..." fluff
- File generation: Full size allowed (16k tokens = 400 lines)
- Reports/analysis: Concise only (10 lines max per section)

## Monitoring

Check daily:
```bash
# View token usage
claude analyze-costs

# Check if settings applied
cat .claude/settings.json | jq '.env'
cat .planning/config.json
```

## Rollback (if quality drops)

```bash
# Revert to original settings
git checkout HEAD~1 .claude/settings.json .planning/config.json
```

## Notes

- Code quality preserved - limits affect explanations, not code
- GSD still works - just fewer parallel operations
- Cache improvements automatic after first compact
- Cost guard prevents accidental expensive operations
