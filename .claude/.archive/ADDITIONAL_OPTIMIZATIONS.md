# Additional Optimizations from Official Claude Code Documentation

Based on [official Claude Code documentation](https://code.claude.com/docs), here are additional optimizations we can implement.

## ✅ Already Implemented

1. **Status line** - Real-time context/cache monitoring (`.claude/status-line-with-pricing.sh`)
2. **Stop hook** - Token usage tracking to CSV (`.claude/log-context-usage.sh`)
3. **Cost dashboard** - Comprehensive cost analysis (`.claude/cost-dashboard.sh`)
4. **PreToolUse hooks** - Command logging and file protection
5. **PostToolUse hooks** - Auto-formatting for JS/TS files
6. **CLAUDE.md** - Project instructions and context
7. **Forked context skills** - `/commit-standard` and `/code-review` using separate contexts

## 🚀 High-Impact Optimizations to Implement

### 1. Auto-Compaction Configuration
**Current**: Default ~95% context threshold
**Optimization**: Lower threshold for earlier compaction

```bash
# Add to .claude/settings.json env section
export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50
```

**Impact**: Prevents context from growing too large, saves 20-30% tokens in long sessions

---

### 2. Extended Thinking Budget Control
**Current**: Default 31,999 tokens for thinking
**Optimization**: Lower for cost-conscious work, higher for complex reasoning

```json
{
  "env": {
    "MAX_THINKING_TOKENS": "10000"
  }
}
```

**When to use**:
- `MAX_THINKING_TOKENS=0` - Disable for simple tasks (max cost savings)
- `MAX_THINKING_TOKENS=10000` - Balanced for normal work
- `MAX_THINKING_TOKENS=31999` - Full budget for complex reasoning

**Impact**: 10-40% cost reduction on simple tasks

---

### 3. Model-Specific Optimization (opusplan)
**Current**: Likely using sonnet consistently
**Optimization**: Use `opusplan` model alias

```bash
/model opusplan
```

**Behavior**:
- **Plan mode**: Uses Opus for architecture/reasoning
- **Execution mode**: Switches to Sonnet for code generation

**Impact**: 30-50% cost savings while maintaining quality for complex tasks

---

### 4. Haiku for Background Operations
**Current**: Probably using Sonnet for all operations
**Optimization**: Explicitly set Haiku for lightweight tasks

```json
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-3-5-haiku-20241022"
  }
}
```

**Use cases**:
- Commit message generation (already done via `/commit-standard`)
- File suggestions
- Quick searches
- Simple edits

**Impact**: 5-10% cost reduction on background operations

---

### 5. Disable Background Tasks When Not Needed
**Current**: Background tasks enabled
**Optimization**: Disable for focused sessions

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_BACKGROUND_TASKS": "1"
  }
}
```

**When to disable**:
- Short sessions
- Cost-sensitive work
- When `/resume` feature isn't needed

**Impact**: $0.02-0.04 per session savings

---

### 6. OpenTelemetry Monitoring (Team/Enterprise)
**Current**: No telemetry
**Optimization**: Enable comprehensive monitoring

```bash
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

**Provides**:
- Token usage by model
- Cost tracking by session
- Tool usage patterns
- Performance metrics

**Setup**: Requires OpenTelemetry Collector (Docker)
**Impact**: Deep visibility into cost patterns, enables data-driven optimization

---

### 7. Modular Rules with `.claude/rules/`
**Current**: Single CLAUDE.md file
**Optimization**: Path-specific rules for targeted context

```
.claude/rules/
├── frontend.md      # Only loaded for frontend files
├── backend.md       # Only loaded for backend files
├── database.md      # Only loaded for DB files
└── testing.md       # Only loaded for test files
```

**Example path-specific rule**:
```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules
- All endpoints must include input validation
- Use standard error response format
```

**Impact**: 15-25% context reduction by loading only relevant rules

---

### 8. Output Token Limits
**Current**: Default 32,000 tokens
**Optimization**: Lower for routine work

```json
{
  "env": {
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "16000"
  }
}
```

**When to lower**:
- Routine edits and fixes
- When you don't need long explanations
- Cost-sensitive projects

**Impact**: Up to 50% cost reduction on output tokens

---

### 9. PreCompact Hook for Analysis
**Current**: No pre-compact analysis
**Optimization**: Analyze what's being compacted

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Compacting at $(jq -r '.context_window.used_percentage')%\" >> .claude/compact-log.txt"
          }
        ]
      }
    ]
  }
}
```

**Impact**: Understand compaction patterns, tune `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`

---

### 10. SessionStart/SessionEnd Hooks
**Current**: Only Stop hook tracking
**Optimization**: Track full session lifecycle

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Session started: $(jq -r '.session_id')\" >> .claude/session-analytics.log"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/generate-session-report.sh"
          }
        ]
      }
    ]
  }
}
```

**Impact**: Per-session cost reports, session analytics

---

### 11. Bash Output Limits
**Current**: Default limits
**Optimization**: Reduce output token consumption

```json
{
  "env": {
    "BASH_MAX_OUTPUT_LENGTH": "25000",
    "BASH_DEFAULT_TIMEOUT_MS": "30000"
  }
}
```

**Impact**: Prevents expensive operations from consuming excessive tokens

---

### 12. File Suggestion Command
**Current**: Default file suggestions
**Optimization**: Custom script for smarter suggestions

Create `.claude/file-suggestion.sh`:
```bash
#!/bin/bash
# Smart file suggestions based on recent changes
git diff --name-only HEAD~5..HEAD | head -20
```

Configure:
```json
{
  "fileSuggestion": {
    "type": "command",
    "command": ".claude/file-suggestion.sh"
  },
  "respectGitignore": true
}
```

**Impact**: Reduces context by suggesting only relevant files

---

### 13. User-Level CLAUDE.md
**Current**: Project-level only
**Optimization**: Personal preferences across all projects

Create `~/.claude/CLAUDE.md`:
```markdown
# Personal Preferences

## Communication Style
- Be extremely concise - every token costs money
- No emojis unless requested
- Skip pleasantries

## Code Style
- Use 2-space indentation
- Prefer functional programming
- Always include error handling

## Cost Optimization
- Always use forked context for commits and reviews
- Use Task tool for codebase exploration
- Clear context proactively at 50%
```

**Impact**: Consistent behavior across projects, no need to repeat in each CLAUDE.md

---

### 14. Disable Non-Essential Model Calls
**Current**: All model calls enabled
**Optimization**: Skip "flavor text" generation

```json
{
  "env": {
    "DISABLE_NON_ESSENTIAL_MODEL_CALLS": "1"
  }
}
```

**Impact**: 5-10% cost reduction by skipping non-critical API calls

---

### 15. MCP Tool Search Optimization
**Current**: Default tool loading
**Optimization**: Lazy load tools based on context

```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "auto:5"
  }
}
```

**Impact**: Only load tools when context drops below 5%, saves context in early conversation

---

## 📊 Expected Cumulative Impact

Implementing all high-impact optimizations:

| Category | Current Cost | Optimized Cost | Savings |
|----------|-------------|----------------|---------|
| Context Management | $6/day | $3.50/day | 42% |
| Model Selection | - | - | 30% on complex tasks |
| Background Tasks | $0.04/session | $0.00/session | 100% |
| Output Tokens | - | - | 25% on routine work |
| **Total Estimated** | **$120-200/mo** | **$60-100/mo** | **40-50%** |

## 🎯 Recommended Implementation Priority

### Immediate (< 5 minutes)
1. Set `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=50`
2. Set `MAX_THINKING_TOKENS=10000`
3. Use `/model opusplan` for complex work
4. Set `DISABLE_NON_ESSENTIAL_MODEL_CALLS=1`

### Short-term (< 30 minutes)
5. Implement PreCompact hook
6. Set output token limits
7. Create user-level `~/.claude/CLAUDE.md`
8. Configure bash output limits

### Medium-term (< 2 hours)
9. Migrate to `.claude/rules/` structure
10. Implement SessionStart/SessionEnd hooks
11. Create file suggestion script
12. Configure MCP tool search

### Long-term (Team/Enterprise)
13. Set up OpenTelemetry monitoring
14. Create comprehensive session analytics
15. Implement team-wide cost dashboards

## 📝 Configuration Template

Complete optimized `settings.json`:

```json
{
  "model": "sonnet",
  "env": {
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "16000",
    "BASH_MAX_OUTPUT_LENGTH": "25000",
    "BASH_DEFAULT_TIMEOUT_MS": "30000",
    "DISABLE_NON_ESSENTIAL_MODEL_CALLS": "1",
    "ENABLE_TOOL_SEARCH": "auto:5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-3-5-haiku-20241022"
  },
  "fileSuggestion": {
    "type": "command",
    "command": ".claude/file-suggestion.sh"
  },
  "respectGitignore": true,
  "statusLine": {
    "type": "command",
    "command": ".claude/status-line-with-pricing.sh"
  },
  "hooks": {
    "PreToolUse": [
      {
        "comment": "Log all bash commands",
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"[\" + (now | strftime(\"%Y-%m-%d %H:%M:%S\")) + \"] \" + .tool_input.command + \" - \" + (.tool_input.description // \"No description\")' >> .claude/bash-commands.log"
          }
        ]
      },
      {
        "comment": "Protect sensitive files",
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; data=json.load(sys.stdin); path=data.get('tool_input',{}).get('file_path',''); protected=['.env', '.env.local', 'package-lock.json', '.git/', 'node_modules/']; sys.exit(2 if any(p in path for p in protected) else 0)\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "comment": "Auto-format files",
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -qE '\\.(js|ts|jsx|tsx)$'; then npx prettier --write \"$file_path\" 2>/dev/null || true; fi; }"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "comment": "Log compaction events",
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Compacting at $(jq -r '.context_window.used_percentage')%\" >> .claude/compact-log.txt"
          }
        ]
      }
    ],
    "Stop": [
      {
        "comment": "Track context usage",
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/log-context-usage.sh"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "comment": "Log session start",
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[$(date)] Session started: $(jq -r '.session_id')\" >> .claude/session.log"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "comment": "Generate session report",
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/cost-dashboard.sh > .claude/last-session-report.txt 2>&1"
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Read:**",
      "Grep:**",
      "Glob:**",
      "Bash:git status",
      "Bash:git diff",
      "Bash:git log",
      "Bash:npm install",
      "Bash:npm test",
      "Bash:ls *"
    ]
  }
}
```

## 🔗 References

- [Official Cost Guide](https://code.claude.com/docs/en/costs)
- [Memory Management](https://code.claude.com/docs/en/memory)
- [Hooks Guide](https://code.claude.com/docs/en/hooks-guide)
- [Model Configuration](https://code.claude.com/docs/en/model-config)
- [Monitoring & Usage](https://code.claude.com/docs/en/monitoring-usage)
- [Settings Reference](https://code.claude.com/docs/en/settings)

## 💡 Next Steps

1. Review this document with team
2. Implement immediate optimizations (5 min)
3. Test and measure impact using cost dashboard
4. Roll out short-term optimizations
5. Plan medium/long-term implementation
6. Document learnings in `progress.txt` for Ralph

---

**Remember**: Every optimization compounds. Start with quick wins, measure impact, then implement more complex optimizations.
