---
name: commit-standard
description: Generate commit messages following conventional commits format. Use when creating commits or when user asks for commit messages.
allowed-tools: Read, Grep, Bash
context: fork
model: haiku
---

# Commit Message Standard

Generate commit messages following the Conventional Commits specification.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies
- **ci**: CI/CD changes
- **build**: Build system changes

## Rules

1. **Subject line**: Max 72 characters, imperative mood ("add" not "added")
2. **Body**: Explain what and why, not how (optional)
3. **Footer**: Reference issues, breaking changes (optional)
4. **Scope**: Optional, indicates what part of codebase changed

## Examples

```
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh to improve user experience
and reduce re-authentication frequency.

Closes #123
```

```
fix(api): resolve race condition in data fetching

The previous implementation could cause duplicate requests
when multiple components mounted simultaneously.
```

```
docs: update installation instructions

Add troubleshooting section for common setup issues.
```

## When to use what

- User adds new functionality → `feat`
- User fixes a bug → `fix`
- User updates documentation → `docs`
- User refactors code without changing behavior → `refactor`
- User updates dependencies or build config → `chore`
