# Database Migrations

Manage database schema migrations for PostgreSQL in Node.js applications.

## When to Use

- Creating new database migrations
- Modifying existing schema
- Rolling back migrations
- Setting up migration tooling
- Troubleshooting migration issues
- Planning schema changes

## Tech Stack Context

- **Database**: PostgreSQL
- **Backend**: Node.js + Express + TypeScript
- **Migration Tools**: Knex.js, node-pg-migrate, or Prisma Migrate
- **ORM**: Prisma or TypeORM (assumed)

## Instructions

When managing database migrations:

1. **Migration Tools** (choose one):
   - **Prisma Migrate**: Modern, type-safe, auto-generates migrations
   - **Knex.js**: Flexible, SQL-first, good for complex migrations
   - **node-pg-migrate**: PostgreSQL-specific, programmatic API
   - **TypeORM**: ORM with migration support

2. **Migration Structure**:
   ```
   migrations/
   ├── 20260101120000_create_users_table.ts
   ├── 20260102140000_add_email_index.ts
   ├── 20260103160000_create_events_table.ts
   └── 20260104180000_add_user_roles.ts
   ```

3. **Best Practices**:
   - Never modify existing migrations (create new ones)
   - Always include rollback (down) logic
   - Test migrations on copy of production data
   - Use transactions for safety
   - Keep migrations small and focused
   - Add descriptive names
   - Version control all migrations

4. **Schema Design Principles**:
   - Use appropriate data types
   - Add indexes for query performance
   - Use foreign keys for referential integrity
   - Consider partitioning for large tables
   - Use ENUM types judiciously
   - Normalize but not excessively

5. **Common Operations**:
   - **Create table**: Include primary key, timestamps
   - **Add column**: Consider default values
   - **Modify column**: Use ALTER TABLE carefully
   - **Drop column**: Ensure not in use first
   - **Add index**: For frequently queried columns
   - **Add constraint**: Foreign keys, unique, check

6. **Zero-Downtime Migrations**:
   - Add columns before using them
   - Remove columns after code deployment
   - Use feature flags for schema changes
   - Deploy in stages (additive → code → destructive)

## Example Migrations

**Prisma**:
```prisma
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  events    Event[]
}

model Event {
  id        String   @id @default(uuid())
  type      String
  payload   Json
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([type])
}

enum Role {
  USER
  ADMIN
}
```

```bash
# Generate migration
npx prisma migrate dev --name create_users_and_events

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

**Knex.js**:
```typescript
// migrations/20260101120000_create_users_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('name');
    table.enum('role', ['USER', 'ADMIN']).defaultTo('USER');
    table.timestamps(true, true);

    table.index('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
```

```bash
# Create migration
npx knex migrate:make create_users_table

# Run migrations
npx knex migrate:latest

# Rollback
npx knex migrate:rollback
```

**node-pg-migrate**:
```typescript
// migrations/1704124800000_create-users-table.ts
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    email: { type: 'varchar(255)', unique: true, notNull: true },
    name: { type: 'varchar(255)' },
    role: { type: 'varchar(20)', default: 'USER' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('users', 'email');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
```

```bash
# Create migration
npx node-pg-migrate create create-users-table

# Run migrations
npx node-pg-migrate up

# Rollback
npx node-pg-migrate down
```

## Common Patterns

**Add Column**:
```typescript
export async function up(knex: Knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('phone').nullable();
  });
}
```

**Add Index**:
```typescript
export async function up(knex: Knex) {
  await knex.schema.alterTable('events', (table) => {
    table.index(['user_id', 'created_at'], 'idx_events_user_created');
  });
}
```

**Add Foreign Key**:
```typescript
export async function up(knex: Knex) {
  await knex.schema.alterTable('events', (table) => {
    table.foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}
```

**Data Migration**:
```typescript
export async function up(knex: Knex) {
  // Add column with default
  await knex.schema.alterTable('users', (table) => {
    table.string('status').defaultTo('active');
  });

  // Backfill data
  await knex('users')
    .where('deactivated_at', 'is not', null)
    .update({ status: 'inactive' });
}
```

## Example Tasks

- "Create migration for users table"
- "Add email index to users table"
- "Create events table with foreign key"
- "Rollback last migration"
- "Modify column type safely"
- "Set up Prisma migrations"

## Commands Reference

```bash
# Prisma
npx prisma migrate dev --name <name>
npx prisma migrate deploy
npx prisma migrate status

# Knex
npx knex migrate:make <name>
npx knex migrate:latest
npx knex migrate:rollback

# node-pg-migrate
npx node-pg-migrate create <name>
npx node-pg-migrate up
npx node-pg-migrate down
```

## Output Format

Provide complete migration files with up/down logic, proper types, indexes, and rollback support. Include comments for complex operations.
