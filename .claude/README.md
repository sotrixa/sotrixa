# Claude Code Configuration

Configuration for Dikrasin.bg project.

## Structure

```
.claude/
├── settings.json              # Main config
├── settings.local.json        # Local overrides (gitignored)
├── README.md                  # This file
├── skills/                    # Custom skills
├── agents/                    # Custom agents
├── scripts/                   # Hook scripts
├── templates/                 # Templates
├── *.log, *.csv, *.txt        # Runtime logs (gitignored)
└── .archive/                  # Old docs (gitignored)
```

**What goes where:**
- **Root files**: Config (settings.json), runtime logs
- **scripts/**: Shell scripts used by hooks
- **skills/**: Custom skills (23 installed)
- **agents/**: Custom agents (3 installed)
- **.archive/**: Old documentation and unused scripts

## Skills

Custom skills in `skills/`:
- `/commit-standard` - Conventional commits (forked context, Haiku)
- `/code-review` - Code review + TS best practices (forked context, Explore agent)
- `/project-standards` - Project coding standards
- `/docs-write` - Documentation (Diátaxis framework)
- `/skill-lookup` - Discover/install skills
- `/react-best-practices` - React/Next.js optimization
- `/ui-ux-pro-max` - UI/UX design intelligence
- `/architecture-patterns` - Clean/Hexagonal/DDD patterns

**Forked context** = Runs separately, doesn't bloat main conversation

[Skills documentation](https://code.claude.com/docs/en/skills)

## Hooks

Active hooks in `settings.json`:

**PreToolUse:**
- Bash command logging → `bash-commands.log`
- File protection (`.env`, `package-lock.json`, etc.)
- Production branch protection (blocks writes on main/master/production)

**PostToolUse:**
- Auto-format with Prettier
- Dependency change alerts → `alerts.log`
- Test failure analysis → `test-failures.log`
- Background agent monitoring → `background-agents.log`

**UserPromptSubmit/Stop:**
- Session tracking → `session.log`
- Context usage tracking → `context-usage.csv`

**Notification:**
- High-cost operation alerts → `alerts.log`

**SubagentStop:**
- Subagent cost tracking → `subagent-costs.csv`

**SessionStart:**
- Token budget initialization → `session-budget.txt`

[Hooks guide](https://code.claude.com/docs/en/hooks-guide)

## Status Line

Bottom of terminal shows real-time metrics:
```
[Sonnet 4.5] Context: 42% 💚 | Cache: 85% 💚
```

**Thresholds:**
- 💚 < 50%: Good
- 💛 50-80%: Warning
- 🔴 > 80%: Use `/clear`

## Context Optimization

**5 golden rules:**

1. **Use Task/Explore for "where is X?" queries** - Saves 60-80% context
2. **Be concise** - "Explain file.ts" not paragraphs
3. **Use forked context skills** - `/code-review` runs separately
4. **Use `/clear` after tasks** - Don't let context bloat
5. **Use Ralph for long work** - Multi-story autonomous execution

**Cost impact:**
```
Without: 150K tokens @ $0.45
With:    15K tokens  @ $0.04
         ↓
         11x cheaper
```

## Orchestration Patterns

**Official Claude Code feature**: Background subagent execution

**Pattern**: Main thread orchestrates, subagents execute in parallel

```javascript
// Launch 3 agents in parallel
Task(subagent_type="Explore", prompt="Find auth patterns", run_in_background=true)
Task(subagent_type="Bash", prompt="npm test", run_in_background=true)
Task(subagent_type="Plan", prompt="Plan migration", run_in_background=true)

// Main thread stays active, continues work
// Check progress: Read(file_path="/tmp/output_file")
// Retrieve results: TaskOutput(task_id="task-123", block=false)
```

**Benefits**:
- Main conversation stays active (no blocking)
- 60-80% faster execution (parallel)
- Context stays lean (agents isolated)
- Cost-optimized (only final results in main thread)

**Monitor**: `./claude/scripts/monitor-background-agents.sh`

**Full guide**: `.claude/ORCHESTRATION.md`

## Logs (Gitignored)

- `bash-commands.log` - Command audit trail
- `session.log` - Session activity
- `context-usage.csv` - Context tracking
- `last-session-report.txt` - Session summary
- `compact-log.txt` - Compact log
- `alerts.log` - **NEW**: Consolidated alerts (cost, dependencies, tests)
- `test-failures.log` - **NEW**: Test failure details
- `subagent-costs.csv` - **NEW**: Subagent cost tracking
- `session-budget.txt` - **NEW**: Per-session token budget
- `background-agents.log` - **NEW**: Background subagent launches

All `.log`, `.csv`, and `.txt` files are gitignored.

## Complete Optimization Suite

**Status**: ✅ 20+ optimizations active (2026-01-18)
- Budget soft warnings (not hard stops)
- Production branch protection
- Subagent cost tracking
- Tool result caching
- Test failure analysis
- Dependency change alerts
- Smart model routing (Haiku/Sonnet)
- Auto-suggest optimizations
- Cost dashboard & analysis

**See `.claude/COMPLETE_OPTIMIZATION_GUIDE.md` for full guide**

**Cost reduction**: 90% (from $360/year to $36/year at 1,500 req/month)

## Resources

- [Skills documentation](https://code.claude.com/docs/en/skills)
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide)
- [Best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- Project workflow: `DEVELOPMENT.md`
- Project guidance: `CLAUDE.md`
- **Complete optimization guide**: `COMPLETE_OPTIMIZATION_GUIDE.md` ⭐
- Production optimizations: `PRODUCTION_OPTIMIZATIONS.md`
- Context management: `CONTEXT_MANAGEMENT.md`
