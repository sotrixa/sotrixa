# Automated Testing Workflows

Set up and manage automated testing for Node.js/Express backend and React 19 frontend applications.

## When to Use

- Creating test suites for new features
- Setting up testing infrastructure
- Debugging failing tests
- Improving test coverage
- Implementing CI/CD testing pipelines
- Writing integration and E2E tests

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript (Jest/Vitest)
- **Frontend**: React 19 + TypeScript (Vitest + React Testing Library)
- **API Testing**: Supertest
- **E2E**: Playwright
- **Event Bus**: NATS JetStream (test with testcontainers)

## Instructions

When implementing automated testing:

1. **Backend Testing** (Node.js/Express):
   - **Unit tests**: Test business logic, utilities
   - **Integration tests**: Test API endpoints with supertest
   - **Event tests**: Test NATS publishers/subscribers
   - Use vitest or jest with TypeScript support
   - Mock external dependencies
   - Use testcontainers for DB/NATS in integration tests

2. **Frontend Testing** (React 19):
   - **Component tests**: React Testing Library
   - **Hook tests**: @testing-library/react-hooks
   - **Integration tests**: Test user flows
   - Use vitest with jsdom or happy-dom
   - Mock API calls with MSW (Mock Service Worker)
   - Test accessibility with jest-axe

3. **E2E Testing** (Playwright):
   - Test critical user journeys
   - Run against staging environment
   - Include cross-browser testing
   - Use fixtures for test data
   - Parallelize test execution

4. **Test Structure**:
   ```
   backend/
   ├── __tests__/
   │   ├── unit/
   │   ├── integration/
   │   └── fixtures/
   ├── vitest.config.ts

   frontend/
   ├── src/
   │   ├── components/
   │   │   └── Button.test.tsx
   │   ├── hooks/
   │   │   └── useAuth.test.ts
   ├── e2e/
   │   └── user-flow.spec.ts
   └── vitest.config.ts
   ```

5. **CI/CD Integration**:
   - Run tests on every PR
   - Use GitHub Actions or GitLab CI
   - Generate coverage reports
   - Block merges on test failures
   - Run E2E tests before deployment

6. **Best Practices**:
   - Follow AAA pattern (Arrange, Act, Assert)
   - Write descriptive test names
   - Test behavior, not implementation
   - Keep tests fast and isolated
   - Use test factories for fixtures
   - Aim for 80%+ coverage on critical paths

## Example Test Patterns

**Backend Unit Test**:
```typescript
describe('UserService', () => {
  it('should create user with hashed password', async () => {
    const userData = { email: 'test@example.com', password: 'pass123' };
    const user = await userService.create(userData);

    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
  });
});
```

**Backend Integration Test**:
```typescript
describe('POST /api/users', () => {
  it('should create new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', password: 'pass123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

**Frontend Component Test**:
```typescript
describe('Button', () => {
  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

**E2E Test**:
```typescript
test('user can complete checkout flow', async ({ page }) => {
  await page.goto('/products');
  await page.click('text=Add to cart');
  await page.click('text=Checkout');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('text=Complete order');

  await expect(page.locator('text=Order confirmed')).toBeVisible();
});
```

## Example Tasks

- "Set up Vitest for backend testing"
- "Create integration tests for user API"
- "Add E2E tests with Playwright"
- "Fix failing test in checkout flow"
- "Improve test coverage to 80%"
- "Set up CI pipeline for automated testing"

## Commands

```bash
# Backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Frontend
npm run test              # Run all tests
npm run test:ui           # Vitest UI
npm run test:e2e          # Playwright E2E

# CI
npm run test:ci           # CI mode (no watch)
```

## Output Format

Provide complete test files with setup, test cases, and assertions. Include configuration files (vitest.config.ts, playwright.config.ts) when needed.
