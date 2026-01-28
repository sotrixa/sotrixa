# Hook Configuration & Analysis

Understanding and optimizing Claude Code hooks.

## Guides

1. **[Analysis](./analysis.md)** - All 15 hooks analyzed
2. **[Recommendations](./recommendations.md)** - What to keep/remove

## Summary

**Current**: 15 hooks (13 seconds overhead per session)

**Recommended**:
- **Keep** (8 hooks): Automation (format, protect, alert, test analysis)
- **Remove** (7 hooks): Redundant logging (context %, prompts, etc.)

**Result**: 60% latency reduction, simpler maintenance

## Quick Decision

**Keep if**: Provides automation or security
**Remove if**: Duplicates info shown elsewhere (status line, /cost, git diff)
