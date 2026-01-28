---
name: docs-write
description: Write world-class documentation following 2026 best practices, modern architecture patterns, and professional content design principles. Use when creating or editing documentation.
allowed-tools: Read, Write, Grep, Bash, Glob, WebSearch
---

# World-Class Documentation Writing (2026)

Professional documentation architecture and content design following industry-leading standards.

## Core Frameworks

### Diátaxis Documentation System

All documentation must fit one of four types:

| Type | Purpose | User Need | Form |
|------|---------|-----------|------|
| **Tutorials** | Learning-oriented | "Teach me" | Lesson |
| **How-to Guides** | Task-oriented | "Show me how" | Steps |
| **Explanation** | Understanding-oriented | "Help me understand" | Discussion |
| **Reference** | Information-oriented | "Tell me exactly" | Description |

**Critical**: Never mix types. A tutorial should not become reference. A how-to should not explain theory.

### Information Architecture Principles

1. **Progressive Disclosure**: Start simple, layer complexity
2. **Clear Navigation**: User should know where they are and where they can go
3. **Consistent Structure**: Same types of content use same patterns
4. **Semantic Hierarchy**: H1 → H2 → H3 reflects importance and relationship
5. **Findability**: Search-optimized, cross-linked, indexed

## Writing Standards (2026)

### Voice and Tone

**Professional but Human**:
- Active voice: "Run the command" not "The command should be run"
- Second person: "You can configure" not "Users can configure" or "One can configure"
- Present tense: "The function returns" not "The function will return"
- Direct: "Delete the file" not "You might want to consider deleting the file"

**Inclusive Language**:
- Avoid: master/slave, blacklist/whitelist, sanity check
- Use: primary/replica, allowlist/blocklist, confidence check
- Gender-neutral: "they/their" for singular unknown person
- No ableist language: avoid "dummy", "cripple", "blind to"

**Precision**:
- Avoid hedging: "basically", "simply", "just", "easy"
- Avoid subjective claims: "powerful", "intuitive", "elegant"
- Avoid future promises: "will support" (unless committed)
- Be specific: "2-3 minutes" not "quickly"

### Sentence Structure

**Clarity Rules**:
1. One idea per sentence
2. Max 25 words per sentence (ideal: 15-20)
3. Max 4 sentences per paragraph
4. Lead with the action in instructions
5. Use parallel structure in lists

**Examples**:

❌ Bad:
```
The configuration file, which is located in the root directory,
should be edited to include the new API key that you received
from the dashboard, and then you need to restart the server.
```

✅ Good:
```
1. Add your API key to `config.yml` in the root directory
2. Restart the server

The server will load the new configuration on restart.
```

### Accessibility (WCAG 2.2 Level AA)

**Required**:
- Alt text for all images (describe function, not appearance)
- Meaningful link text (not "click here")
- Sufficient color contrast (4.5:1 for text)
- Headings form logical outline
- Code blocks have language specified
- Tables have header rows
- No information conveyed by color alone

**Image Alt Text**:
- ❌ "Screenshot of dashboard"
- ✅ "Dashboard showing three active workflows and error count of zero"

**Link Text**:
- ❌ "Click [here](link) for API docs"
- ✅ "See [API reference](link) for details"

### SEO for Documentation

**On-Page SEO**:
1. **Title**: 50-60 chars, primary keyword early, descriptive
2. **Meta description**: 150-160 chars, promise value, include keyword
3. **URL slug**: `/docs/api-authentication` not `/docs/page-42`
4. **H1**: One per page, matches title, contains primary keyword
5. **Keywords**: In first 100 words, in at least one H2, naturally integrated

**Content SEO**:
- Answer specific questions: "How do I...", "What is...", "Why does..."
- Use semantic HTML: `<code>`, `<pre>`, `<kbd>`
- Internal linking: 3-5 relevant docs linked per page
- External linking: Link to authoritative sources
- Fresh content: Update dates, keep current

**Featured Snippet Optimization**:
- 40-60 word definitions for "What is X" queries
- Numbered lists for "How to X" queries
- Tables for "X vs Y" comparisons
- Bullet lists for "Types of X" queries

## Content Patterns

### Tutorials (Learning Path)

**Structure**:
```markdown
# Build Your First [Thing]

> **What you'll build**: [Specific outcome]
> **Time**: [Realistic estimate]
> **Prerequisites**: [Links to required knowledge]

## What You'll Learn

- [Concept 1]
- [Concept 2]
- [Concept 3]

## Before You Begin

[Setup requirements, tools needed]

## Step 1: [Action Verb + Outcome]

[Explanation of what and why]

[Code example]

[Expected result]

## Step 2: [Next Action]

[Continue pattern]

## What You Built

[Summary of completed project]

## Next Steps

- [Related tutorial]
- [How-to guide for extending]
- [Explanation for understanding deeper]
```

**Tutorial Rules**:
- Every step must work
- Show expected output
- Explain why, not just what
- Build something meaningful
- No detours or "you could also..."

### How-to Guides (Task Completion)

**Structure**:
```markdown
# How to [Achieve Specific Goal]

> **Goal**: [What user will accomplish]
> **Difficulty**: Beginner/Intermediate/Advanced
> **Time**: [Estimate]

## Prerequisites

- [Required knowledge with links]
- [Required tools/access]

## Steps

1. **[Action with context]**

   [Brief explanation]

   ```bash
   command-to-run
   ```

   Expected output:
   ```
   output-they-should-see
   ```

2. **[Next action]**

   [Pattern continues]

## Verification

[How to confirm success]

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| [Error] | [Why] | [Fix] |

## Related

- [Alternative approaches]
- [Next steps]
```

**How-to Rules**:
- Goal-oriented: One clear outcome
- No explanation of concepts (link to Explanation docs)
- Imperative mood: "Configure X" not "Configuring X"
- Show expected output
- Include troubleshooting

### Explanation (Conceptual Understanding)

**Structure**:
```markdown
# Understanding [Concept]

> **Summary**: [2-3 sentence overview]

## What is [Concept]?

[40-60 word definition optimized for featured snippet]

## Why [Concept] Matters

[Real-world context and implications]

## How [Concept] Works

[Deep dive with diagrams]

## [Concept] vs [Related Concept]

| Aspect | [Concept] | [Related] |
|--------|-----------|-----------|
| [Feature] | [Detail] | [Detail] |

## Common Patterns

### Pattern 1: [Name]

[When to use, example, trade-offs]

### Pattern 2: [Name]

[Continue]

## Best Practices

- ✅ **Do**: [Recommendation with reason]
- ❌ **Don't**: [Anti-pattern with explanation]

## Related Concepts

- [Link to related Explanation]
- [Link to related Explanation]
```

**Explanation Rules**:
- No instructions (link to How-to)
- Focus on understanding
- Use diagrams and visuals
- Compare and contrast
- Discuss trade-offs

### Reference (Technical Precision)

**Structure**:
```markdown
# [Component/API/Module] Reference

> **Version**: [Specific version this applies to]

## Overview

[Brief description: what it does, when to use]

## API

### [Method/Function Name]

**Signature**:
```typescript
function methodName(param1: Type1, param2: Type2): ReturnType
```

**Description**: [What it does]

**Parameters**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| param1 | Type1 | Yes | - | [Description] |
| param2 | Type2 | No | null | [Description] |

**Returns**: [ReturnType] - [Description]

**Errors**:
- `ErrorType` - [When thrown]

**Example**:
```typescript
// [Describe use case]
const result = methodName(value1, value2)
```

**See Also**: [Links to related reference]

## Configuration

[All options in table format]

## Examples

[Multiple real-world examples]
```

**Reference Rules**:
- Exhaustive completeness
- Consistent format
- No opinion or recommendations (that's Explanation)
- Technical precision
- Version-specific
- Searchable/scannable

## Modern Documentation Features

### Interactive Elements

**Code Playgrounds**:
```markdown
<CodePlayground language="javascript" runnable>
// User can edit and run this
console.log('Hello, world!')
</CodePlayground>
```

**Tabs for Multiple Languages**:
```markdown
<CodeTabs>
<CodeTab label="JavaScript">
```javascript
const example = 'code'
```
</CodeTab>
<CodeTab label="Python">
```python
example = 'code'
```
</CodeTab>
</CodeTabs>
```

**Callouts**:
```markdown
<Info>
Informational callout for helpful context
</Info>

<Warning>
Caution about edge cases or potential issues
</Warning>

<Danger>
Critical warnings about destructive operations
</Danger>

<Tip>
Pro tips and best practices
</Tip>
```

### Component-Based Documentation

**Card Grids**:
```markdown
<CardGrid cols={3}>
  <Card title="Quick Start" href="/docs/quickstart" icon="rocket">
    Get up and running in 5 minutes
  </Card>
  <Card title="API Reference" href="/docs/api" icon="book">
    Complete API documentation
  </Card>
  <Card title="Examples" href="/docs/examples" icon="code">
    Real-world code examples
  </Card>
</CardGrid>
```

**Accordion/Expandable Sections**:
```markdown
<Accordion title="Advanced Configuration">
Content that's collapsed by default
</Accordion>
```

**Steps Component**:
```markdown
<Steps>
<Step title="Install dependencies">
Content for step 1
</Step>
<Step title="Configure">
Content for step 2
</Step>
</Steps>
```

## Documentation Organization

### Site Structure

```
docs/
├── index.md                    # Landing page
├── getting-started/
│   ├── index.md               # Overview
│   ├── installation.md        # How-to
│   ├── quickstart.md          # Tutorial
│   └── first-project.md       # Tutorial
├── guides/                     # How-to guides
│   ├── authentication.md
│   ├── deployment.md
│   └── scaling.md
├── concepts/                   # Explanations
│   ├── architecture.md
│   ├── security-model.md
│   └── data-flow.md
├── api/                        # Reference
│   ├── rest-api.md
│   ├── graphql-api.md
│   └── sdk-reference.md
├── examples/                   # Real-world examples
│   ├── e-commerce.md
│   └── data-pipeline.md
└── contributing/
    ├── index.md
    └── style-guide.md
```

### Navigation Design

**Principles**:
1. **Max 3 levels deep** in sidebar navigation
2. **Grouped by user journey**: Getting Started → Guides → Concepts → Reference
3. **Search-first**: Prominent search, fuzzy matching, synonyms
4. **Breadcrumbs**: Always show user's location
5. **Next/Previous**: Linear progression through tutorials

### URL Structure

**Best Practices**:
- ✅ `/docs/api/authentication`
- ✅ `/docs/guides/deploy-production`
- ❌ `/docs/page-1`
- ❌ `/documentation/api_authentication`
- ❌ `/docs/2024/january/auth`

**Rules**:
- Lowercase only
- Hyphens, not underscores
- No dates in URLs (use versioning)
- Descriptive, keyword-rich
- Consistent depth

## Versioning Strategy

### Version-Aware Documentation

**URL Structure**:
```
/docs/v2/api/authentication     # Versioned
/docs/latest/api/authentication # Always latest
/docs/api/authentication        # Latest (redirects)
```

**Version Selector**:
- Prominent in header
- Shows current version
- Lists all maintained versions
- Warns if viewing old version

**Maintenance Policy**:
- Current version: Full maintenance
- Current - 1: Security updates only
- Older: Read-only, archived

### Deprecation Notices

```markdown
<Warning>
**Deprecated in v2.0**: This API will be removed in v3.0.
Use [new API](/docs/api/new-endpoint) instead.
</Warning>

## Migration Guide

1. [Step-by-step migration]
2. [Code examples]
3. [Breaking changes]
```

## API Documentation Standards

### REST API

```markdown
## POST /api/users

Create a new user account.

**Authentication**: Required (Bearer token)
**Rate Limit**: 100 requests/hour

### Request

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body**:
```json
{
  "email": "user@example.com",
  "name": "Jane Doe",
  "role": "admin"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| name | string | Yes | Full name (2-100 chars) |
| role | string | No | User role (default: member) |

### Response

**Success (201 Created)**:
```json
{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "name": "Jane Doe",
  "role": "admin",
  "createdAt": "2026-01-18T10:30:00Z"
}
```

**Errors**:
| Code | Error | Description |
|------|-------|-------------|
| 400 | invalid_email | Email format invalid |
| 409 | email_exists | Email already registered |
| 401 | unauthorized | Missing or invalid token |

### Example

<CodeTabs>
<CodeTab label="cURL">
```bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"Jane Doe"}'
```
</CodeTab>
<CodeTab label="JavaScript">
```javascript
const response = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'Jane Doe'
  })
})
const user = await response.json()
```
</CodeTab>
</CodeTabs>
```

### GraphQL API

```markdown
## Query: user

Fetch user details by ID.

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    role
    createdAt
  }
}
```

**Arguments**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | ID! | Yes | User unique identifier |

**Returns**: User object or null if not found

**Example**:
[Full example with variables]
```

## Code Examples

### Example Quality Standards

**Every code example must**:
1. Be complete and runnable
2. Follow current best practices (2026)
3. Include error handling
4. Show expected output
5. Be tested (automated or manual)

**Example Structure**:
```markdown
### Example: [Specific Use Case]

[Brief context: what this solves]

```language
// Comments explain non-obvious decisions
const example = createExample({
  // Use realistic values
  apiKey: process.env.API_KEY
})

// Show the result
console.log(example)
// Expected output: { status: 'success', id: 'ex_123' }
```

**Key points**:
- [Explain important pattern]
- [Explain trade-off made]

**See also**: [Link to related example]
```

### Anti-Patterns to Document

```markdown
## Common Mistakes

### ❌ Don't: [Anti-pattern]

```language
// Problematic code
```

**Why it's wrong**: [Explanation]

### ✅ Do: [Correct approach]

```language
// Correct code
```

**Why this works**: [Explanation]
```

## Search Optimization

### Content Structure for Search

1. **Front matter**: Title, description, keywords
2. **First paragraph**: Clear summary with primary keyword
3. **Headings**: Question-based where appropriate
4. **Code comments**: Searchable terms
5. **Alt text**: Descriptive image content

### Search Index Configuration

```json
{
  "searchFields": [
    { "field": "title", "weight": 10 },
    { "field": "description", "weight": 5 },
    { "field": "content", "weight": 1 },
    { "field": "headings", "weight": 3 }
  ],
  "stopWords": ["the", "a", "an"],
  "stemming": true,
  "fuzzyMatching": {
    "threshold": 0.6
  }
}
```

## Analytics and Iteration

### Metrics to Track

**Engagement**:
- Page views and unique visitors
- Time on page (aim: 2-4 minutes for how-to, 4-8 for tutorials)
- Scroll depth (aim: 70%+ reach bottom)
- Search queries (what users are looking for)

**Effectiveness**:
- Bounce rate (aim: <60%)
- Feedback ratings (thumbs up/down)
- Copy-paste events on code blocks
- Outbound clicks (to related docs)

**User Signals**:
- Search with no results
- Frequent edits from same user (confusion signal)
- Pages with high exit rate
- Common support questions (doc gaps)

### Continuous Improvement

**Monthly Review**:
1. Analyze top 10 most visited pages
2. Review pages with high bounce rate
3. Check failed search queries
4. Update outdated content
5. Add missing examples from support tickets

**Quarterly Audit**:
1. Broken links
2. Outdated screenshots
3. Version compatibility
4. Accessibility compliance
5. SEO performance

## Community Contribution

### Contribution Guidelines

```markdown
# Contributing to Documentation

## Quick Edits

Found a typo? Click "Edit on GitHub" and submit a PR.

## Larger Changes

1. **Open an issue first**: Discuss scope and approach
2. **Follow style guide**: See below
3. **Test examples**: All code must run
4. **Preview locally**: Run `npm run docs:dev`

## Style Guide

- Use active voice
- Keep sentences under 25 words
- One idea per paragraph
- No gendered pronouns (use "they")
- Code examples must be complete
- Include alt text for images

## Review Process

- Maintainer review within 48 hours
- CI checks: spelling, broken links, style
- All feedback must be addressed
- Maintainer can edit for style
```

### Recognition

- Contributors page with GitHub avatars
- Changelog credits: "Thanks to @username for improving..."
- "Edited by X contributors" badge on pages
- Annual contributor spotlight

## Content Quality Checklist

Before publishing, verify:

### Structure
- [ ] Fits Diátaxis category (Tutorial/How-to/Explanation/Reference)
- [ ] Clear hierarchy (H1 → H2 → H3)
- [ ] Breadcrumbs and navigation correct
- [ ] Next/previous links appropriate

### Writing
- [ ] Active voice throughout
- [ ] Sentences under 25 words
- [ ] No hedging language ("just", "simply", "basically")
- [ ] Inclusive language (no master/slave, etc.)
- [ ] Consistent terminology

### Code
- [ ] All examples tested and work
- [ ] Error handling shown
- [ ] Expected output included
- [ ] Language specified in code blocks
- [ ] Realistic variable names

### Accessibility
- [ ] Alt text on all images
- [ ] Meaningful link text
- [ ] Color contrast sufficient
- [ ] Headings form logical outline
- [ ] No information by color alone

### SEO
- [ ] Title 50-60 characters with keyword
- [ ] Meta description 150-160 characters
- [ ] Keyword in first 100 words
- [ ] At least one H2 contains keyword
- [ ] 3-5 internal links

### Technical
- [ ] No broken links
- [ ] Images optimized (<200KB)
- [ ] Version specified if version-specific
- [ ] Code syntax highlighting works
- [ ] Mobile-responsive

## Formatting Commands

After editing:

```bash
# Format markdown
prettier --write "docs/**/*.{md,mdx}"

# Check links
npm run docs:check-links

# Spell check
cspell "docs/**/*.md"

# Build and preview
npm run docs:build
npm run docs:preview
```

## Advanced Patterns

### Progressive Disclosure

**Level 1: Quick Start** (90% of users)
```markdown
## Quick Start

Run:
```bash
npx create-app my-app
cd my-app
npm start
```

Your app is now running at http://localhost:3000

<Accordion title="What just happened?">
[Explanation for curious users]
</Accordion>
```

**Level 2: Detailed Guide** (9% of users)
```markdown
## Detailed Installation

[Step-by-step with explanations]
```

**Level 3: Advanced Configuration** (1% of users)
```markdown
## Advanced: Custom Build Configuration

[Edge cases and expert options]
```

### Contextual Help

```markdown
## Configuration

Set your API key:

```yaml
api:
  key: your_api_key
```

<Tip>
**Where to find your API key**:
Go to Dashboard → Settings → API Keys
</Tip>

<Warning>
**Keep your API key secret**:
Never commit it to version control. Use environment variables instead.
</Warning>
```

### Error Message Documentation

```markdown
## Error Reference

### `ERR_AUTH_INVALID_TOKEN`

**Cause**: The authentication token is expired or malformed.

**Solution**:
1. Verify token format: Should be `Bearer <token>`
2. Check token expiration
3. Request a new token

**Example**:
```bash
# Invalid (causes error)
curl -H "Authorization: $TOKEN"

# Valid
curl -H "Authorization: Bearer $TOKEN"
```

**Related**: [Authentication guide](/docs/guides/auth)
```

## Reference Materials

### Typography

- Use `code` for: code, variables, file names, commands
- Use **bold** for: UI elements, emphasis, warnings
- Use *italic* for: introducing new terms (first use only)
- Use > blockquote for: important callouts
- Use --- for: section breaks

### Punctuation

- **Serial comma**: "A, B, and C" (not "A, B and C")
- **En dash (–)**: Ranges "2–4 minutes"
- **Em dash (—)**: Breaks in thought—like this
- **Ellipsis**: Three periods with spaces ". . ."

### Capitalization

- **Headings**: Sentence case ("How to deploy" not "How To Deploy")
- **UI elements**: Match exact casing ("Save" button not "save" button)
- **Code**: Preserve exact casing

---

## Summary: Documentation Excellence

World-class documentation in 2026:

1. **Structured**: Follows Diátaxis framework
2. **Accessible**: WCAG 2.2 AA compliant
3. **Inclusive**: Gender-neutral, no ableist language
4. **Searchable**: SEO-optimized, keyword-rich
5. **Complete**: Tested examples, error handling
6. **Current**: Regular updates, version-aware
7. **Interactive**: Runnable code, live examples
8. **Measurable**: Analytics-driven iteration

Every piece of documentation should answer:
- **Who** is this for?
- **What** will they accomplish?
- **Why** does it matter?
- **How** do they do it?

Make it impossible to fail.
