# Log Analysis

Implement structured logging and log analysis for Node.js applications and infrastructure.

## When to Use

- Setting up structured logging
- Debugging production issues
- Analyzing application behavior
- Creating log dashboards
- Implementing log aggregation
- Troubleshooting errors

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Event Bus**: NATS JetStream
- **Logging**: Pino, Winston, or Bunyan
- **Aggregation**: Loki, ELK Stack, or Grafana Cloud
- **Hosting**: Hetzner Cloud

## Instructions

When implementing log analysis:

1. **Structured Logging**:
   - Use JSON format for machine readability
   - Include standard fields: timestamp, level, message, context
   - Add request IDs for tracing
   - Log business events, not just errors
   - Use appropriate log levels (error, warn, info, debug)

2. **Log Aggregation Stack** (choose one):
   - **Grafana Loki + Promtail**: Lightweight, good for K8s
   - **ELK Stack** (Elasticsearch, Logstash, Kibana): Powerful, resource-heavy
   - **Grafana Cloud**: Managed, pay-as-you-go
   - **Cloud Logging**: Hetzner doesn't have native, use external

3. **What to Log**:
   - **Application events**: User actions, business logic
   - **Errors**: Stack traces, context
   - **Performance**: Slow queries, request duration
   - **Security**: Authentication attempts, authorization failures
   - **NATS events**: Published/consumed messages, errors
   - **External API calls**: Requests, responses, failures

4. **Log Levels**:
   - **error**: Application errors, exceptions
   - **warn**: Potentially harmful situations
   - **info**: Important business events
   - **http**: HTTP requests/responses (use middleware)
   - **debug**: Detailed diagnostic information
   - **trace**: Very detailed, including data payloads

5. **Best Practices**:
   - Never log sensitive data (passwords, tokens, PII)
   - Use correlation IDs to trace requests
   - Sample high-volume logs if needed
   - Implement log rotation
   - Set retention policies
   - Monitor log volume costs

6. **Common Analysis Patterns**:
   - Error rate monitoring
   - Slow request detection
   - User behavior analysis
   - Event correlation
   - Anomaly detection

## Pino Setup (Recommended for Node.js)

```typescript
// logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'token',
      'apiKey',
    ],
    remove: true,
  },
});

// Add request ID to all logs
export const childLogger = (requestId: string) => {
  return logger.child({ requestId });
};

export default logger;
```

**Express Middleware**:
```typescript
// logging-middleware.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger, { childLogger } from './logger';

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  // Attach logger to request
  req.log = childLogger(requestId);

  // Log incoming request
  req.log.info({
    type: 'http_request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    req.log.info({
      type: 'http_response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
    });

    // Warn on slow requests
    if (duration > 1000) {
      req.log.warn({
        type: 'slow_request',
        method: req.method,
        url: req.url,
        duration,
      });
    }
  });

  next();
};
```

**Business Logic Logging**:
```typescript
// user-service.ts
import logger from './logger';

export class UserService {
  async createUser(data: CreateUserDto) {
    logger.info({
      type: 'user_create_start',
      email: data.email,
    });

    try {
      const user = await this.userRepository.create(data);

      logger.info({
        type: 'user_created',
        userId: user.id,
        email: user.email,
      });

      return user;
    } catch (error) {
      logger.error({
        type: 'user_create_failed',
        email: data.email,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }
}
```

**NATS Event Logging**:
```typescript
// nats-logger.ts
import { JetStreamClient } from 'nats';
import logger from './logger';

export const logNatsEvent = (
  type: 'publish' | 'consume',
  subject: string,
  data: any,
  error?: Error
) => {
  if (error) {
    logger.error({
      type: `nats_${type}_failed`,
      subject,
      error: error.message,
      stack: error.stack,
    });
  } else {
    logger.info({
      type: `nats_${type}`,
      subject,
      messageSize: JSON.stringify(data).length,
    });
  }
};

// Usage
await js.publish('events.user.created', data);
logNatsEvent('publish', 'events.user.created', data);
```

## Grafana Loki Setup

**Promtail Config** (collects logs):
```yaml
# promtail-config.yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: nodejs-app
    static_configs:
      - targets:
          - localhost
        labels:
          job: backend
          __path__: /var/log/app/*.log

    pipeline_stages:
      - json:
          expressions:
            level: level
            timestamp: time
            message: msg
      - labels:
          level:
      - timestamp:
          source: timestamp
          format: RFC3339
```

**Docker Compose for Loki**:
```yaml
version: '3'

services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
      - loki-data:/loki

  promtail:
    image: grafana/promtail:latest
    volumes:
      - ./promtail-config.yml:/etc/promtail/config.yml
      - /var/log:/var/log
    command: -config.file=/etc/promtail/config.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  loki-data:
  grafana-data:
```

## LogQL Queries (Loki)

```logql
# All error logs
{job="backend"} |= "level=ERROR"

# Slow requests (> 1s)
{job="backend"} | json | duration > 1000

# Failed NATS publishes
{job="backend"} | json | type="nats_publish_failed"

# Requests by status code
sum by (statusCode) (rate({job="backend"} | json [5m]))

# Error rate over time
sum(rate({job="backend"} |= "level=ERROR" [5m]))

# Top 10 slowest endpoints
topk(10,
  sum by (url) (
    rate({job="backend"} | json | duration > 1000 [5m])
  )
)
```

## Log Rotation

```bash
# /etc/logrotate.d/nodejs-app
/var/log/app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 nodejs nodejs
    sharedscripts
    postrotate
        systemctl reload nodejs-app
    endscript
}
```

## Example Tasks

- "Set up structured logging with Pino"
- "Configure Grafana Loki for log aggregation"
- "Create dashboard for error monitoring"
- "Debug production error from logs"
- "Analyze slow requests"
- "Set up log alerts for critical errors"

## Monitoring Queries

**Error Rate Alert**:
```promql
rate({job="backend"} |= "level=ERROR" [5m]) > 0.1
```

**High Response Time**:
```logql
avg(rate({job="backend"} | json | __error__="" | duration > 0 [5m])) > 500
```

**NATS Consumer Lag**:
```logql
{job="backend"} | json | type="nats_consumer_lag" | lag > 1000
```

## Output Format

Provide complete logging setup with structured logger, middleware, query examples, and dashboard configs. Include monitoring alerts.
