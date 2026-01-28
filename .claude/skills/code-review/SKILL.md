---
name: code-review
description: Review code for common issues, best practices, and potential bugs. Use when user asks to review code or before committing changes.
allowed-tools: Read, Grep, Glob
context: fork
agent: Explore
---

# Code Review Guidelines

Perform thorough code reviews focusing on quality, security, and maintainability.

## Review Checklist

### 1. Code Quality
- [ ] Clear and descriptive variable/function names
- [ ] Functions are focused and do one thing well
- [ ] No unnecessary complexity or over-engineering
- [ ] Code is self-documenting with minimal comments
- [ ] No commented-out code or debug statements

### 2. Security
- [ ] No hardcoded credentials or API keys
- [ ] Input validation for user data
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (proper escaping)
- [ ] CSRF protection where needed
- [ ] Sensitive data is encrypted

### 3. Error Handling
- [ ] Appropriate error handling (try/catch where needed)
- [ ] Meaningful error messages
- [ ] No silent failures
- [ ] Proper logging of errors

### 4. Performance
- [ ] No N+1 queries
- [ ] Efficient data structures and algorithms
- [ ] Unnecessary loops or computations avoided
- [ ] Database queries are optimized
- [ ] Large datasets are paginated

### 5. Testing
- [ ] Critical paths have tests
- [ ] Edge cases are covered
- [ ] Tests are meaningful and maintainable

### 6. TypeScript/JavaScript Specific
- [ ] Proper type annotations (no `any` unless justified)
- [ ] JSDoc comments for public APIs
- [ ] React hooks follow rules (dependencies, naming)
- [ ] No unused variables or imports
- [ ] Async operations properly handled

### 7. Documentation
- [ ] JSDoc comments are accurate and complete
- [ ] Complex logic has explanatory comments
- [ ] README updated if API changed
- [ ] Type definitions exported properly

### 8. Project Standards
- [ ] Follows existing code style and patterns
- [ ] Consistent with project architecture
- [ ] Dependencies are justified and minimal

## Review Process

1. **Understand context**: What problem does this solve?
2. **Check functionality**: Does it work as intended?
3. **Security audit**: Are there vulnerabilities?
4. **Type safety**: Proper TypeScript usage (if applicable)
5. **Code quality**: Is it maintainable?
6. **Suggest improvements**: What could be better?

## Feedback Format

Provide constructive feedback:
- **Critical**: Must be fixed (security, bugs, type errors)
- **Important**: Should be fixed (code quality, performance)
- **Suggestion**: Nice to have (minor improvements)

Always explain *why* something should change, not just *what* to change.

## TypeScript Best Practices

### Type Safety
- Avoid `any` - use `unknown` if type truly unknown
- Use union types over enums for flexibility
- Prefer type inference where clear
- Use `strict` mode compiler options

### JSDoc Quality
```typescript
/**
 * Fetches user data from the API
 *
 * @param userId - Unique user identifier
 * @param options - Optional fetch configuration
 * @returns Promise resolving to user object
 * @throws {NotFoundError} If user doesn't exist
 *
 * @example
 * const user = await fetchUser('123')
 */
async function fetchUser(
  userId: string,
  options?: FetchOptions
): Promise<User>
```

### React Patterns
- Hooks at top level (not in conditionals)
- Exhaustive dependencies in useEffect
- Memoization only when needed (measure first)
- Component composition over props drilling
