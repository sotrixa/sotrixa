# Health Check Automation

Implement comprehensive health checks for Node.js applications and infrastructure.

## When to Use

- Setting up application health endpoints
- Creating readiness/liveness probes
- Monitoring service dependencies
- Implementing circuit breakers
- Setting up alerting
- Troubleshooting service issues

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Event Bus**: NATS JetStream
- **Database**: PostgreSQL
- **Orchestration**: Kubernetes (Hetzner Cloud)
- **Monitoring**: Prometheus, Grafana

## Instructions

When implementing health checks:

1. **Health Check Types**:
   - **Liveness**: Is the app running? (restart if fails)
   - **Readiness**: Can the app serve traffic? (remove from load balancer if fails)
   - **Startup**: Has the app finished initialization? (wait before checking readiness)
   - **Deep health**: Detailed check of all dependencies

2. **What to Check**:
   - **Database**: Connection pool, query execution
   - **NATS JetStream**: Connection status, consumer lag
   - **Memory**: Heap usage, process memory
   - **Disk**: Available space (for logs, temp files)
   - **External APIs**: Connectivity, response time
   - **Event Loop**: Lag monitoring

3. **Response Format**:
   - **Status**: `healthy`, `unhealthy`, `degraded`
   - **Checks**: Individual component status
   - **Version**: Application version
   - **Uptime**: How long service has been running
   - **Timestamp**: When check was performed

4. **Best Practices**:
   - Keep liveness checks simple (< 1s)
   - Readiness can be more thorough (< 5s)
   - Set appropriate timeouts
   - Don't restart on transient failures
   - Log health check failures
   - Use exponential backoff for retries

5. **Kubernetes Integration**:
   - Configure liveness probe (restart pod)
   - Configure readiness probe (traffic routing)
   - Configure startup probe (slow-start apps)
   - Set appropriate initial delays
   - Use different endpoints for different checks

## Health Check Implementation

**Express Health Endpoints**:
```typescript
// health.ts
import { Request, Response } from 'express';
import { db } from './database';
import { natsClient } from './nats';
import { promises as fs } from 'fs';

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    [key: string]: {
      status: 'up' | 'down';
      message?: string;
      responseTime?: number;
    };
  };
}

// Simple liveness check (for K8s liveness probe)
export async function livenessCheck(req: Request, res: Response) {
  // Just check if process is responsive
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}

// Readiness check (for K8s readiness probe)
export async function readinessCheck(req: Request, res: Response) {
  const checks: HealthCheck['checks'] = {};
  let overallStatus: HealthCheck['status'] = 'healthy';

  // Check database
  try {
    const dbStart = Date.now();
    await db.query('SELECT 1');
    checks.database = {
      status: 'up',
      responseTime: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: 'down',
      message: error.message,
    };
    overallStatus = 'unhealthy';
  }

  // Check NATS
  try {
    if (natsClient.isClosed()) {
      checks.nats = {
        status: 'down',
        message: 'Connection closed',
      };
      overallStatus = 'unhealthy';
    } else {
      checks.nats = { status: 'up' };
    }
  } catch (error) {
    checks.nats = {
      status: 'down',
      message: error.message,
    };
    overallStatus = 'unhealthy';
  }

  const statusCode = overallStatus === 'healthy' ? 200 : 503;

  res.status(statusCode).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks,
  });
}

// Deep health check (detailed diagnostics)
export async function healthCheck(req: Request, res: Response) {
  const checks: HealthCheck['checks'] = {};
  let overallStatus: HealthCheck['status'] = 'healthy';

  // Database check with connection count
  try {
    const dbStart = Date.now();
    const result = await db.query(`
      SELECT count(*) as conn_count
      FROM pg_stat_activity
      WHERE datname = current_database()
    `);
    const connCount = parseInt(result.rows[0].conn_count);

    checks.database = {
      status: 'up',
      responseTime: Date.now() - dbStart,
      message: `${connCount} connections`,
    };

    if (connCount > 80) {
      overallStatus = 'degraded';
    }
  } catch (error) {
    checks.database = {
      status: 'down',
      message: error.message,
    };
    overallStatus = 'unhealthy';
  }

  // NATS JetStream check with consumer lag
  try {
    const js = natsClient.jetstream();
    const stream = await js.streams.get('EVENTS');
    const info = await stream.info();

    checks.nats_jetstream = {
      status: 'up',
      message: `${info.state.messages} messages`,
    };

    // Check consumer lag
    const consumers = await stream.consumers.list().next();
    for await (const consumer of consumers) {
      const consumerInfo = await consumer.info();
      const lag = consumerInfo.num_pending;

      if (lag > 10000) {
        checks.nats_jetstream.status = 'down';
        checks.nats_jetstream.message = `High lag: ${lag}`;
        overallStatus = 'degraded';
      }
    }
  } catch (error) {
    checks.nats_jetstream = {
      status: 'down',
      message: error.message,
    };
    overallStatus = 'unhealthy';
  }

  // Memory check
  const memUsage = process.memoryUsage();
  const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  checks.memory = {
    status: heapUsedPercent > 90 ? 'down' : 'up',
    message: `Heap: ${heapUsedPercent.toFixed(1)}%`,
  };

  if (heapUsedPercent > 90) {
    overallStatus = 'degraded';
  }

  // Disk space check (using Node.js fs APIs)
  try {
    const stats = await fs.statfs('/');
    const totalSpace = stats.blocks * stats.bsize;
    const freeSpace = stats.bfree * stats.bsize;
    const usedPercent = ((totalSpace - freeSpace) / totalSpace) * 100;

    checks.disk = {
      status: usedPercent > 90 ? 'down' : 'up',
      message: `${usedPercent.toFixed(1)}% used`,
    };

    if (usedPercent > 90) {
      overallStatus = 'degraded';
    }
  } catch (error) {
    checks.disk = {
      status: 'down',
      message: error.message,
    };
  }

  // Event loop lag check
  const eventLoopLag = getEventLoopLag();
  checks.event_loop = {
    status: eventLoopLag > 100 ? 'down' : 'up',
    message: `${eventLoopLag}ms lag`,
  };

  if (eventLoopLag > 100) {
    overallStatus = 'degraded';
  }

  const statusCode = overallStatus === 'healthy' ? 200 : 503;

  res.status(statusCode).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || 'unknown',
    uptime: process.uptime(),
    checks,
  });
}

// Event loop lag measurement
let lastCheck = Date.now();
let eventLoopLag = 0;

setInterval(() => {
  const now = Date.now();
  eventLoopLag = now - lastCheck - 1000;
  lastCheck = now;
}, 1000);

function getEventLoopLag(): number {
  return eventLoopLag;
}
```

**Routes**:
```typescript
// app.ts
import express from 'express';
import { livenessCheck, readinessCheck, healthCheck } from './health';

const app = express();

// Kubernetes probes
app.get('/healthz', livenessCheck);        // Liveness
app.get('/ready', readinessCheck);         // Readiness

// Detailed health
app.get('/health', healthCheck);           // Deep health check

export default app;
```

## Kubernetes Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: backend:latest
        ports:
        - containerPort: 3000

        # Startup probe (for slow-starting apps)
        startupProbe:
          httpGet:
            path: /healthz
            port: 3000
          failureThreshold: 30
          periodSeconds: 10

        # Liveness probe (restart if fails)
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        # Readiness probe (remove from service if fails)
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3

        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Prometheus Metrics

```typescript
// metrics.ts
import promClient from 'prom-client';

// Create registry
const register = new promClient.Registry();

// Default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom health metrics
const healthStatus = new promClient.Gauge({
  name: 'app_health_status',
  help: 'Application health status (1 = healthy, 0 = unhealthy)',
  labelNames: ['component'],
  registers: [register],
});

const healthCheckDuration = new promClient.Histogram({
  name: 'app_health_check_duration_seconds',
  help: 'Health check duration in seconds',
  labelNames: ['component'],
  registers: [register],
});

// Update metrics from health checks
export function updateHealthMetrics(checks: any) {
  for (const [component, check] of Object.entries(checks)) {
    const status = check.status === 'up' ? 1 : 0;
    healthStatus.set({ component }, status);

    if (check.responseTime) {
      healthCheckDuration.observe(
        { component },
        check.responseTime / 1000
      );
    }
  }
}

// Metrics endpoint
export function metricsHandler(req: any, res: any) {
  res.setHeader('Content-Type', register.contentType);
  register.metrics().then((metrics) => res.send(metrics));
}
```

## Alerting Rules

**Prometheus Alert Rules**:
```yaml
groups:
  - name: application_health
    interval: 30s
    rules:
      - alert: ApplicationUnhealthy
        expr: app_health_status == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Application {{ $labels.component }} is unhealthy"

      - alert: HighEventLoopLag
        expr: app_event_loop_lag_ms > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High event loop lag detected"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 450
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Memory usage above 450MB"

      - alert: DatabaseConnectionPoolExhausted
        expr: pg_pool_available_connections < 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool nearly exhausted"
```

## Circuit Breaker

```typescript
// circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
      console.error(`Circuit breaker OPEN after ${this.failures} failures`);
    }
  }

  getState() {
    return this.state;
  }
}

// Usage
const dbCircuitBreaker = new CircuitBreaker(5, 60000);

async function queryWithCircuitBreaker(query: string) {
  return dbCircuitBreaker.execute(() => db.query(query));
}
```

## Example Tasks

- "Set up health check endpoints"
- "Configure Kubernetes probes"
- "Create deep health check with dependencies"
- "Implement circuit breaker for database"
- "Set up Prometheus metrics for health"
- "Create alerting rules for unhealthy services"

## Output Format

Provide complete health check implementation with endpoints, Kubernetes configs, monitoring integration, and alerting rules.
