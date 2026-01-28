# Documentation Index

All Claude Code documentation organized by category.

## Active Guides

- **[Optimizations](./optimizations/)** - Cost & performance optimization
- **[Orchestration](./orchestration/)** - Background agents & parallel work
- **[Hooks](./hooks/)** - Hook configuration & analysis
- **[Guides](./guides/)** - How-to guides

## Historical

- **[History](./history/)** - Previous optimization attempts & learnings

## Quick Links

### Most Important
- [Quick Reference](./optimizations/quick-reference.md) - One-page cheat sheet ⭐
- [Build Mode](./optimizations/build-mode.md) - Reduce output costs 75% ⭐
- [Orchestration Patterns](./orchestration/patterns.md) - Background agents ⭐

### Deep Dives
- [Context Management](./optimizations/context-management.md) - Full guide
- [Prompt Caching](./optimizations/prompt-caching.md) - How caching works
- [Hook Analysis](./hooks/analysis.md) - All hooks analyzed

## Structure

```
docs/
├── optimizations/    # Cost & performance optimization
├── orchestration/    # Background agents & parallel work
├── hooks/            # Hook configuration & analysis
├── guides/           # How-to guides
└── history/          # Historical documents
```

## Adding New Documentation

When creating new .md files:

1. **Choose category**: optimizations, orchestration, hooks, guides
2. **Add to folder**: Place in appropriate `docs/{category}/`
3. **Update index**: Add link to `docs/{category}/README.md`
4. **Descriptive name**: Use `kebab-case.md` (e.g., `rate-limiting.md`)

**Example**:
```bash
# New optimization guide
echo "content" > .claude/docs/optimizations/rate-limiting.md

# Update index
# Add to .claude/docs/optimizations/README.md
```

**Never** create loose .md files in `.claude/` root.
