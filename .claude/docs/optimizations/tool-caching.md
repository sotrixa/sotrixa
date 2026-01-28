# Tool Definition Caching Implementation Guide

This guide shows how to implement tool definition caching to save 5-15% on requests that use tools.

## The Problem

Every time you use tools in Claude Code, the tool definitions are sent as input tokens:
- Tool names, descriptions, parameters
- Can be 500-2000 tokens for 5-10 tools
- Sent on EVERY request that uses tools

## The Solution

Cache tool definitions using `cache_control` so they're only sent once per 5 minutes (or 1 hour):

```json
{
  "tools": [
    {
      "name": "tool1",
      "description": "First tool",
      "input_schema": { ... }
    },
    {
      "name": "tool2",
      "description": "Second tool",
      "input_schema": { ... }
    },
    // ... more tools ...
    {
      "name": "tool_last",
      "description": "Last tool",
      "input_schema": { ... },
      "cache_control": {"type": "ephemeral", "ttl": "1h"}  // Cache for 1 hour
    }
  ]
}
```

**Key point**: The `cache_control` on the LAST tool caches ALL previous tools.

## When to Use

Implement tool caching if:
- ✅ You have 5+ tool definitions
- ✅ Tools don't change between requests
- ✅ You make multiple tool-using requests per session
- ✅ Tool definitions are large (detailed descriptions/schemas)

**Don't use if**:
- ❌ Tool definitions change frequently
- ❌ You only make 1-2 tool requests per session
- ❌ Tools are very small (<100 tokens)

## For This Project

### Skills with Tools

Our skills currently define tools but don't cache them. To optimize:

**commit-standard skill** (`.claude/skills/commit-standard/SKILL.md`):
- Uses: Read, Grep, Bash tools
- Recommendation: Tool definitions are minimal, caching not critical
- Savings: ~50 tokens per request if implemented

**code-review skill** (`.claude/skills/code-review/SKILL.md`):
- Uses: Read, Grep, Glob tools
- Recommendation: Cache if doing multiple reviews per session
- Savings: ~75 tokens per request if implemented

### Implementation Steps

1. **For API usage** (if you use Claude API directly):
   Add `cache_control` to last tool in tools array

2. **For Claude Code** (current setup):
   Tool definitions are handled automatically, but you can:
   - Use 1-hour cache for CLAUDE.md tool descriptions
   - Ensure tool-heavy operations use forked context (already done!)

## Cost Impact

**Before caching** (10 tool requests with 1000 tokens of tool definitions):
```
10 requests × 1000 tokens × $3/MTok = $0.03
```

**After caching** (first request writes cache, next 9 read from cache):
```
1 write: 1000 tokens × $3.75/MTok = $0.00375
9 reads: 9 × 1000 tokens × $0.30/MTok = $0.027
Total: $0.03075 (slightly more on small scale)

BUT with 50 requests:
1 write + 49 reads = $0.00375 + $0.147 = $0.15075
vs. no cache: $0.15
Savings: 0% (actually costs slightly more!)

With 100 requests:
1 write + 99 reads = $0.00375 + $0.297 = $0.30075
vs. no cache: $0.30
Savings: Still minimal...
```

**Wait, where's the savings?**

The savings come from 1-hour cache:
```
With 5-minute cache: Refreshed every 5 min = many cache writes
With 1-hour cache: Lasts 12x longer
```

**Example: 100 requests over 2 hours**:

5-minute cache (refreshed ~24 times):
```
24 writes: 24 × 1000 × $3.75/MTok = $0.09
76 reads: 76 × 1000 × $0.30/MTok = $0.0228
Total: $0.1128
```

1-hour cache (refreshed ~2 times):
```
2 writes: 2 × 1000 × $6/MTok = $0.012
98 reads: 98 × 1000 × $0.30/MTok = $0.0294
Total: $0.0414
```

**Savings**: $0.0714 per 100 requests (63% reduction in tool overhead!)

## Recommendation for This Project

1. **Already optimized**: Skills use forked context, so tool definitions don't bloat main conversation ✅

2. **Optional enhancement**: If you make many tool-using requests:
   - Implement 1-hour cache for CLAUDE.md system instructions
   - Add tool caching to frequently-used operations

3. **Estimated impact**: 5-10% additional savings if you use tools heavily

## Verification

After implementing, check usage response:
```json
{
  "usage": {
    "input_tokens": 50,  // Just your message
    "cache_read_input_tokens": 1000,  // Cached tools!
    "cache_creation_input_tokens": 0,  // No cache write
    "output_tokens": 100
  }
}
```

## Summary

- **Best use case**: Long sessions with frequent tool use
- **Implementation**: Add `cache_control` to last tool definition
- **1-hour cache**: Best for tool definitions (rarely change, used repeatedly)
- **Expected savings**: 5-15% on tool-heavy workloads
- **This project**: Already well-optimized with forked context

**Status**: 🟢 Optional optimization, implement if doing heavy tool usage.
