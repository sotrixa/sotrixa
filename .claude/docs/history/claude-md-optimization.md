# CLAUDE.md Token Optimization

**Date**: 2026-01-18
**Status**: ✅ Ready for implementation
**Method**: Official Claude Code progressive disclosure via skills

---

## Problem

Current `CLAUDE.md` loaded into **every prompt**:
- **863 words** (~1200 tokens)
- Contains detailed patterns, examples, code snippets
- Significant overhead per conversation turn

**Cost impact**: Every message pays 1200 token tax

---

## Solution: Progressive Disclosure

**Official Claude Code approach**:
1. **CLAUDE.md**: Core project context only (~250 words)
2. **Skills**: Detailed patterns invoked on-demand
3. **Other .md files**: Reference documentation

### Token Reduction

| File | Words | Est. Tokens | Loaded |
|------|-------|-------------|--------|
| **Current CLAUDE.md** | 863 | ~1200 | Every prompt |
| **Minimal CLAUDE.md** | 248 | ~350 | Every prompt |
| **Savings** | **-615** | **~850** | **71% reduction** |

**Cost savings per 10-turn conversation**:
- Current: 1200 tokens × 10 = 12,000 tokens
- Minimal: 350 tokens × 10 = 3,500 tokens
- **Saved**: 8,500 tokens (~$0.025 at Sonnet rates)

---

## What Moved to Skills

### 1. /context-optimization Skill

**Content moved**:
- Detailed context management rules (8 rules → examples)
- Model selection guide with pricing
- Compaction strategy
- Forked context skills explanation
- Background subagents patterns
- Cost tracking commands
- Quick reference table
- Environment setup

**When invoked**: User needs detailed context optimization guidance

**Token impact**: 0 in main prompts, ~800 when invoked

### 2. /orchestration-guide Skill

**Content moved**:
- 5 orchestration patterns with code
- Real-world examples
- TaskOutput tool usage
- Progress monitoring commands
- Best practices + anti-patterns
- Monitoring files and scripts

**When invoked**: User needs orchestration guidance

**Token impact**: 0 in main prompts, ~1000 when invoked

---

## New CLAUDE.md Structure

**File**: `CLAUDE.md.minimal` (ready to replace current)

### Sections (248 words total)

1. **Project** (4 lines)
   - GSD/Ralph overview
   - Workflow

2. **Critical Rules** (7 rules)
   - Core optimization principles only
   - No examples or explanations

3. **Key Skills** (8 lines)
   - List of forked context skills
   - When to invoke

4. **Quick Reference** (4 rules)
   - Do/Don't table only

5. **Details** (4 pointers)
   - Where to find full docs

**Total**: ~350 tokens (vs 1200 current)

---

## Implementation Steps

### Option A: Direct Replace
```bash
# Backup current
cp CLAUDE.md CLAUDE.md.backup

# Replace with minimal
cp CLAUDE.md.minimal CLAUDE.md

# Skills already created
ls .claude/skills/context-optimization/
ls .claude/skills/orchestration-guide/
```

### Option B: Gradual Migration
```bash
# Test minimal version first
# Keep both, use CLAUDE.md.minimal manually
# After validation, replace

cp CLAUDE.md.minimal CLAUDE.md
```

---

## Files Created

### Skills (on-demand loading)
1. `.claude/skills/context-optimization/SKILL.md`
   - Complete context management guide
   - ~800 tokens, loaded only when `/context-optimization` invoked

2. `.claude/skills/orchestration-guide/SKILL.md`
   - Complete orchestration patterns
   - ~1000 tokens, loaded only when `/orchestration-guide` invoked

### Minimal CLAUDE.md
3. `CLAUDE.md.minimal`
   - Ready to replace current `CLAUDE.md`
   - ~350 tokens, loaded every prompt

### Documentation
4. `.claude/CLAUDE_MD_OPTIMIZATION.md` (this file)
   - Implementation guide
   - Token analysis

---

## Usage After Implementation

### For Users

**Quick context reminder**:
```
Just read CLAUDE.md (350 tokens) - core rules visible
```

**Need detailed guidance**:
```bash
/context-optimization    # Full context guide
/orchestration-guide     # Full orchestration patterns
```

### For Claude

**Every prompt**: Load minimal CLAUDE.md (350 tokens)

**On-demand**: Invoke skills when user needs details
```javascript
// User asks: "How do I optimize context?"
Skill(skill="context-optimization")  // Load 800 tokens once

// User asks: "How do I use background agents?"
Skill(skill="orchestration-guide")   // Load 1000 tokens once
```

---

## Token Economics

### Current Workflow (10-turn conversation)

```
Turn 1-10: CLAUDE.md loaded = 1200 tokens × 10 = 12,000 tokens
Total: 12,000 tokens
```

### Optimized Workflow

```
Turn 1-10: Minimal CLAUDE.md = 350 tokens × 10 = 3,500 tokens
Turn 5: User asks about context → /context-optimization = 800 tokens (once)
Total: 3,500 + 800 = 4,300 tokens
Savings: 12,000 - 4,300 = 7,700 tokens (64% reduction)
```

### Cost Impact (Sonnet 4.5 rates: $3/1M input tokens)

**Per conversation**:
- Current: 12,000 tokens × $3/1M = $0.036
- Optimized: 4,300 tokens × $3/1M = $0.013
- **Saved**: $0.023 per conversation (64%)

**Per month (100 conversations)**:
- Current: $3.60
- Optimized: $1.29
- **Saved**: $2.31/month (64%)

---

## Benefits

### 1. Token Reduction
- **71% smaller** CLAUDE.md (863→248 words)
- **850 tokens saved** per prompt
- **64% savings** in typical workflows

### 2. Progressive Disclosure
- Core rules always visible
- Details loaded only when needed
- Official Claude Code pattern

### 3. Maintainability
- Detailed docs in dedicated skills
- Easy to update specific topics
- Clear separation of concerns

### 4. Performance
- Faster prompt processing (less to parse)
- Lower costs per conversation
- Better context budget management

---

## Comparison: Before vs After

### Before (Current)

**CLAUDE.md**: 863 words, 1200 tokens
- Project overview + detailed workflow
- 8 context rules + examples + code
- Orchestration patterns + code + examples
- Skills list + descriptions
- Hooks + monitoring details
- Prerequisites + comparison table
- File references

**Loaded**: Every single prompt

### After (Optimized)

**CLAUDE.md**: 248 words, 350 tokens
- Project overview (concise)
- 7 critical rules (no examples)
- Skills list (names only)
- Quick reference (4 rules)
- Pointers to detailed docs

**Loaded**: Every single prompt

**Skills** (loaded on-demand):
- `/context-optimization`: 800 tokens (when needed)
- `/orchestration-guide`: 1000 tokens (when needed)

---

## Verification

### Test Plan

1. **Backup current**
   ```bash
   cp CLAUDE.md CLAUDE.md.backup
   ```

2. **Replace with minimal**
   ```bash
   cp CLAUDE.md.minimal CLAUDE.md
   ```

3. **Test core workflows**
   - Simple task (should work with just minimal)
   - Context question (invoke `/context-optimization`)
   - Orchestration question (invoke `/orchestration-guide`)

4. **Verify token reduction**
   ```bash
   /cost  # Check token usage
   ```

5. **If issues**
   ```bash
   cp CLAUDE.md.backup CLAUDE.md  # Rollback
   ```

---

## Rollback Plan

```bash
# If minimal version causes issues
cp CLAUDE.md.backup CLAUDE.md

# Or keep both
mv CLAUDE.md CLAUDE.md.minimal
mv CLAUDE.md.backup CLAUDE.md
```

Skills remain available regardless of CLAUDE.md version.

---

## Recommendation

**Implement Option A: Direct Replace**

Rationale:
1. 71% token reduction is significant
2. Skills preserve all functionality
3. Official Claude Code pattern
4. Easy rollback if needed
5. Immediate cost savings

**Command**:
```bash
cp CLAUDE.md CLAUDE.md.backup && cp CLAUDE.md.minimal CLAUDE.md
```

---

## Next Steps

1. Review `CLAUDE.md.minimal` content
2. Backup current `CLAUDE.md`
3. Replace with minimal version
4. Test with real conversations
5. Monitor token usage with `/cost`
6. Adjust if needed

Skills are ready and functional regardless of which CLAUDE.md you use.

---

## Summary

**Change**: Move detailed patterns from CLAUDE.md to on-demand skills

**Method**: Official Claude Code progressive disclosure

**Result**: 71% token reduction (850 tokens saved per prompt)

**Cost**: 64% savings in typical workflows

**Risk**: Low (easy rollback, skills preserve functionality)

**Recommendation**: Implement immediately
