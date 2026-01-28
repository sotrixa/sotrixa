# Background Agents & Orchestration

Run multiple agents in parallel while main conversation stays active.

## Guides

1. **[Patterns](./patterns.md)** - 5 core orchestration patterns ⭐
2. **[Examples](./examples.md)** - Real-world use cases
3. **[Implementation](./implementation.md)** - How to implement

## Quick Start

Use `run_in_background: true` on Task tool:

```javascript
Task(subagent_type="Explore", prompt="...", run_in_background=true)
Task(subagent_type="Bash", prompt="...", run_in_background=true)
Task(subagent_type="Plan", prompt="...", run_in_background=true)
```

**Benefits**:
- Main conversation stays active
- 60-80% faster execution
- Context stays lean (agents isolated)

## Use Cases

- Long codebase exploration
- Build + test + lint in parallel
- Independent research tasks
- Multi-phase workflows
