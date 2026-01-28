# .claude Documentation Structure

**Status**: ✅ Implemented (2026-01-19)
**Pattern**: Official Claude Code structure

---

## Structure

```
.claude/
├── README.md                  # Main entry point
├── settings.json              # Configuration
│
├── agents/                    # Custom AI agents (3 agents)
│   ├── cost-optimizer.md
│   ├── deep-reviewer.md
│   └── quick-reviewer.md
│
├── commands/                  # Slash commands (future)
│   └── (ready for commands)
│
├── skills/                    # Domain knowledge (68 skills)
│   ├── commit-standard/
│   ├── code-review/
│   ├── ui-ux-pro-max/
│   └── ...
│
├── scripts/                   # Automation scripts (15 scripts)
│   ├── status-line-with-pricing.sh
│   ├── protect-sensitive-files.py
│   └── ...
│
├── templates/                 # Code templates
│
└── docs/                      # 📚 ALL DOCUMENTATION HERE
    ├── README.md              # Navigation index
    │
    ├── optimizations/         # Cost & performance (7 files)
    │   ├── README.md
    │   ├── build-mode.md           ⭐ Code-only output (75% savings)
    │   ├── context-management.md   Complete guide
    │   ├── prompt-caching.md       How caching works
    │   ├── quick-reference.md      ⭐ One-page cheat sheet
    │   ├── the-truth.md            Reality check on optimizations
    │   └── tool-caching.md         Tool result caching
    │
    ├── orchestration/         # Background agents (3 files)
    │   ├── README.md
    │   ├── patterns.md             ⭐ 5 core patterns
    │   ├── examples.md             Real-world use cases
    │   └── implementation.md       How to implement
    │
    ├── hooks/                 # Hook configuration (2 files)
    │   ├── README.md
    │   ├── analysis.md             All 15 hooks analyzed
    │   └── recommendations.md      What to keep/remove
    │
    ├── guides/                # How-to guides (1 file)
    │   ├── README.md
    │   └── workflow.md             Daily workflow
    │
    └── history/               # Historical docs (8 files)
        ├── README.md
        └── ... (previous optimization attempts)
```

---

## Rules for Future Documentation

### When Creating New .md Files

1. **NEVER** create .md files in `.claude/` root
2. **ALWAYS** create in organized folders:
   ```
   .claude/docs/
   ├── optimizations/  # Cost/performance optimization
   ├── orchestration/  # Background agent patterns
   ├── hooks/          # Hook configuration
   ├── guides/         # How-to guides
   └── history/        # Historical/deprecated docs
   ```

3. **Choose the right category**:
   - **optimizations/**: Reducing costs, tokens, improving performance
   - **orchestration/**: Background agents, parallel execution
   - **hooks/**: Hook configuration, automation
   - **guides/**: Step-by-step how-to guides
   - **history/**: Old docs kept for reference

4. **Update the index**: Add link to folder's `README.md`

5. **Use kebab-case**: `rate-limiting.md`, not `RateLimiting.md`

### Example: Adding New Guide

```bash
# 1. Create file in appropriate folder
cat > .claude/docs/optimizations/rate-limiting.md <<'EOF'
# Rate Limiting Optimization

Guide for implementing rate limiting...
EOF

# 2. Update index
# Add to .claude/docs/optimizations/README.md:
# 7. **[Rate Limiting](./rate-limiting.md)** - Implement rate limits

# 3. Reference in CLAUDE.md if needed
# Add to CLAUDE.md Details section if it's a core guide
```

---

## Benefits of This Structure

### ✅ Official Pattern Compliance

Follows [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase):
- agents/
- commands/
- skills/
- scripts/
- Clear separation of concerns

### ✅ Easy Navigation

```
Want optimization tips? → .claude/docs/optimizations/
Want orchestration patterns? → .claude/docs/orchestration/
Want hook config? → .claude/docs/hooks/
```

Every folder has README.md index.

### ✅ Context Efficiency

**CLAUDE.md references**:
```markdown
- Quick ref: `.claude/docs/optimizations/quick-reference.md`
- Optimizations: `.claude/docs/optimizations/`
```

Shorter paths, clearer purpose.

### ✅ Version Control Friendly

```
docs/
  optimizations/    # Active - frequently updated
  orchestration/    # Active - frequently updated
  history/          # Rarely changes
```

Git diffs show actual changes, not scattered files.

### ✅ Scalable

```
docs/
  optimizations/    # Can add more optimization guides
  orchestration/    # Can add more patterns
  testing/          # NEW - when needed
  deployment/       # NEW - when needed
```

Easy to grow without clutter.

---

## Quick Reference

### Find Documentation

```bash
# Browse all docs
ls .claude/docs/

# Browse specific category
ls .claude/docs/optimizations/

# Read index
cat .claude/docs/README.md
cat .claude/docs/optimizations/README.md
```

### Add New Documentation

```bash
# 1. Choose category
CATEGORY="optimizations"  # or orchestration, hooks, guides

# 2. Create file
echo "# My Guide" > .claude/docs/$CATEGORY/my-guide.md

# 3. Update index
# Edit .claude/docs/$CATEGORY/README.md and add link
```

### Update CLAUDE.md

Only add to CLAUDE.md "Details" section if it's a **core reference** that users need frequently.

Most docs don't need to be in CLAUDE.md - they're accessible via `.claude/docs/README.md`.

---

## Statistics

- **Total .md files**: 26
- **Organized folders**: 5 (optimizations, orchestration, hooks, guides, history)
- **Files in .claude root**: 1 (README.md only)
- **Index files**: 6 (main + 5 folders)

---

## Migration History

**Before** (messy):
```
.claude/
├── ACTIVE_OPTIMIZATIONS.md
├── ADVANCED_OPTIMIZATIONS.md
├── BUILD_MODE_OPTIMIZATION.md
├── ... (17 more scattered files)
```

**After** (organized):
```
.claude/
├── README.md
└── docs/
    ├── optimizations/ (7 files)
    ├── orchestration/ (3 files)
    ├── hooks/ (2 files)
    ├── guides/ (1 file)
    └── history/ (8 files)
```

**Commit**: `71414ba` - Reorganize .claude documentation into structured folders

---

## Sources

- [Official Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) - Comprehensive example
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)

---

## Summary

✅ Official structure implemented
✅ 26 files organized into 5 categories
✅ Each folder has navigation index
✅ CLAUDE.md updated with new paths
✅ Rules documented for future files
✅ Committed and ready to use

**Result**: Clean, organized, scalable documentation structure.
