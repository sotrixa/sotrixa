# Context Handoff Template

Use this template before running `/clear` to preserve essential context without bloating the next session.

## Session Summary

**Date**: [YYYY-MM-DD]
**Task**: [What were you working on]
**Status**: [Completed / In Progress / Blocked]

## Key Decisions

1. **[Decision topic]**
   - Decision: [What was decided]
   - Rationale: [Why this approach]
   - Alternative considered: [What was rejected and why]

2. **[Another decision]**
   - ...

## Current State

### Files Modified
```
src/auth/handler.ts:123 - Added JWT refresh logic
src/api/routes.ts:45 - Updated endpoint authentication
tests/auth.test.ts - Added tests for refresh flow
```

### Work In Progress
- [ ] [Task description]
  - Status: 70% complete
  - Next step: [What to do next]
  - Blocker: [Any issues]

- [ ] [Another task]
  - ...

## Gotchas & Learnings

1. **[Gotcha 1]**
   - What: [Description]
   - Why: [Root cause]
   - Solution: [How to handle]

2. **[Learning 1]**
   - Pattern used: [Description]
   - Why it works: [Explanation]
   - When to use: [Guidance]

## Technical Debt Created

- [ ] TODO in `file.ts:123` - [Description of what needs to be done]
- [ ] FIXME in `other.ts:456` - [Why this is temporary]

## Dependencies

- New package added: `package-name@version` - [Why needed]
- Configuration changed: `.env` - [What changed]
- Schema updated: `database/schema.sql` - [Migration needed]

## Context for Next Session

**When you return**:
1. Read this handoff file
2. Check files modified (git status)
3. Review gotchas section
4. Continue with: [Specific next action]

**Estimated effort to resume**: [X minutes]

## Questions/Uncertainties

1. [Question about approach or implementation]
2. [Area that needs clarification]
3. [Decision that needs input]

---

**Cost savings**: Using this handoff instead of keeping full context
- Previous context: [X]K tokens = $[X.XX]
- This handoff: ~[Y]K tokens = $[Y.YY]
- **Saved**: $[Z.ZZ] ([N]%)
