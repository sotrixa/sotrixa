# Performance Profiling

Profile and optimize Node.js application performance for CPU, memory, and event loop.

## When to Use

- Diagnosing slow endpoints
- Investigating memory leaks
- Optimizing CPU-heavy operations
- Analyzing event loop lag
- Troubleshooting performance degradation
- Pre-production performance validation

## Tech Stack Context

- **Backend**: Node.js + Express + TypeScript
- **Event Bus**: NATS JetStream
- **Database**: PostgreSQL
- **Tools**: Node.js profiler, clinic.js, 0x, Chrome DevTools

## Instructions

When profiling Node.js applications:

1. **Types of Performance Issues**:
   - **CPU**: Synchronous operations blocking event loop
   - **Memory**: Leaks, large objects, inefficient caching
   - **I/O**: Database queries, file operations, external APIs
   - **Event Loop**: Blocking operations, microtask queue overflow
   - **Async**: Promise chains, unhandled rejections

2. **Profiling Tools**:
   - **Node.js built-in**: `--inspect`, `--prof`, `--trace-*`
   - **clinic.js**: Doctor, Flame, Bubbleprof
   - **0x**: Flamegraph generator
   - **Chrome DevTools**: Memory snapshots, CPU profiling
   - **autocannon/k6**: HTTP benchmarking

3. **Profiling Workflow**:
   1. Establish baseline metrics
   2. Reproduce performance issue
   3. Collect profiling data
   4. Analyze bottlenecks
   5. Implement optimizations
   6. Validate improvements
   7. Monitor in production

4. **Common Optimizations**:
   - Cache expensive operations
   - Use streaming for large data
   - Optimize database queries
   - Implement pagination
   - Use worker threads for CPU-heavy tasks
   - Optimize JSON serialization
   - Reduce object allocations

5. **Monitoring Metrics**:
   - Response time (p50, p95, p99)
   - Throughput (requests/sec)
   - Memory usage (heap, RSS)
   - Event loop lag
   - CPU usage
   - Error rate

## CPU Profiling

**Built-in Profiler**:
```bash
# Generate CPU profile
node --prof app.js

# Run load test
autocannon -c 100 -d 30 http://localhost:3000

# Stop app (Ctrl+C)

# Process profile data
node --prof-process isolate-*.log > processed.txt

# Analyze processed.txt for hot functions
```

**clinic.js Flame** (CPU Flamegraph):
```bash
# Install
npm install -g clinic

# Profile application
clinic flame -- node app.js

# Run load test in another terminal
autocannon -c 100 -d 30 http://localhost:3000

# Stop app (Ctrl+C)
# Opens browser with flamegraph
```

**0x Flamegraph**:
```bash
# Install
npm install -g 0x

# Profile with flamegraph
0x app.js

# Run load test
autocannon -c 100 -d 30 http://localhost:3000

# Stop app (Ctrl+C)
# Generates interactive flamegraph
```

## Memory Profiling

**Heap Snapshots** (Chrome DevTools):
```bash
# Start with inspector
node --inspect app.js

# Open chrome://inspect in Chrome
# Click "inspect" on your Node process
# Go to Memory tab
# Take heap snapshot before load
# Run load test
# Take heap snapshot after
# Compare snapshots to find leaks
```

**clinic.js Doctor** (Detects issues):
```bash
# Automatically detects I/O, event loop, memory issues
clinic doctor -- node app.js

# Run load test
autocannon -c 100 -d 30 http://localhost:3000

# Stop app
# Opens browser with diagnosis
```

**Memory Leak Detection**:
```typescript
// memory-monitor.ts
import v8 from 'v8';
import { writeFileSync } from 'fs';

export function takeHeapSnapshot(filename: string) {
  const snapshotStream = v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${snapshotStream}`);
}

// Periodic memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();

  console.log({
    type: 'memory_usage',
    rss: Math.round(memUsage.rss / 1024 / 1024), // MB
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024),
  });

  // Alert if heap usage > 80%
  const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  if (heapUsagePercent > 80) {
    console.warn('High heap usage:', heapUsagePercent.toFixed(2) + '%');
    takeHeapSnapshot(`heap-${Date.now()}.heapsnapshot`);
  }
}, 30000); // Every 30 seconds
```

## Event Loop Monitoring

**Event Loop Lag**:
```typescript
// event-loop-monitor.ts
let lastCheck = Date.now();

setInterval(() => {
  const now = Date.now();
  const lag = now - lastCheck - 1000; // Expected 1000ms interval

  if (lag > 100) {
    console.warn({
      type: 'event_loop_lag',
      lag,
      timestamp: now,
    });
  }

  lastCheck = now;
}, 1000);
```

**clinic.js Bubbleprof** (Async Operations):
```bash
# Visualizes async operations and delays
clinic bubbleprof -- node app.js

# Run load test
autocannon -c 100 -d 30 http://localhost:3000

# Stop app
# Shows async operation bubbles
```

## Database Query Optimization

**Slow Query Logging**:
```typescript
// database-monitor.ts
import { Pool } from 'pg';

const pool = new Pool({
  /* config */
});

// Log slow queries
const originalQuery = pool.query.bind(pool);
pool.query = async (text: string, params?: any[]) => {
  const start = Date.now();

  try {
    const result = await originalQuery(text, params);
    const duration = Date.now() - start;

    if (duration > 100) {
      console.warn({
        type: 'slow_query',
        query: text.substring(0, 100),
        duration,
      });
    }

    return result;
  } catch (error) {
    console.error({
      type: 'query_error',
      query: text.substring(0, 100),
      error: error.message,
    });
    throw error;
  }
};
```

**EXPLAIN ANALYZE**:
```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Find slow queries (requires pg_stat_statements)
SELECT
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Common Optimizations

**Caching**:
```typescript
// Simple in-memory cache with TTL
class Cache<T> {
  private cache = new Map<string, { value: T; expires: number }>();

  set(key: string, value: T, ttlMs: number) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttlMs,
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  // Periodic cleanup
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

const userCache = new Cache<User>();
setInterval(() => userCache.cleanup(), 60000); // Cleanup every minute
```

**Streaming Large Responses**:
```typescript
// Instead of loading all data in memory
app.get('/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.write('[');

  let first = true;
  const stream = db.query('SELECT * FROM large_table');

  for await (const row of stream) {
    if (!first) res.write(',');
    res.write(JSON.stringify(row));
    first = false;
  }

  res.write(']');
  res.end();
});
```

**Worker Threads for CPU-Intensive Tasks**:
```typescript
// worker.ts
import { parentPort } from 'worker_threads';

parentPort?.on('message', (data) => {
  const result = heavyCpuComputation(data);
  parentPort?.postMessage(result);
});

// main.ts
import { Worker } from 'worker_threads';

function runWorker(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.postMessage(data);
  });
}
```

## Benchmarking

```bash
# HTTP benchmarking
autocannon -c 100 -d 30 http://localhost:3000/api/users

# With custom payload
autocannon -c 100 -d 30 -m POST \
  -H "Content-Type: application/json" \
  -b '{"name":"test"}' \
  http://localhost:3000/api/users

# k6 script
k6 run --vus 100 --duration 30s load-test.js
```

## Example Tasks

- "Profile CPU usage of user endpoint"
- "Find memory leak in application"
- "Optimize slow database queries"
- "Measure event loop lag"
- "Analyze flamegraph for bottlenecks"
- "Set up performance monitoring"

## Performance Checklist

- [ ] Established baseline metrics
- [ ] Profiled CPU hotspots
- [ ] Checked for memory leaks
- [ ] Monitored event loop lag
- [ ] Optimized database queries
- [ ] Implemented caching
- [ ] Used streaming for large data
- [ ] Validated improvements with load tests
- [ ] Set up production monitoring

## Output Format

Provide profiling commands, analysis of bottlenecks, specific optimizations with code examples, and validation results.
