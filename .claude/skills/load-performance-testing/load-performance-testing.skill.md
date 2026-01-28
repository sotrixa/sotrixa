# Load & Performance Testing

Conduct load testing and performance analysis for event-driven Node.js applications.

## When to Use

- Testing API endpoint performance
- Stress testing NATS JetStream event processing
- Identifying performance bottlenecks
- Validating system capacity
- Testing scalability under load
- Preparing for production traffic

## Tech Stack Context

- **Backend**: Node.js + Express
- **Event Bus**: NATS JetStream
- **Database**: PostgreSQL
- **Load Testing**: k6, Artillery, or Autocannon
- **Profiling**: Node.js built-in profiler, clinic.js

## Instructions

When conducting load/performance testing:

1. **Load Testing Tools**:
   - **k6**: Modern, scriptable, great for APIs and WebSockets
   - **Artillery**: YAML configs, good for complex scenarios
   - **Autocannon**: Fast HTTP benchmarking for Node.js
   - **wrk**: HTTP benchmarking (C-based, very fast)

2. **Test Scenarios**:
   - **Baseline**: Normal expected load
   - **Stress**: Push beyond capacity to find breaking point
   - **Spike**: Sudden traffic increase
   - **Soak**: Sustained load over time (memory leaks)
   - **Scalability**: Test horizontal scaling

3. **Metrics to Track**:
   - **Response time**: p50, p95, p99 latencies
   - **Throughput**: Requests per second
   - **Error rate**: Failed requests %
   - **Resource usage**: CPU, memory, connections
   - **Event lag**: NATS JetStream consumer lag

4. **Node.js Performance Profiling**:
   - Use `--inspect` flag for Chrome DevTools
   - Use clinic.js for visual profiling
   - Track event loop lag
   - Monitor memory heap
   - Profile CPU usage

5. **NATS JetStream Testing**:
   - Test publisher throughput
   - Test consumer processing rate
   - Measure message latency
   - Test with multiple consumers
   - Validate message ordering

6. **Database Performance**:
   - Test query performance under load
   - Monitor connection pool usage
   - Check for slow queries
   - Test with realistic data volumes

## Example k6 Script

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 100 }, // Spike
    { duration: '1m', target: 100 },  // Stay at 100
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.dikrasin.bg/health');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

## Example Artillery Config

```yaml
config:
  target: 'https://api.dikrasin.bg'
  phases:
    - duration: 60
      arrivalRate: 10  # 10 users per second
    - duration: 120
      arrivalRate: 50  # Ramp to 50 users/sec
  plugins:
    expect: {}

scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/api/users"
          expect:
            - statusCode: 200
            - contentType: json
      - post:
          url: "/api/events"
          json:
            type: "user.created"
            data: { userId: "{{ $randomString() }}" }
          expect:
            - statusCode: 201
```

## Performance Profiling

```bash
# CPU Profiling
node --prof app.js
# After stopping, process tick logs:
node --prof-process isolate-*.log > processed.txt

# Clinic.js Doctor (detects issues)
clinic doctor -- node app.js

# Clinic.js Flame (CPU flamegraph)
clinic flame -- node app.js

# Clinic.js Bubbleprof (async operations)
clinic bubbleprof -- node app.js

# Memory heap snapshot
node --inspect app.js
# Open chrome://inspect and take heap snapshot
```

## NATS Performance Test

```typescript
import { connect } from 'nats';

async function testNatsPublisher() {
  const nc = await connect({ servers: 'nats://localhost:4222' });
  const js = nc.jetstream();

  const start = Date.now();
  const messageCount = 10000;

  for (let i = 0; i < messageCount; i++) {
    await js.publish('events.test', JSON.stringify({ id: i }));
  }

  const duration = Date.now() - start;
  const throughput = messageCount / (duration / 1000);

  console.log(`Published ${messageCount} messages in ${duration}ms`);
  console.log(`Throughput: ${throughput.toFixed(2)} msg/sec`);
}
```

## Example Tasks

- "Create k6 load test for API endpoints"
- "Test NATS JetStream throughput"
- "Profile Node.js CPU usage"
- "Find performance bottleneck in user service"
- "Test system with 1000 concurrent users"
- "Measure p99 latency under load"

## Commands

```bash
# k6
k6 run load-test.js
k6 run --vus 100 --duration 30s load-test.js

# Artillery
artillery run load-test.yml
artillery quick --count 10 --num 100 https://api.dikrasin.bg

# Autocannon
autocannon -c 100 -d 30 https://api.dikrasin.bg/api/users

# wrk
wrk -t12 -c400 -d30s https://api.dikrasin.bg
```

## Output Format

Provide load test scripts, performance reports, and actionable recommendations based on results. Include graphs/metrics interpretation.
