# Claude Code Orchestration Patterns

**Based on Official Claude Code Documentation**

## Core Concept

Launch multiple subagents in parallel with `run_in_background: true`. Main conversation continues while subagents execute independently.

## Official Features Used

1. **Task tool with `run_in_background: true`** - Returns `output_file` path immediately
2. **TaskOutput tool** - Retrieve results from background tasks
3. **Parallel launches** - Multiple Task calls in single message
4. **Read tool / Bash tail** - Check progress without blocking

---

## Pattern 1: Launch Multiple Background Agents

**Use case**: Independent tasks (research + build + test)

```javascript
// Single message with 3 Task calls:
Task(subagent_type="Explore", prompt="Find authentication patterns", run_in_background=true)
Task(subagent_type="Bash", prompt="Run npm test", run_in_background=true)
Task(subagent_type="Plan", prompt="Plan DB migration", run_in_background=true)
```

**Result**: 3 agents run in parallel, main thread free

---

## Pattern 2: Check Progress Without Blocking

**Non-blocking check**:
```bash
# Read current output
Read(file_path="/path/to/output_file")

# Live tail (shows updates)
tail -f /path/to/output_file

# Check if task completed
TaskOutput(task_id="task-123", block=false, timeout=1000)
```

---

## Pattern 3: Wait for Completion

**Blocking retrieval**:
```javascript
TaskOutput(task_id="task-123", block=true, timeout=30000)
```

Use when you need result before continuing.

---

## Pattern 4: Orchestration Workflow

**Main thread orchestrates, subagents execute:**

1. Launch background agents for independent work
2. Main thread handles user questions, quick tasks
3. Periodically check agent progress
4. Retrieve results when needed
5. Launch next wave of agents

**Example flow**:
```
Main: Launch 3 background research agents
Main: Answer user question about config
Main: Check agent 1 progress (Read output_file)
Main: Agent 2 complete - retrieve with TaskOutput
Main: Launch 2 more agents based on agent 2 results
Main: All agents done - synthesize findings
```

---

## Pattern 5: Cost-Optimized Parallel Execution

**When to use background agents**:

✅ **Use background**:
- Long codebase exploration (Explore agent)
- Build/test/lint in parallel
- Independent research tasks
- Multi-phase planning

❌ **Don't use background**:
- Tasks needing immediate result
- Sequential dependencies
- Interactive decisions
- Quick reads (<5 files)

---

## Implementation Guide

### Step 1: Launch Background Agent

```javascript
Task(
  subagent_type="Explore",
  prompt="Find all authentication middleware",
  description="Search auth patterns",
  run_in_background=true
)
```

**Returns**: `{ output_file: "/tmp/agent-xyz.txt" }`

### Step 2: Check Progress

```bash
# Quick check
tail -n 50 /tmp/agent-xyz.txt

# Full output
Read(file_path="/tmp/agent-xyz.txt")
```

### Step 3: Retrieve Result

```javascript
// Non-blocking
TaskOutput(task_id="task-xyz", block=false)

// Blocking (waits up to 30s)
TaskOutput(task_id="task-xyz", block=true, timeout=30000)
```

---

## Hook Integration

Background agents tracked via `SubagentStop` hook (already configured in `.claude/settings.json`).

Monitor with:
```bash
# View subagent costs
cat .claude/subagent-costs.csv

# View background agent log
cat .claude/background-agents.log
```

---

## Real-World Examples

### Example 1: Parallel Code Review
```javascript
// Launch 3 reviewers in parallel
Task(subagent_type="code-reviewer", prompt="Review auth/*", run_in_background=true)
Task(subagent_type="code-reviewer", prompt="Review api/*", run_in_background=true)
Task(subagent_type="code-reviewer", prompt="Review db/*", run_in_background=true)

// Main thread answers user questions while reviews run
// Check results after 2-3 minutes
```

### Example 2: Research + Implementation
```javascript
// Background research
Task(subagent_type="Explore", prompt="How do we handle errors?", run_in_background=true)

// Main thread starts implementation based on existing knowledge
// Incorporate research findings when agent completes
```

### Example 3: Build Pipeline
```javascript
// Parallel build steps
Task(subagent_type="Bash", prompt="npm run build", run_in_background=true)
Task(subagent_type="Bash", prompt="npm test", run_in_background=true)
Task(subagent_type="Bash", prompt="npm run lint", run_in_background=true)

// Check results after all complete
```

---

## Context Impact

**Background agents don't inflate main conversation context:**
- Each agent has isolated context
- Only final results added to main thread
- Main thread stays lean (faster, cheaper)

**Savings**: 60-80% reduction vs. serial execution in main thread

---

## Task Management

Use `/tasks` command to view all background tasks:
```bash
/tasks  # Lists active background agents with IDs
```

---

## Best Practices

1. **Launch in parallel** - Single message with multiple Task calls
2. **Don't wait unnecessarily** - Continue main work while agents run
3. **Check progress** - Use Read/tail for non-blocking updates
4. **Retrieve when needed** - TaskOutput with appropriate timeout
5. **Monitor costs** - Check `.claude/subagent-costs.csv` regularly

---

## Official Documentation Reference

Features documented in Claude Code CLI:
- Task tool `run_in_background` parameter
- TaskOutput tool for result retrieval
- Parallel execution via multiple tool calls
- Background agent isolation

**Key insight**: Main conversation orchestrates strategy, subagents execute tactics in parallel.
