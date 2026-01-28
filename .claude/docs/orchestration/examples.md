# Orchestration Examples

Real-world examples using official Claude Code background execution.

---

## Example 1: Parallel Code Review

**Scenario**: Review entire codebase in parallel

```javascript
// Launch 3 reviewers simultaneously (single message)
Task({
  subagent_type: "code-reviewer",
  prompt: "Review all authentication code in src/auth/*",
  description: "Review auth code",
  run_in_background: true
})

Task({
  subagent_type: "code-reviewer",
  prompt: "Review all API endpoints in src/api/*",
  description: "Review API code",
  run_in_background: true
})

Task({
  subagent_type: "code-reviewer",
  prompt: "Review all database code in src/db/*",
  description: "Review DB code",
  run_in_background: true
})

// Each returns: { output_file: "/tmp/agent-xyz.txt" }
// Main thread continues - answer user questions, plan next steps
// Check progress after 2-3 minutes:
Read(file_path="/tmp/agent-1.txt")
Read(file_path="/tmp/agent-2.txt")
Read(file_path="/tmp/agent-3.txt")
```

**Time savings**: 3x faster than sequential review

---

## Example 2: Build Pipeline

**Scenario**: Run build, test, lint in parallel

```javascript
// Launch all in parallel
Task({
  subagent_type: "Bash",
  prompt: "Run npm run build",
  description: "Build project",
  run_in_background: true
})

Task({
  subagent_type: "Bash",
  prompt: "Run npm test -- --coverage",
  description: "Run tests with coverage",
  run_in_background: true
})

Task({
  subagent_type: "Bash",
  prompt: "Run npm run lint",
  description: "Lint codebase",
  run_in_background: true
})

// Returns 3 task IDs
// Check completion without blocking:
TaskOutput(task_id="build-123", block=false)
TaskOutput(task_id="test-456", block=false)
TaskOutput(task_id="lint-789", block=false)

// Or wait for specific task:
TaskOutput(task_id="test-456", block=true, timeout=60000)
```

**Time savings**: Run in parallel instead of 10+ minutes sequential

---

## Example 3: Research + Implementation

**Scenario**: Research patterns while implementing

```javascript
// Launch background research
Task({
  subagent_type: "Explore",
  prompt: "How do we handle authentication? Find all auth middleware, guards, and session management",
  description: "Research auth patterns",
  run_in_background: true
})

// Main thread starts implementation based on existing knowledge
// Write initial auth endpoint structure
Write(file_path="src/api/auth.ts", content="...")

// Research completes - retrieve findings
TaskOutput(task_id="research-123", block=true, timeout=30000)

// Incorporate research findings into implementation
Edit(file_path="src/api/auth.ts", ...)
```

**Benefit**: Don't block implementation waiting for research

---

## Example 4: Multi-Phase Migration

**Scenario**: Migrate authentication system

```javascript
// Phase 1: Parallel research
Task({
  subagent_type: "Explore",
  prompt: "Find all current auth implementations",
  description: "Map current auth",
  run_in_background: true
})

Task({
  subagent_type: "Explore",
  prompt: "Research JWT best practices in codebase",
  description: "Research JWT patterns",
  run_in_background: true
})

// Phase 2: After research completes, plan migration
// (Retrieved via TaskOutput)

// Phase 3: Parallel implementation
Task({
  subagent_type: "Plan",
  prompt: "Plan JWT middleware implementation",
  description: "Plan middleware",
  run_in_background: true
})

Task({
  subagent_type: "Plan",
  prompt: "Plan session migration strategy",
  description: "Plan migration",
  run_in_background: true
})
```

**Benefit**: Reduce total migration time by 60-80%

---

## Example 5: Codebase Exploration

**Scenario**: Understand new codebase quickly

```javascript
// Launch 4 explorers in parallel
Task({
  subagent_type: "Explore",
  prompt: "Map the authentication flow - how does login work?",
  description: "Explore auth flow",
  run_in_background: true
})

Task({
  subagent_type: "Explore",
  prompt: "Find all API endpoints and their purpose",
  description: "Explore API structure",
  run_in_background: true
})

Task({
  subagent_type: "Explore",
  prompt: "How is the database accessed? Find ORM/query patterns",
  description: "Explore data layer",
  run_in_background: true
})

Task({
  subagent_type: "Explore",
  prompt: "Map the frontend routing and pages",
  description: "Explore frontend",
  run_in_background: true
})

// Check progress periodically:
tail -f /tmp/agent-auth.txt
tail -f /tmp/agent-api.txt

// Retrieve all findings when complete:
TaskOutput(task_id="auth-123", block=true)
TaskOutput(task_id="api-456", block=true)
TaskOutput(task_id="db-789", block=true)
TaskOutput(task_id="fe-101", block=true)
```

**Time savings**: 4x faster codebase onboarding

---

## Example 6: Continuous Monitoring

**Scenario**: Monitor long-running operations

```bash
# Launch long test suite
Task({
  subagent_type: "Bash",
  prompt: "npm run test:e2e -- --slow-tests",
  description: "E2E tests",
  run_in_background: true
})
# Returns: { output_file: "/tmp/e2e-tests.txt" }

# Main thread continues work
# Periodically check progress:
tail -n 20 /tmp/e2e-tests.txt

# Or check non-blocking:
TaskOutput(task_id="e2e-123", block=false)
# Returns: { status: "running", partial_output: "..." }
```

**Benefit**: Don't block on slow operations

---

## Anti-Patterns (Don't Do This)

### ❌ Blocking on background agents unnecessarily
```javascript
Task(..., run_in_background=true)
TaskOutput(task_id="...", block=true)  // Defeats the purpose!
```

**Fix**: Use `block=false` and check periodically

### ❌ Sequential background launches
```javascript
Task(..., run_in_background=true)
Task(..., run_in_background=true)
Task(..., run_in_background=true)
```
**Problem**: 3 separate messages = sequential

**Fix**: Launch all in **single message** for true parallelism

### ❌ Using background for quick tasks
```javascript
Task({
  subagent_type: "Bash",
  prompt: "ls",
  run_in_background: true  // Overkill!
})
```

**Fix**: Only use background for tasks >30s

---

## Monitoring Commands

```bash
# View all background agents
cat .claude/background-agents.log

# Monitor costs
cat .claude/subagent-costs.csv

# Live monitoring script
./.claude/scripts/monitor-background-agents.sh

# Check active tasks
/tasks  # In Claude Code CLI

# Tail specific agent output
tail -f /tmp/agent-xyz.txt
```

---

## Best Practices

1. **Launch in parallel** - Multiple Task calls in single message
2. **Check non-blocking** - Use `TaskOutput(..., block=false)`
3. **Monitor progress** - Read output files or tail logs
4. **Main thread active** - Continue work while agents run
5. **Cost tracking** - Check `.claude/subagent-costs.csv`

---

## Official Documentation

Based on Claude Code CLI features:
- Task tool `run_in_background` parameter
- TaskOutput tool for result retrieval
- Parallel execution via multiple tool calls
- Background agent isolation (no context bloat)

**Key principle**: Orchestrate strategy in main thread, delegate tactics to background agents.
