---
name: project-standards
description: Apply Dikrasin.bg project coding standards and conventions. Always use this when writing or modifying code in this project.
---

# Dikrasin.bg Project Standards

These are the coding standards and conventions for the Dikrasin.bg project.

## General Principles

1. **Simplicity over cleverness**: Write clear, straightforward code
2. **Consistency**: Follow existing patterns in the codebase
3. **Security first**: Always validate input and sanitize output
4. **Performance matters**: Consider efficiency but don't prematurely optimize

## Code Style

### Naming Conventions
- **Variables**: camelCase for JavaScript/TypeScript
- **Constants**: UPPER_SNAKE_CASE
- **Files**: kebab-case for file names
- **Classes**: PascalCase

### File Organization
- Keep related code together
- One component/class per file
- Use index files for clean imports

## Security Requirements

1. **Never commit**:
   - `.env` files
   - API keys or secrets
   - Database credentials
   - Private keys

2. **Always**:
   - Validate user input
   - Sanitize output
   - Use parameterized queries
   - Implement rate limiting on APIs

## Git Workflow

1. **Branch naming**: `feature/description`, `fix/description`, `refactor/description`
2. **Commits**: Use conventional commits (see commit-standard skill)
3. **Pull requests**: Include description of changes and testing done

## Testing

- Write tests for new features
- Maintain existing test coverage
- Test edge cases and error conditions

## Documentation

- Update README when adding features
- Document complex logic inline
- Keep API documentation current

## Performance

- Optimize database queries
- Implement caching where appropriate
- Lazy load when possible
- Monitor bundle sizes

## Review Before Committing

Before committing, verify:
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No hardcoded values that should be configurable
- [ ] Tests pass
- [ ] No linting errors
