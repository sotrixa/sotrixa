---
name: orchestration-guide
description: Background agent orchestration patterns using official Claude Code run_in_background feature. Use when launching parallel agents or optimizing execution workflows.
---

# Orchestration Guide

**Official Claude Code feature**: Background subagent execution for parallel work.

## Core Concept

Main thread orchestrates strategy, background agents execute tactics in parallel.

**Key principle**: Launch agents with `run_in_background: true` → Main conversation stays active while agents work independently.

## Official Features

### 1. run_in_background Parameter
```javascript
Task({
  subagent_type: "Explore",
  prompt: "Find authentication patterns",
  description: "Auth research",
  run_in_background: true  // ← Key parameter
})
```

**Returns**: `{ output_file: "/tmp/agent-xyz.txt" }`
**Result**: Agent runs in background, main thread continues

### 2. TaskOutput Tool
```javascript
// Non-blocking check
TaskOutput(task_id="task-123", block=false)
// Returns: { status: "running", partial_output: "..." }

// Blocking retrieval (wait for completion)
TaskOutput(task_id="task-123", block=true, timeout=30000)
// Returns: { status: "completed", output: "..." }
```

### 3. Parallel Launches
```javascript
// Single message with multiple Task calls = TRUE parallel
Task(subagent_type="Explore", prompt="...", run_in_background=true)
Task(subagent_type="Bash", prompt="...", run_in_background=true)
Task(subagent_type="Plan", prompt="...", run_in_background=true)
```

**Critical**: All in ONE message for parallel execution.

### 4. Progress Monitoring
```bash
# Read output file (non-blocking)
Read(file_path="/tmp/agent-xyz.txt")

# Live tail
tail -f /tmp/agent-xyz.txt

# Check without blocking
TaskOutput(task_id="task-123", block=false)
```

## 5 Core Patterns

### Pattern 1: Independent Parallel Work
```javascript
// Launch 3 independent agents
Task(subagent_type="Explore", prompt="Find auth patterns", run_in_background=true)
Task(subagent_type="Explore", prompt="Find API structure", run_in_background=true)
Task(subagent_type="Explore", prompt="Find data layer", run_in_background=true)

// Main thread continues - answer questions, plan, implement
// Check progress later: Read(file_path="/tmp/output")
```

**Use case**: Codebase exploration, parallel research
**Time savings**: 3x faster

### Pattern 2: Build Pipeline
```javascript
// Parallel build, test, lint
Task(subagent_type="Bash", prompt="npm run build", run_in_background=true)
Task(subagent_type="Bash", prompt="npm test", run_in_background=true)
Task(subagent_type="Bash", prompt="npm run lint", run_in_background=true)

// Check completion
TaskOutput(task_id="build-123", block=false)
TaskOutput(task_id="test-456", block=false)
TaskOutput(task_id="lint-789", block=false)
```

**Use case**: CI/CD pipelines
**Time savings**: Run in parallel vs 10+ min sequential

### Pattern 3: Research + Implementation
```javascript
// Launch background research
Task(subagent_type="Explore", prompt="How do we handle auth?", run_in_background=true)

// Main thread starts implementation based on existing knowledge
Write(file_path="src/api/auth.ts", content="...")

// Retrieve research when ready
TaskOutput(task_id="research-123", block=true, timeout=30000)

// Incorporate findings
Edit(file_path="src/api/auth.ts", ...)
```

**Use case**: Don't block implementation on research
**Benefit**: Work continues while research runs

### Pattern 4: Multi-Phase Migration
```javascript
// Phase 1: Parallel research
Task(subagent_type="Explore", prompt="Current auth impl", run_in_background=true)
Task(subagent_type="Explore", prompt="JWT patterns", run_in_background=true)

// Phase 2: After research, parallel planning
Task(subagent_type="Plan", prompt="JWT middleware", run_in_background=true)
Task(subagent_type="Plan", prompt="Session migration", run_in_background=true)

// Phase 3: Implementation
```

**Use case**: Complex migrations
**Time savings**: 60-80% reduction

### Pattern 5: Continuous Monitoring
```bash
# Launch long operation
Task(subagent_type="Bash", prompt="npm run test:e2e", run_in_background=true)

# Main thread continues
# Check periodically: tail -n 20 /tmp/e2e-tests.txt
# Or: TaskOutput(task_id="e2e-123", block=false)
```

**Use case**: Long-running operations
**Benefit**: Don't block on slow tasks

## Real-World Examples

### Example 1: Parallel Code Review
```javascript
// Review entire codebase in parallel
Task(subagent_type="code-reviewer", prompt="Review src/auth/*", run_in_background=true)
Task(subagent_type="code-reviewer", prompt="Review src/api/*", run_in_background=true)
Task(subagent_type="code-reviewer", prompt="Review src/db/*", run_in_background=true)

// Main: answer user questions, plan next steps
// Check after 2-3 min: Read each output file
```

### Example 2: Codebase Onboarding
```javascript
// 4 explorers in parallel
Task(subagent_type="Explore", prompt="Map auth flow", run_in_background=true)
Task(subagent_type="Explore", prompt="Find API endpoints", run_in_background=true)
Task(subagent_type="Explore", prompt="Database access patterns", run_in_background=true)
Task(subagent_type="Explore", prompt="Frontend routing", run_in_background=true)

// 4x faster onboarding
```

## When to Use Background Agents

### ✅ Use background for:
- Long codebase exploration (>30s)
- Build + test + lint in parallel
- Independent research tasks
- Multi-phase workflows
- Long-running operations

### ❌ Don't use background for:
- Quick tasks (<30s)
- Tasks needing immediate result
- Sequential dependencies
- Interactive decisions

## Best Practices

1. **Launch in parallel** - Multiple Task calls in single message
2. **Check non-blocking** - Use `TaskOutput(..., block=false)`
3. **Monitor progress** - Read output files or tail logs
4. **Main thread active** - Continue work while agents run
5. **Cost tracking** - Check `.claude/subagent-costs.csv`

## Anti-Patterns

### ❌ Blocking unnecessarily
```javascript
Task(..., run_in_background=true)
TaskOutput(task_id="...", block=true)  // Defeats purpose!
```
**Fix**: Use `block=false`, check periodically

### ❌ Sequential launches
```javascript
Task(...)  // Message 1
Task(...)  // Message 2
Task(...)  // Message 3
```
**Fix**: All in ONE message for true parallelism

### ❌ Background for quick tasks
```javascript
Task(subagent_type="Bash", prompt="ls", run_in_background=true)
```
**Fix**: Only for tasks >30s

## Monitoring

### Commands
```bash
# View background agents
cat .claude/background-agents.log

# View costs
cat .claude/subagent-costs.csv

# Monitoring script
./.claude/scripts/monitor-background-agents.sh

# List active tasks
/tasks
```

### Files
- `.claude/background-agents.log` - Agent launches
- `.claude/subagent-costs.csv` - Cost tracking
- Hook in `settings.json` - Auto-logs Task tool with run_in_background

## Benefits

### Performance
- **60-80% faster** multi-task workflows
- **4x faster** codebase exploration (4 parallel agents)
- **3x faster** code reviews (3 parallel reviewers)

### Cost
- Background agents don't inflate main context
- Only final results added to main thread
- Efficient resource usage

### Workflow
- Main thread always responsive
- Continue work during long operations
- Flexible result retrieval

## Related Documentation

- `.claude/ORCHESTRATION.md` - Complete patterns
- `.claude/ORCHESTRATION_EXAMPLES.md` - 6 examples
- `/context-optimization` - Context management
- `CLAUDE.md` - Quick reference

## Quick Cheatsheet

```javascript
// LAUNCH
Task(subagent_type="Explore", prompt="...", run_in_background=true)

// CHECK PROGRESS
Read(file_path="/tmp/output")           // Non-blocking
tail -f /tmp/output                      // Live
TaskOutput(task_id="...", block=false)   // Status

// RETRIEVE
TaskOutput(task_id="...", block=true, timeout=30000)  // Wait

// MONITOR
cat .claude/background-agents.log
./.claude/scripts/monitor-background-agents.sh
```

**Remember**: Orchestrate strategy in main thread, delegate tactics to background agents.
