# Quick Start: Official Doc Optimizations

Based on [official Claude Code documentation](https://code.claude.com/docs), apply these optimizations NOW.

## 🚀 ONE Command to Rule Them All

```bash
.claude/apply-optimizations.sh
```

**Result**: 40-50% cost reduction in 5 minutes.

Then **restart Claude Code** to apply settings.

---

## 📊 What Gets Applied

| Optimization | Before | After | Impact |
|--------------|--------|-------|--------|
| Auto-compact threshold | 95% | 50% | 20-30% savings |
| Thinking token budget | 32,000 | 10,000 | 10-40% savings |
| Output token limit | 32,000 | 16,000 | 10-25% savings |
| Bash output limit | Unlimited | 25,000 | Prevents bloat |
| Non-essential calls | Enabled | Disabled | 5-10% savings |
| Tool search | Always | Lazy (5%) | Saves context |

**Total estimated savings**: 40-50% ($6/day → $3.50/day)

---

## 🎯 Model Usage (Critical!)

After applying optimizations, use the right model for each task:

### Daily Use
```bash
# Default for routine work
/model sonnet

# Complex reasoning + execution (RECOMMENDED)
/model opusplan
```

### opusplan Explained
- **Plan mode**: Uses Opus (best reasoning)
- **Execution mode**: Switches to Sonnet (efficient)
- **Result**: Best quality at lower cost

### Check Current Model
```bash
/status    # Shows current model
```

---

## 💰 Expected Savings

### Before Optimizations
- Daily: $6
- Monthly: $120-200
- Context: Fills to 95%
- Thinking: 32k tokens per turn

### After Optimizations
- Daily: $3.50
- Monthly: $60-100
- Context: Compacts at 50%
- Thinking: 10k tokens per turn

**Annual savings**: $720-1,200

---

## 📈 Monitoring

### Real-time (Status Line)
```
[Sonnet 4.5] Context: 23% 💚 | Cache: 99% 💚
```

Colors:
- 💚 Green < 50%
- 💛 Yellow 50-80%
- 🔴 Red > 80%

### Post-session
```bash
# Comprehensive dashboard
.claude/cost-dashboard.sh

# Last session report
cat .claude/last-session-report.txt

# Compaction history
tail .claude/compact-log.txt
```

---

## 🛠️ What Gets Created

### Scripts
- `.claude/file-suggestion.sh` - Smart file suggestions from recent git changes

### Hooks
- **PreCompact** - Logs when auto-compaction triggers
- **SessionStart** - Tracks session begin with ID
- **SessionEnd** - Auto-generates cost report

### Config
- `~/.claude/CLAUDE.md` - Your personal preferences for ALL projects

### Logs
- `.claude/compact-log.txt` - When compactions happen
- `.claude/last-session-report.txt` - Auto-generated on session end

---

## 🎓 Learn More

Quick reads:
- `.claude/ADDITIONAL_OPTIMIZATIONS.md` - All 15 optimizations explained
- `COMMANDS.md` - All available commands

Official docs:
- [Cost Guide](https://code.claude.com/docs/en/costs)
- [Memory Management](https://code.claude.com/docs/en/memory)
- [Model Config](https://code.claude.com/docs/en/model-config)

---

## ✅ Verification Checklist

After restarting Claude Code:

- [ ] Status line shows context % at terminal bottom
- [ ] Settings file has `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`
- [ ] File `.claude/file-suggestion.sh` exists and is executable
- [ ] File `~/.claude/CLAUDE.md` exists
- [ ] Dashboard shows optimization impact: `.claude/cost-dashboard.sh`

---

## 🆘 Troubleshooting

**Optimizations not applied?**
```bash
# Check settings
grep CLAUDE_AUTOCOMPACT .claude/settings.json

# Should show: "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
```

**Want to revert?**
```bash
# Restore from backup (created automatically)
cp .claude/settings.json.backup-* .claude/settings.json
```

**Context still high?**
- Use `/compact` manually
- Use `/model opusplan` for better quality at lower cost
- Check: Are you using Task tool for exploration? (Not direct Grep/Read)

---

## 📚 Next Steps

1. **Run**: `.claude/apply-optimizations.sh`
2. **Restart**: Claude Code
3. **Switch model**: `/model opusplan`
4. **Monitor**: Watch status line
5. **Check results**: `.claude/cost-dashboard.sh` after a few hours

---

**TL;DR**: Run `.claude/apply-optimizations.sh`, restart, use `/model opusplan`. Save 40-50%.
