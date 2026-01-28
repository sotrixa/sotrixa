#!/bin/bash
# Apply immediate cost optimizations from official Claude Code docs

set -e

SETTINGS_FILE=".claude/settings.json"
BACKUP_FILE=".claude/settings.json.backup-$(date +%Y%m%d-%H%M%S)"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       APPLY CLAUDE CODE COST OPTIMIZATIONS                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Backup existing settings
if [ -f "$SETTINGS_FILE" ]; then
    echo "📋 Backing up current settings to: $BACKUP_FILE"
    cp "$SETTINGS_FILE" "$BACKUP_FILE"
fi

# Read current settings or create new
if [ -f "$SETTINGS_FILE" ]; then
    CURRENT_SETTINGS=$(cat "$SETTINGS_FILE")
else
    CURRENT_SETTINGS='{}'
fi

echo "⚙️  Applying optimizations..."
echo ""

# Apply optimizations using jq
OPTIMIZED_SETTINGS=$(echo "$CURRENT_SETTINGS" | jq '
  # Add env section if it doesnt exist
  .env = (.env // {}) |

  # Apply immediate optimizations
  .env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE = "50" |
  .env.MAX_THINKING_TOKENS = "10000" |
  .env.CLAUDE_CODE_MAX_OUTPUT_TOKENS = "16000" |
  .env.BASH_MAX_OUTPUT_LENGTH = "25000" |
  .env.BASH_DEFAULT_TIMEOUT_MS = "30000" |
  .env.DISABLE_NON_ESSENTIAL_MODEL_CALLS = "1" |
  .env.ENABLE_TOOL_SEARCH = "auto:5" |
  .env.ANTHROPIC_DEFAULT_HAIKU_MODEL = "claude-3-5-haiku-20241022" |

  # Add file suggestion if not present
  .fileSuggestion = (.fileSuggestion // {"type": "command", "command": ".claude/file-suggestion.sh"}) |
  .respectGitignore = true |

  # Add PreCompact hook if not present
  .hooks.PreCompact = (.hooks.PreCompact // [
    {
      "comment": "Log compaction events",
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "echo \"[$(date)] Compacting at $(jq -r '\''.context_window.used_percentage'\'')%\" >> .claude/compact-log.txt"
        }
      ]
    }
  ]) |

  # Add SessionStart hook if not present
  .hooks.SessionStart = (.hooks.SessionStart // [
    {
      "comment": "Log session start",
      "matcher": "*",
      "hooks": [
        {
          "type": "command",
          "command": "echo \"[$(date)] Session started: $(jq -r '\''.session_id'\'')\" >> .claude/session.log"
        }
      ]
    }
  ]) |

  # Add SessionEnd hook if not present
  .hooks.SessionEnd = (.hooks.SessionEnd // [
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
  ])
')

# Write optimized settings
echo "$OPTIMIZED_SETTINGS" | jq '.' > "$SETTINGS_FILE"

echo "✅ Applied optimizations:"
echo ""
echo "   Context Management:"
echo "   • Auto-compact at 50% (was ~95%)"
echo "   • Thinking tokens: 10k (was 32k)"
echo "   • Output tokens: 16k (was 32k)"
echo ""
echo "   Performance:"
echo "   • Bash output limit: 25k"
echo "   • Command timeout: 30s"
echo "   • Non-essential calls: disabled"
echo "   • Tool search: lazy load at 5%"
echo ""
echo "   Hooks Added:"
echo "   • PreCompact logging"
echo "   • SessionStart tracking"
echo "   • SessionEnd reporting"
echo ""

# Create file suggestion script if it doesn't exist
if [ ! -f ".claude/file-suggestion.sh" ]; then
    echo "📝 Creating smart file suggestion script..."
    cat > .claude/file-suggestion.sh << 'EOF'
#!/bin/bash
# Smart file suggestions based on recent changes
git diff --name-only HEAD~5..HEAD 2>/dev/null | head -20 || echo ""
EOF
    chmod +x .claude/file-suggestion.sh
    echo "   ✓ Created .claude/file-suggestion.sh"
    echo ""
fi

# Create user-level CLAUDE.md template if it doesn't exist
USER_CLAUDE_MD="$HOME/.claude/CLAUDE.md"
if [ ! -f "$USER_CLAUDE_MD" ]; then
    echo "📝 Creating user-level CLAUDE.md template..."
    mkdir -p "$HOME/.claude"
    cat > "$USER_CLAUDE_MD" << 'EOF'
# Personal Claude Code Preferences

## Communication Style
- Be extremely concise - every token costs money
- No emojis unless requested
- Skip pleasantries and get straight to the point

## Code Style
- Use 2-space indentation
- Prefer functional programming patterns
- Always include error handling

## Cost Optimization Rules
- Always use forked context for commits and reviews
- Use Task tool instead of direct Grep/Read for codebase exploration
- Clear context proactively when it reaches 50%
- Use /model opusplan for complex reasoning tasks
- Use haiku for simple tasks via skills

## Default Commands
Remember these common commands:
- Build: npm run build
- Test: npm test
- Lint: npm run lint
EOF
    echo "   ✓ Created $USER_CLAUDE_MD"
    echo ""
fi

echo "💰 Expected Impact:"
echo "   • 40-50% cost reduction"
echo "   • From ~\$6/day to ~\$3.50/day"
echo "   • From ~\$120-200/mo to ~\$60-100/mo"
echo ""
echo "📊 Monitor Results:"
echo "   • Run: .claude/cost-dashboard.sh"
echo "   • Check: .claude/last-session-report.txt (generated on session end)"
echo "   • Review: .claude/compact-log.txt (compaction events)"
echo ""
echo "⚡ Next Steps:"
echo "   1. Restart Claude Code to apply settings"
echo "   2. Use /model opusplan for complex tasks"
echo "   3. Monitor context % in status line"
echo "   4. Review .claude/ADDITIONAL_OPTIMIZATIONS.md for more"
echo ""
echo "✅ Optimization complete!"
echo ""
echo "Backup saved to: $BACKUP_FILE"
echo "════════════════════════════════════════════════════════════════"
