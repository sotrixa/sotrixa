# Build Mode Optimization: Code Only, Zero Bloat

**Your workflow**: GSD plans → Claude Code builds → Ralph loops
**Problem**: Building phase generates verbose text that bloats output costs
**Solution**: BUILD MODE = Code only, PLAN MODE = Brief explanations

---

## The Workflow

### 1. GSD Planning (Brief explanations OK)

```bash
/gsd:plan-phase 1

User: "Plan authentication system"

Claude (PLAN MODE):
Research shows JWT + refresh tokens best for our needs:
- Stateless (scales horizontally)
- Industry standard
- Refresh prevents constant re-login

Plan written to PLAN.md. [Tool calls only, no verbose summaries]
```

**Output**: ~500 tokens (brief + plan file)
**Cost**: $0.0075

### 2. Claude Code Building (CODE ONLY)

```bash
/gsd:execute-phase 1

Claude (BUILD MODE):
[Write src/auth/jwt.ts]
[Write src/auth/refresh.ts]
[Write src/middleware/auth.ts]
[Bash: npm test]
Done. JWT auth working, tests pass.
```

**Output**: ~400 tokens (just code + 1 line)
**Cost**: $0.006

**NOT THIS** (verbose):
```
I'll start implementing the authentication system. First, let me create
the JWT utility file... [200 tokens of explanation]

[Creates file]

Now I've successfully created the JWT utility. This file handles token
generation and validation. Next, I'll create the refresh token logic...
[200 tokens]

[Creates file]

Great! The refresh tokens are now implemented. Let me add the middleware
to protect routes... [200 tokens]

[Creates middleware]

Perfect! I've successfully implemented the complete authentication system
with JWT and refresh tokens. The tests are all passing... [200 tokens]
```

**Output**: ~2000 tokens
**Cost**: $0.030

**Savings**: $0.024 per build session (80% reduction!)

### 3. Ralph Looping (Autonomous, CODE ONLY)

```bash
./scripts/ralph/ralph.sh

Ralph iteration 1:
[Implements feature A - code only]
Done. Feature A complete.

Ralph iteration 2:
[Implements feature B - code only]
Done. Feature B complete.

...10 iterations...

Ralph complete. 10 stories done.
```

**Output**: ~5K tokens (10 iterations × 500 tokens)
**Cost**: $0.075

**NOT THIS** (verbose):
```
Ralph iteration 1:
I'm now implementing feature A. Let me first understand... [explains 500 tokens]
[code]
Successfully implemented feature A. This feature does X, Y, Z... [explains 300 tokens]

...10 iterations...
```

**Output**: ~20K tokens (10 iterations × 2000 tokens)
**Cost**: $0.30

**Savings**: $0.225 per Ralph run (75% reduction!)

---

## What Changed in CLAUDE.md

Added "Output Style" section with:

```markdown
**BUILD MODE** (default):
- Format: [Tool calls] + Done. [1-sentence]
- NO explanations/introductions/summaries

**PLAN MODE** (architecture only):
- Brief explanation OK (2-3 sentences max)
- Document "why" in .claude/decisions/*.md

**Verbose ONLY when**:
- User asks: "explain", "why", "how"
- Error needs context
```

Now **every prompt** includes these rules → Claude knows: building = code only.

---

## How It Prevents Bloat

### Planning Phase (GSD)

**Before** (verbose):
```
> /gsd:plan-phase 2

Claude:
Let me analyze the requirements for phase 2. I'll need to research the
following aspects... [500 tokens]

After researching, I found that we should use approach X because of
reasons A, B, C. Let me explain each reason in detail... [800 tokens]

Now I'll write the plan. The plan includes the following steps, each
carefully chosen to... [400 tokens]

I've successfully created a comprehensive plan. This plan ensures that...
[300 tokens]
```

**Total**: ~2000 tokens = $0.030

**After** (BUILD MODE):
```
> /gsd:plan-phase 2

Claude:
Approach X best: stateless, scales, standard.

[Writes PLAN.md with detailed steps]
Done. Plan in PLAN.md.
```

**Total**: ~400 tokens = $0.006
**Savings**: $0.024 (80% reduction)

### Execution Phase (Claude Code)

**Before** (verbose):
```
> /gsd:execute-phase 2

Claude:
I'll start executing the plan. First, let me read the plan file to
understand what needs to be done... [200 tokens]

[Reads file]

Now I understand the plan. I'll start with step 1, which involves creating
the database schema. Let me explain the schema design... [300 tokens]

[Creates schema]

Excellent! The schema is created. Now moving to step 2, which is the API
endpoints. Let me explain the API design... [300 tokens]

[Creates endpoints]

Great! All steps complete. Let me verify everything works... [200 tokens]

[Runs tests]

Perfect! Phase 2 is successfully executed. All tests pass, and the
implementation follows best practices... [200 tokens]
```

**Total**: ~3500 tokens = $0.0525

**After** (BUILD MODE):
```
> /gsd:execute-phase 2

Claude:
[Read PLAN.md]
[Write schema.sql]
[Write api/endpoints.ts]
[Bash: npm test]
Done. Phase 2 complete, tests pass.
```

**Total**: ~500 tokens = $0.0075
**Savings**: $0.045 (85% reduction!)

### Ralph Looping (Autonomous)

Ralph runs 10+ iterations autonomously. Without BUILD MODE:

**Before** (verbose per iteration):
```
Iteration 1: 2000 tokens (explaining + code + summary)
Iteration 2: 2000 tokens
...
Iteration 10: 2000 tokens

Total: 20,000 tokens = $0.30
```

**After** (BUILD MODE per iteration):
```
Iteration 1: 500 tokens (code + "Done. Feature X complete.")
Iteration 2: 500 tokens
...
Iteration 10: 500 tokens

Total: 5,000 tokens = $0.075
```

**Savings**: $0.225 per Ralph run (75% reduction!)

**Per month** (20 Ralph runs): $4.50 saved

---

## When Explanations ARE Needed

### Architecture Decisions (PLAN MODE)

```bash
> "Should we use microservices or monolith?"

Claude (PLAN MODE - explanation OK):
Monolith recommended:
- Team size: 2 developers (microservices overhead not justified)
- Complexity: Medium (monolith handles this well)
- Deploy frequency: Weekly (don't need independent deploys)

Microservices better when: 10+ developers, need independent scaling.

Decision documented in .claude/decisions/architecture.md.
```

**Output**: ~300 tokens (brief explanation + decision doc)
**Acceptable**: Architectural decisions need context

### Error Debugging

```bash
> "Fix failing test"

Claude (BUILD MODE but error needs context):
Test fails: JWT expired (5min ago). Issue in token generation - used
Date.now() instead of Math.floor(Date.now()/1000).

[Edit auth.ts]
Done. Fixed timestamp, test passes.
```

**Output**: ~200 tokens (context + fix)
**Acceptable**: Error context helps understanding

### User Explicitly Asks

```bash
> "Explain how the auth flow works"

Claude (VERBOSE - user requested):
Auth flow:
1. User logs in → receives JWT (15min) + refresh token (7d)
2. JWT in Authorization header for API calls
3. JWT expires → use refresh token to get new JWT
4. Refresh token rotates on each use (security)
5. Logout → invalidate refresh token in DB

[Optional: Diagram in .claude/docs/auth-flow.md]
```

**Output**: ~400 tokens
**Acceptable**: User explicitly asked for explanation

---

## Cost Comparison: Full Workflow

### Scenario: Build 3-phase project

**Phase 1**: Plan (research auth) + Execute (implement)
**Phase 2**: Plan (database schema) + Execute (implement)
**Phase 3**: Plan (API endpoints) + Execute (implement)

### Before (Verbose everywhere)

```
Phase 1 Plan: 2000 tokens = $0.030
Phase 1 Execute: 3500 tokens = $0.0525
Phase 2 Plan: 2000 tokens = $0.030
Phase 2 Execute: 3500 tokens = $0.0525
Phase 3 Plan: 2000 tokens = $0.030
Phase 3 Execute: 3500 tokens = $0.0525

Total: 16,500 tokens = $0.2475
```

### After (BUILD MODE)

```
Phase 1 Plan: 400 tokens = $0.006
Phase 1 Execute: 500 tokens = $0.0075
Phase 2 Plan: 400 tokens = $0.006
Phase 2 Execute: 500 tokens = $0.0075
Phase 3 Plan: 400 tokens = $0.006
Phase 3 Execute: 500 tokens = $0.0075

Total: 2,700 tokens = $0.0405
```

**Savings**: $0.207 per project (83% reduction!)

**Per month** (10 projects): **$2.07 saved on output alone**

Combined with input optimizations (prompt caching, etc.): **~$25/month saved**

---

## Your Prompts Should Also Be Concise

### Bad (Verbose prompts)

```bash
❌ "Can you please help me implement a user authentication system with JWT
    tokens and refresh tokens? I need it to be secure and follow best
    practices. Also, please make sure to add proper error handling and
    validation."
```

**Result**: Claude thinks you want detailed explanation → generates verbose response

### Good (Concise prompts)

```bash
✅ "Implement JWT auth + refresh tokens"
```

**Result**: Claude assumes BUILD MODE → generates code + "Done."

### Even Better (GSD workflow)

```bash
✅ "/gsd:plan-phase 1"   # GSD handles planning
✅ "/gsd:execute-phase 1" # GSD handles execution

# Both automatically use BUILD MODE
```

---

## How to Think About It

### Wrong Mental Model

"I need to tell Claude everything I want, explain my requirements in detail,
and ask it to explain what it's doing so I understand."

**Result**: Verbose prompts → Verbose responses → High cost

### Correct Mental Model

"Claude knows what to do. I give commands. It builds. I see code changes
in tool calls. That's all I need during development."

**Result**: Concise prompts → Code-only responses → Low cost

### Exception: Planning/Architecture

"For architecture decisions, I need brief explanations of tradeoffs. But
detailed 'why' goes in .md files, not conversation."

**Result**: Brief explanation (2-3 sentences) + decision doc → Optimal balance

---

## Verification

### Check Current Cost

```bash
/cost

# Note current output tokens
```

### Build Something with BUILD MODE

```bash
> "Add rate limiting to API"

# Should see:
[Edit middleware.ts]
Done. 100 req/min limit.

# NOT:
# "I'll implement rate limiting... [explanation]
#  [code]
#  I've successfully added... [summary]"
```

### Check New Cost

```bash
/cost

# Should see: 50-80% lower output tokens
```

---

## Summary

**Problem**: Output costs 5x input ($15/M vs $3/M), verbose text bloats costs

**Solution**: BUILD MODE in CLAUDE.md
- GSD planning: Brief explanations (2-3 sentences)
- Claude Code building: CODE ONLY (no explanations)
- Ralph looping: CODE ONLY (no summaries)

**Implementation**: Updated CLAUDE.md with "Output Style" rules

**Expected savings**:
- Per build session: $0.024 (80% reduction)
- Per Ralph run: $0.225 (75% reduction)
- Per project: $0.207 (83% reduction)
- **Monthly**: ~$25 saved (combined with input optimizations)

**Your workflow is now**:
1. GSD plans (brief)
2. Claude Code builds (code only)
3. Ralph loops (code only)
4. Zero text bloat ✅

**Status**: ✅ Implemented in CLAUDE.md, active now
