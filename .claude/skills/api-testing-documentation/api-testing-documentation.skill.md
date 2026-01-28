# API Testing & Documentation

Create comprehensive API tests and documentation for Express REST APIs.

## When to Use

- Documenting API endpoints
- Creating API integration tests
- Generating OpenAPI/Swagger specs
- Testing API contracts
- Validating request/response schemas
- Creating Postman collections

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Testing**: Supertest + Vitest/Jest
- **Documentation**: OpenAPI 3.0, Swagger UI
- **Validation**: Zod or Joi
- **API Tools**: Postman, Insomnia

## Instructions

When working with API testing/documentation:

1. **API Documentation**:
   - Use OpenAPI 3.0 specification
   - Generate with swagger-jsdoc or tsoa
   - Host Swagger UI for interactive docs
   - Include examples for all endpoints
   - Document error responses
   - Keep docs in sync with code

2. **Integration Testing**:
   - Test all HTTP methods (GET, POST, PUT, DELETE, PATCH)
   - Test authentication/authorization
   - Test error cases (400, 401, 403, 404, 500)
   - Test input validation
   - Test response schemas
   - Use factories for test data

3. **Contract Testing**:
   - Use Pact or OpenAPI validators
   - Ensure backend matches contract
   - Validate request/response schemas
   - Test API versioning

4. **Test Organization**:
   ```
   __tests__/
   ├── api/
   │   ├── users.test.ts
   │   ├── events.test.ts
   │   ├── auth.test.ts
   │   └── health.test.ts
   ├── fixtures/
   │   └── users.json
   └── setup.ts
   ```

5. **Documentation Structure**:
   - Overview and base URL
   - Authentication methods
   - Endpoint list with descriptions
   - Request/response examples
   - Error codes and meanings
   - Rate limiting info
   - Versioning strategy

## Example API Tests

```typescript
import request from 'supertest';
import { app } from '../app';
import { setupTestDb, teardownTestDb } from './setup';

describe('Users API', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.users.length).toBeLessThanOrEqual(10);
      expect(response.body).toHaveProperty('pagination');
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password'); // Ensure password not returned
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' }) // Missing password
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should prevent duplicate emails', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Test',
        password: 'Pass123!',
      };

      await request(app).post('/api/users').send(userData);

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409); // Conflict
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
```

## OpenAPI Documentation

```yaml
openapi: 3.0.0
info:
  title: Dikrasin.bg API
  version: 1.0.0
  description: Event-driven backend API
servers:
  - url: https://api.dikrasin.bg/v1
    description: Production
  - url: http://localhost:3000/v1
    description: Development

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        role:
          type: string
          enum: [USER, ADMIN]
        createdAt:
          type: string
          format: date-time

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        code:
          type: string

paths:
  /users:
    get:
      summary: List users
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  users:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    type: object
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                name:
                  type: string
                password:
                  type: string
                  format: password
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

## Swagger Setup (Express)

```typescript
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dikrasin.bg API',
      version: '1.0.0',
    },
    servers: [
      { url: 'https://api.dikrasin.bg/v1' },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to API docs
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

## Postman Collection

```json
{
  "info": {
    "name": "Dikrasin.bg API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "List Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/users?page=1&limit=20",
              "host": ["{{baseUrl}}"],
              "path": ["users"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "20" }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

## Example Tasks

- "Create API tests for user endpoints"
- "Generate OpenAPI spec for Express app"
- "Document authentication flow"
- "Create Postman collection"
- "Test error handling in API"
- "Validate response schemas"

## Tools

```bash
# Generate OpenAPI from code
npx swagger-jsdoc -d swaggerDef.js ./src/routes/*.ts -o openapi.json

# Validate OpenAPI spec
npx @apidevtools/swagger-cli validate openapi.yaml

# Generate Postman collection from OpenAPI
npx openapi-to-postmanv2 -s openapi.yaml -o postman-collection.json
```

## Output Format

Provide complete test suites with setup/teardown, OpenAPI specs with examples, and clear documentation for all endpoints.
