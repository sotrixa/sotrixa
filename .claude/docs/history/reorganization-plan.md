# .claude Folder Reorganization Plan

**Current problem**: 20 .md files scattered in .claude root
**Solution**: Official Claude Code folder structure + organized docs

**Sources**:
- [Official Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) - Comprehensive example
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)

---

## Official Structure (From claude-code-showcase)

```
.claude/
├── agents/           # Custom AI agents
├── commands/         # Slash commands (becomes /command-name)
├── hooks/            # Hook scripts for automation
├── skills/           # Domain knowledge (becomes /skill-name)
└── rules/            # Modular instruction sets
```

---

## Our New Structure

```
.claude/
├── README.md                          # Main docs index
├── settings.json                      # Configuration (stays here)
│
├── agents/                            # ✅ Already organized
│   ├── cost-optimizer.md
│   ├── deep-reviewer.md
│   └── quick-reviewer.md
│
├── commands/                          # 🆕 NEW - Slash commands
│   └── (future commands go here)
│
├── skills/                            # ✅ Already organized (68 skills)
│   ├── commit-standard/
│   ├── code-review/
│   ├── ui-ux-pro-max/
│   └── ...
│
├── scripts/                           # ✅ Already organized
│   ├── status-line-with-pricing.sh
│   ├── protect-sensitive-files.py
│   ├── cost-dashboard.sh
│   └── ...
│
├── templates/                         # ✅ Already organized
│   └── (existing templates)
│
├── docs/                              # 🆕 NEW - All documentation here
│   ├── README.md                      # Docs navigation
│   │
│   ├── optimizations/                 # Cost & performance optimization
│   │   ├── README.md                  # Index of all optimizations
│   │   ├── build-mode.md              # BUILD_MODE_OPTIMIZATION
│   │   ├── context-management.md      # CONTEXT_MANAGEMENT
│   │   ├── prompt-caching.md          # REALITY_CHECK + TRUTH_ABOUT_OPTIMIZATIONS
│   │   ├── output-optimization.md     # OUTPUT_OPTIMIZATION
│   │   ├── quick-reference.md         # CONTEXT_QUICK_REFERENCE
│   │   └── tool-caching.md            # README-TOOL-CACHING
│   │
│   ├── orchestration/                 # Background agents & parallel work
│   │   ├── README.md                  # Index
│   │   ├── patterns.md                # ORCHESTRATION
│   │   ├── examples.md                # ORCHESTRATION_EXAMPLES
│   │   └── implementation.md          # ORCHESTRATION_IMPLEMENTATION
│   │
│   ├── hooks/                         # Hook configuration & analysis
│   │   ├── README.md                  # Index
│   │   ├── analysis.md                # HOOKS_ANALYSIS
│   │   └── recommendations.md         # HOOKS_RECONSIDERED
│   │
│   ├── guides/                        # How-to guides
│   │   ├── README.md                  # Index
│   │   └── workflow.md                # ENGINEERING_WORKFLOW_OPTIMIZATION
│   │
│   └── history/                       # Historical documents (archive)
│       ├── README.md                  # What changed and why
│       ├── active-optimizations.md    # ACTIVE_OPTIMIZATIONS
│       ├── advanced-optimizations.md  # ADVANCED_OPTIMIZATIONS
│       ├── complete-guide.md          # COMPLETE_OPTIMIZATION_GUIDE
│       ├── optimization-applied.md    # OPTIMIZATION_APPLIED
│       ├── optimization-complete.md   # OPTIMIZATION_COMPLETE
│       ├── production-optimizations.md # PRODUCTION_OPTIMIZATIONS
│       └── claude-md-optimization.md  # CLAUDE_MD_OPTIMIZATION
│
└── .archive/                          # ✅ Already exists
    └── (old deprecated files)
```

---

## File Mapping: Current → New Location

### Optimization Documents (10 files → docs/optimizations/)

1. `BUILD_MODE_OPTIMIZATION.md` → `docs/optimizations/build-mode.md`
2. `CONTEXT_MANAGEMENT.md` → `docs/optimizations/context-management.md`
3. `CONTEXT_QUICK_REFERENCE.md` → `docs/optimizations/quick-reference.md`
4. `OUTPUT_OPTIMIZATION.md` → `docs/optimizations/output-optimization.md`
5. `REALITY_CHECK.md` → `docs/optimizations/prompt-caching.md` (more descriptive name)
6. `THE_TRUTH_ABOUT_OPTIMIZATIONS.md` → merge into `prompt-caching.md` (duplicate content)
7. `README-TOOL-CACHING.md` → `docs/optimizations/tool-caching.md`

### Orchestration Documents (3 files → docs/orchestration/)

8. `ORCHESTRATION.md` → `docs/orchestration/patterns.md`
9. `ORCHESTRATION_EXAMPLES.md` → `docs/orchestration/examples.md`
10. `ORCHESTRATION_IMPLEMENTATION.md` → `docs/orchestration/implementation.md`

### Hook Documents (2 files → docs/hooks/)

11. `HOOKS_ANALYSIS.md` → `docs/hooks/analysis.md`
12. `HOOKS_RECONSIDERED.md` → `docs/hooks/recommendations.md`

### Workflow Guides (1 file → docs/guides/)

13. `ENGINEERING_WORKFLOW_OPTIMIZATION.md` → `docs/guides/workflow.md`

### Historical Documents (7 files → docs/history/)

14. `ACTIVE_OPTIMIZATIONS.md` → `docs/history/active-optimizations.md`
15. `ADVANCED_OPTIMIZATIONS.md` → `docs/history/advanced-optimizations.md`
16. `COMPLETE_OPTIMIZATION_GUIDE.md` → `docs/history/complete-guide.md`
17. `OPTIMIZATION_APPLIED.md` → `docs/history/optimization-applied.md`
18. `OPTIMIZATION_COMPLETE.md` → `docs/history/optimization-complete.md`
19. `PRODUCTION_OPTIMIZATIONS.md` → `docs/history/production-optimizations.md`
20. `CLAUDE_MD_OPTIMIZATION.md` → `docs/history/claude-md-optimization.md`

### Stays in Root

- `README.md` - Main entry point
- `settings.json` - Configuration

---

## Index Files (README.md in each folder)

### docs/README.md

```markdown
# Documentation Index

## Active Guides

- [Optimizations](./optimizations/) - Cost & performance optimization
- [Orchestration](./orchestration/) - Background agents & parallel work
- [Hooks](./hooks/) - Hook configuration & analysis
- [Guides](./guides/) - How-to guides

## Historical

- [History](./history/) - Previous optimization attempts & learnings

## Quick Links

**Most important**:
- [Quick Reference](./optimizations/quick-reference.md) - One-page cheat sheet
- [Build Mode](./optimizations/build-mode.md) - Reduce output costs 75%
- [Orchestration Patterns](./orchestration/patterns.md) - Background agents

**Deep dives**:
- [Context Management](./optimizations/context-management.md) - Full guide
- [Prompt Caching](./optimizations/prompt-caching.md) - How caching works
```

### docs/optimizations/README.md

```markdown
# Cost & Performance Optimizations

## Core Guides

1. **[Quick Reference](./quick-reference.md)** - One-page cheat sheet ⭐
2. **[Build Mode](./build-mode.md)** - Code-only output (75% savings) ⭐
3. **[Context Management](./context-management.md)** - Complete guide
4. **[Prompt Caching](./prompt-caching.md)** - How caching actually works
5. **[Output Optimization](./output-optimization.md)** - Reduce output tokens
6. **[Tool Caching](./tool-caching.md)** - Cache tool results

## Expected Savings

Following all guides: **60-80% cost reduction**
- Input: 88% savings (prompt caching)
- Output: 75% savings (build mode)
- Tools: 90% savings (tool result caching)
```

### docs/orchestration/README.md

```markdown
# Background Agents & Orchestration

## Guides

1. **[Patterns](./patterns.md)** - 5 core orchestration patterns
2. **[Examples](./examples.md)** - Real-world use cases
3. **[Implementation](./implementation.md)** - How to implement

## Quick Start

Use `run_in_background: true` on Task tool:

\`\`\`javascript
Task(subagent_type="Explore", prompt="...", run_in_background=true)
\`\`\`

**Benefits**: Main conversation stays active, 60-80% faster execution
```

### docs/hooks/README.md

```markdown
# Hook Configuration & Analysis

## Guides

1. **[Analysis](./analysis.md)** - All 15 hooks analyzed
2. **[Recommendations](./recommendations.md)** - What to keep/remove

## Summary

**Keep** (8 hooks): Automation (format, protect, alert)
**Remove** (7 hooks): Redundant logging

**Result**: 60% latency reduction, simpler maintenance
```

### docs/guides/README.md

```markdown
# How-To Guides

1. **[Workflow](./workflow.md)** - Daily development workflow with Claude Code
```

### docs/history/README.md

```markdown
# Historical Documents

Documents from previous optimization attempts and learning process.

**Why keep these?**
- Show what we tried and why
- Document evolution of understanding
- Reference for future similar projects

**Current approach**: See [../optimizations/](../optimizations/) for active guides
```

---

## Benefits of This Structure

### 1. Official Pattern Compliance

Follows [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) structure:
- ✅ agents/
- ✅ commands/ (ready for future)
- ✅ skills/
- ✅ scripts/
- ✅ Clear separation of concerns

### 2. Easy Navigation

```
Want optimization tips? → docs/optimizations/
Want orchestration patterns? → docs/orchestration/
Want hook config? → docs/hooks/
```

Every folder has README.md index.

### 3. Context Efficiency

**CLAUDE.md references**:
```markdown
- Optimizations: `.claude/docs/optimizations/quick-reference.md`
- Orchestration: `.claude/docs/orchestration/patterns.md`
```

Shorter paths, clearer purpose.

### 4. Version Control Friendly

```
docs/
  optimizations/    # Active - frequently updated
  orchestration/    # Active - frequently updated
  history/          # Rarely changes
```

Git diffs show actual changes, not scattered files.

### 5. Scalable

```
docs/
  optimizations/    # Can add more optimization guides
  orchestration/    # Can add more patterns
  testing/          # NEW - when needed
  deployment/       # NEW - when needed
```

Easy to grow without clutter.

---

## Migration Script

```bash
#!/bin/bash
# .claude/scripts/reorganize-docs.sh

set -e

echo "Creating new folder structure..."

# Create new folders
mkdir -p .claude/docs/{optimizations,orchestration,hooks,guides,history}
mkdir -p .claude/commands

# Move optimization docs
mv .claude/BUILD_MODE_OPTIMIZATION.md .claude/docs/optimizations/build-mode.md
mv .claude/CONTEXT_MANAGEMENT.md .claude/docs/optimizations/context-management.md
mv .claude/CONTEXT_QUICK_REFERENCE.md .claude/docs/optimizations/quick-reference.md
mv .claude/OUTPUT_OPTIMIZATION.md .claude/docs/optimizations/output-optimization.md
mv .claude/REALITY_CHECK.md .claude/docs/optimizations/prompt-caching.md
mv .claude/README-TOOL-CACHING.md .claude/docs/optimizations/tool-caching.md

# Move orchestration docs
mv .claude/ORCHESTRATION.md .claude/docs/orchestration/patterns.md
mv .claude/ORCHESTRATION_EXAMPLES.md .claude/docs/orchestration/examples.md
mv .claude/ORCHESTRATION_IMPLEMENTATION.md .claude/docs/orchestration/implementation.md

# Move hook docs
mv .claude/HOOKS_ANALYSIS.md .claude/docs/hooks/analysis.md
mv .claude/HOOKS_RECONSIDERED.md .claude/docs/hooks/recommendations.md

# Move workflow guide
mv .claude/ENGINEERING_WORKFLOW_OPTIMIZATION.md .claude/docs/guides/workflow.md

# Move historical docs
mv .claude/ACTIVE_OPTIMIZATIONS.md .claude/docs/history/active-optimizations.md
mv .claude/ADVANCED_OPTIMIZATIONS.md .claude/docs/history/advanced-optimizations.md
mv .claude/COMPLETE_OPTIMIZATION_GUIDE.md .claude/docs/history/complete-guide.md
mv .claude/OPTIMIZATION_APPLIED.md .claude/docs/history/optimization-applied.md
mv .claude/OPTIMIZATION_COMPLETE.md .claude/docs/history/optimization-complete.md
mv .claude/PRODUCTION_OPTIMIZATIONS.md .claude/docs/history/production-optimizations.md
mv .claude/CLAUDE_MD_OPTIMIZATION.md .claude/docs/history/claude-md-optimization.md

# Merge THE_TRUTH_ABOUT_OPTIMIZATIONS.md into prompt-caching.md
cat .claude/THE_TRUTH_ABOUT_OPTIMIZATIONS.md >> .claude/docs/optimizations/prompt-caching.md
rm .claude/THE_TRUTH_ABOUT_OPTIMIZATIONS.md

echo "✅ Reorganization complete!"
echo ""
echo "New structure:"
tree -L 2 .claude/docs
```

---

## Update CLAUDE.md References

```markdown
## Details

- Quick ref: `.claude/docs/optimizations/quick-reference.md`
- Optimizations: `.claude/docs/optimizations/`
- Orchestration: `.claude/docs/orchestration/`
- Hooks: `.claude/docs/hooks/`
- Config: `.claude/README.md`
```

---

## Implementation Steps

1. **Create folders**: `mkdir -p .claude/docs/{optimizations,orchestration,hooks,guides,history}`
2. **Create index files**: README.md in each folder
3. **Run migration script**: Move all files
4. **Update CLAUDE.md**: Fix file paths
5. **Test**: Verify all references work
6. **Commit**: `git add .claude && git commit -m "Reorganize .claude docs into structured folders"`

---

## Result: Before → After

### Before (Messy)

```
.claude/
├── ACTIVE_OPTIMIZATIONS.md
├── ADVANCED_OPTIMIZATIONS.md
├── BUILD_MODE_OPTIMIZATION.md
├── CLAUDE_MD_OPTIMIZATION.md
├── COMPLETE_OPTIMIZATION_GUIDE.md
├── CONTEXT_MANAGEMENT.md
├── CONTEXT_QUICK_REFERENCE.md
├── ENGINEERING_WORKFLOW_OPTIMIZATION.md
├── HOOKS_ANALYSIS.md
├── HOOKS_RECONSIDERED.md
├── OPTIMIZATION_APPLIED.md
├── OPTIMIZATION_COMPLETE.md
├── ORCHESTRATION.md
├── ORCHESTRATION_EXAMPLES.md
├── ORCHESTRATION_IMPLEMENTATION.md
├── PRODUCTION_OPTIMIZATIONS.md
├── README-TOOL-CACHING.md
├── README.md
├── REALITY_CHECK.md
├── THE_TRUTH_ABOUT_OPTIMIZATIONS.md
├── agents/ (3 files)
├── scripts/ (15 files)
└── skills/ (68 folders)

20 .md files scattered! Hard to navigate!
```

### After (Organized)

```
.claude/
├── README.md                  # Main entry point
├── settings.json              # Config
├── agents/                    # ✅ Organized (3 agents)
├── commands/                  # 🆕 Ready for future
├── skills/                    # ✅ Organized (68 skills)
├── scripts/                   # ✅ Organized (15 scripts)
├── templates/                 # ✅ Organized
├── docs/                      # 🆕 ALL DOCUMENTATION HERE
│   ├── README.md              # Navigation
│   ├── optimizations/         # 7 files + README
│   ├── orchestration/         # 3 files + README
│   ├── hooks/                 # 2 files + README
│   ├── guides/                # 1 file + README
│   └── history/               # 7 files + README
└── .archive/                  # Old deprecated files

Clean! Easy to navigate! Official structure!
```

---

## Sources

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) - Official example
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)

---

## Next Steps

Ready to reorganize? I can:
1. Create the folder structure
2. Create all README.md index files
3. Move all files
4. Update CLAUDE.md references
5. Test everything works

Execute now?
