# Minimal CLAUDE.md (Maximum Cost Savings)

If you want absolute minimum cost, replace CLAUDE.md with this:

```markdown
# CLAUDE.md

Be concise. Output costs 5x input.

## Agents
- `cheap-explore` for searches (Haiku)
- `cheap-bash` for commands (Haiku)
- `cheap-review` for reviews (Sonnet)

## Rules
1. Use cheap-* agents, not built-in
2. /compact at 80%
3. No verbose output
4. Forbidden: node_modules/, .git/, dist/

## Docs
- `.claude/docs/` for details
```

**Size:** ~250 tokens vs 1,500 tokens = **6x smaller**

**Trade-off:** Less guidance = potential mistakes that cost more to fix
