# NATS JetStream Event Bus

Implement and manage event-driven architecture using NATS JetStream for Node.js applications.

## When to Use

- Implementing event-driven patterns
- Setting up NATS JetStream infrastructure
- Creating event publishers and consumers
- Debugging event processing issues
- Optimizing message throughput
- Implementing saga patterns

## Tech Stack Context

- **Event Bus**: NATS JetStream
- **Backend**: Node.js + Express + TypeScript
- **Client Library**: nats.js
- **Message Format**: JSON
- **Patterns**: Event sourcing, CQRS, Saga

## Instructions

When working with NATS JetStream:

1. **Core Concepts**:
   - **Stream**: Persistent message store (like a topic in Kafka)
   - **Subject**: Message address/routing key
   - **Consumer**: Reads messages from stream
   - **Publisher**: Sends messages to subjects
   - **ACK**: Acknowledgment of message processing

2. **Stream Configuration**:
   - **Retention**: Limits, interest, work queue
   - **Storage**: File or memory
   - **Replicas**: For high availability
   - **Max age**: Message TTL
   - **Max messages**: Capacity limit

3. **Consumer Types**:
   - **Push**: Server pushes messages to client
   - **Pull**: Client pulls messages on demand
   - **Durable**: Maintains position across restarts
   - **Ephemeral**: Position lost on disconnect

4. **Delivery Semantics**:
   - **At-least-once**: Default, may redeliver
   - **Exactly-once**: Requires idempotent handlers
   - **At-most-once**: Fire and forget (no ACK)

5. **Error Handling**:
   - **NAK**: Negative acknowledgment (requeue)
   - **NAK with delay**: Requeue after delay
   - **Term**: Don't redeliver this message
   - **Dead letter queue**: Failed messages
   - **Max redeliveries**: Prevent infinite loops

6. **Best Practices**:
   - Use hierarchical subjects (events.users.created)
   - Make consumers idempotent
   - Include correlation IDs
   - Monitor consumer lag
   - Set appropriate AckWait times
   - Use structured payloads with versioning

## NATS Setup

**Docker Compose**:
```yaml
version: '3'
services:
  nats:
    image: nats:latest
    command:
      - "-js"
      - "-sd=/data"
    ports:
      - "4222:4222"   # Client connections
      - "8222:8222"   # HTTP monitoring
      - "6222:6222"   # Cluster routing
    volumes:
      - nats-data:/data

volumes:
  nats-data:
```

**Kubernetes**:
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: nats
spec:
  serviceName: nats
  replicas: 3
  selector:
    matchLabels:
      app: nats
  template:
    metadata:
      labels:
        app: nats
    spec:
      containers:
      - name: nats
        image: nats:latest
        args:
        - "-js"
        - "-sd=/data"
        - "-clustername=dikrasin"
        - "-cluster=nats://0.0.0.0:6222"
        - "-routes=nats://nats-0.nats:6222,nats://nats-1.nats:6222,nats://nats-2.nats:6222"
        ports:
        - containerPort: 4222
          name: client
        - containerPort: 8222
          name: monitor
        - containerPort: 6222
          name: cluster
        volumeMounts:
        - name: data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## Client Implementation

**Connection Setup**:
```typescript
// nats-client.ts
import { connect, NatsConnection, JetStreamClient } from 'nats';
import logger from './logger';

let nc: NatsConnection;
let js: JetStreamClient;

export async function connectNats(): Promise<void> {
  try {
    nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
      name: 'dikrasin-backend',
      maxReconnectAttempts: -1, // Infinite reconnection
      reconnectTimeWait: 1000,   // 1 second between attempts
    });

    logger.info('Connected to NATS');

    // Handle connection events
    nc.closed().then((err) => {
      if (err) {
        logger.error('NATS connection closed with error:', err);
      } else {
        logger.info('NATS connection closed');
      }
    });

    // Get JetStream context
    js = nc.jetstream();

    // Set up streams
    await setupStreams();

  } catch (error) {
    logger.error('Failed to connect to NATS:', error);
    throw error;
  }
}

async function setupStreams(): Promise<void> {
  const jsm = await nc.jetstreamManager();

  // Create EVENTS stream
  try {
    await jsm.streams.add({
      name: 'EVENTS',
      subjects: ['events.>'],
      retention: 'limits',
      storage: 'file',
      max_age: 7 * 24 * 60 * 60 * 1_000_000_000, // 7 days (nanoseconds)
      max_msgs: 1_000_000,
      replicas: 3,
    });

    logger.info('EVENTS stream created/updated');
  } catch (error) {
    if (error.message.includes('already exists')) {
      logger.info('EVENTS stream already exists');
    } else {
      throw error;
    }
  }
}

export function getNatsClient(): NatsConnection {
  return nc;
}

export function getJetStream(): JetStreamClient {
  return js;
}

export async function closeNats(): Promise<void> {
  await nc.drain();
  await nc.close();
}
```

**Event Publisher**:
```typescript
// event-publisher.ts
import { getJetStream } from './nats-client';
import { JSONCodec } from 'nats';
import logger from './logger';

const codec = JSONCodec();

interface BaseEvent {
  id: string;
  type: string;
  timestamp: string;
  correlationId?: string;
  causationId?: string;
}

export async function publishEvent<T extends BaseEvent>(
  subject: string,
  event: T
): Promise<void> {
  const js = getJetStream();

  try {
    const ack = await js.publish(
      subject,
      codec.encode(event),
      { msgID: event.id } // Deduplication
    );

    logger.info({
      type: 'event_published',
      subject,
      eventId: event.id,
      eventType: event.type,
      stream: ack.stream,
      sequence: ack.seq,
    });
  } catch (error) {
    logger.error({
      type: 'event_publish_failed',
      subject,
      eventId: event.id,
      error: error.message,
    });
    throw error;
  }
}

// Usage example
interface UserCreatedEvent extends BaseEvent {
  type: 'user.created';
  data: {
    userId: string;
    email: string;
    name: string;
  };
}

export async function publishUserCreated(
  userId: string,
  email: string,
  name: string
): Promise<void> {
  const event: UserCreatedEvent = {
    id: crypto.randomUUID(),
    type: 'user.created',
    timestamp: new Date().toISOString(),
    data: { userId, email, name },
  };

  await publishEvent('events.users.created', event);
}
```

**Event Consumer**:
```typescript
// event-consumer.ts
import { getNatsClient, getJetStream } from './nats-client';
import { AckPolicy, DeliverPolicy, JSONCodec } from 'nats';
import logger from './logger';

const codec = JSONCodec();

export interface ConsumeOptions {
  streamName: string;
  consumerName: string;
  filterSubject: string;
  handler: (event: any) => Promise<void>;
  maxRetries?: number;
  ackWait?: number; // milliseconds
  batchSize?: number;
}

export async function consumeEvents(options: ConsumeOptions): Promise<void> {
  const {
    streamName,
    consumerName,
    filterSubject,
    handler,
    maxRetries = 5,
    ackWait = 30000, // 30 seconds
    batchSize = 10,
  } = options;

  const js = getJetStream();
  const jsm = await getNatsClient().jetstreamManager();

  // Create durable consumer
  try {
    await jsm.consumers.add(streamName, {
      durable_name: consumerName,
      filter_subject: filterSubject,
      ack_policy: AckPolicy.Explicit,
      ack_wait: ackWait * 1_000_000, // Convert to nanoseconds
      deliver_policy: DeliverPolicy.All,
      max_deliver: maxRetries,
      max_ack_pending: batchSize,
    });

    logger.info({
      type: 'consumer_created',
      stream: streamName,
      consumer: consumerName,
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      logger.info({
        type: 'consumer_exists',
        stream: streamName,
        consumer: consumerName,
      });
    } else {
      throw error;
    }
  }

  // Start consuming messages
  const consumer = await js.consumers.get(streamName, consumerName);
  const messages = await consumer.consume();

  logger.info({
    type: 'consumer_started',
    stream: streamName,
    consumer: consumerName,
    filter: filterSubject,
  });

  for await (const msg of messages) {
    const startTime = Date.now();

    try {
      const event = codec.decode(msg.data);

      logger.info({
        type: 'event_received',
        subject: msg.subject,
        eventId: event.id,
        eventType: event.type,
        deliveryCount: msg.info.redelivered ? msg.info.deliveryCount : 1,
      });

      // Process event
      await handler(event);

      // Acknowledge successful processing
      msg.ack();

      const duration = Date.now() - startTime;
      logger.info({
        type: 'event_processed',
        subject: msg.subject,
        eventId: event.id,
        duration,
      });

    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error({
        type: 'event_processing_failed',
        subject: msg.subject,
        error: error.message,
        stack: error.stack,
        duration,
        deliveryCount: msg.info.deliveryCount,
      });

      // Check if max retries exceeded
      if (msg.info.deliveryCount >= maxRetries) {
        logger.error({
          type: 'event_max_retries',
          subject: msg.subject,
          deliveryCount: msg.info.deliveryCount,
        });

        // Move to DLQ or term
        msg.term();

        // Optionally publish to DLQ
        await publishToDLQ(msg);
      } else {
        // NAK with delay (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, msg.info.deliveryCount), 60000);
        msg.nak(delay);
      }
    }
  }
}

async function publishToDLQ(msg: any): Promise<void> {
  try {
    const js = getJetStream();
    await js.publish(
      `dlq.${msg.subject}`,
      msg.data,
      {
        headers: {
          'original-subject': msg.subject,
          'failure-reason': 'Max retries exceeded',
        },
      }
    );
  } catch (error) {
    logger.error('Failed to publish to DLQ:', error);
  }
}
```

**Consumer Example**:
```typescript
// user-consumer.ts
import { consumeEvents } from './event-consumer';
import { sendWelcomeEmail } from './email-service';

export async function startUserConsumer(): Promise<void> {
  await consumeEvents({
    streamName: 'EVENTS',
    consumerName: 'email-sender',
    filterSubject: 'events.users.created',
    handler: async (event) => {
      // Idempotent check (store processed event IDs)
      const alreadyProcessed = await checkIfProcessed(event.id);
      if (alreadyProcessed) {
        return; // Skip already processed event
      }

      // Process event
      await sendWelcomeEmail(
        event.data.email,
        event.data.name
      );

      // Mark as processed
      await markAsProcessed(event.id);
    },
    maxRetries: 3,
    ackWait: 30000,
  });
}
```

## Monitoring

**Consumer Lag**:
```typescript
// monitor-lag.ts
import { getNatsClient } from './nats-client';
import logger from './logger';

export async function monitorConsumerLag(): Promise<void> {
  const nc = getNatsClient();
  const jsm = await nc.jetstreamManager();

  const streamInfo = await jsm.streams.info('EVENTS');

  for (const consumerName of streamInfo.state.consumers) {
    const consumerInfo = await jsm.consumers.info('EVENTS', consumerName);

    const lag = consumerInfo.num_pending;

    logger.info({
      type: 'consumer_lag',
      consumer: consumerName,
      lag,
      delivered: consumerInfo.delivered.stream_seq,
      ack_pending: consumerInfo.num_ack_pending,
    });

    // Alert if lag too high
    if (lag > 10000) {
      logger.warn({
        type: 'high_consumer_lag',
        consumer: consumerName,
        lag,
      });
    }
  }
}

// Run every minute
setInterval(monitorConsumerLag, 60000);
```

**Prometheus Metrics**:
```typescript
// nats-metrics.ts
import promClient from 'prom-client';

export const natsPublishDuration = new promClient.Histogram({
  name: 'nats_publish_duration_seconds',
  help: 'NATS publish duration',
  labelNames: ['subject'],
});

export const natsConsumeCounter = new promClient.Counter({
  name: 'nats_messages_consumed_total',
  help: 'Total messages consumed',
  labelNames: ['subject', 'status'], // status: success/failure
});

export const natsConsumerLag = new promClient.Gauge({
  name: 'nats_consumer_lag',
  help: 'Number of pending messages',
  labelNames: ['consumer'],
});
```

## Saga Pattern

```typescript
// order-saga.ts
import { publishEvent, consumeEvents } from './event-publisher';

// Orchestration-based Saga
export class OrderSaga {
  async startSaga(orderId: string, userId: string, items: any[]): Promise<void> {
    // Step 1: Reserve inventory
    await publishEvent('events.orders.inventory-reserve', {
      id: crypto.randomUUID(),
      type: 'inventory.reserve',
      timestamp: new Date().toISOString(),
      data: { orderId, items },
    });

    // Wait for inventory.reserved or inventory.failed events
    // If failed, publish order.cancelled
  }

  // Compensating transactions
  async compensateInventory(orderId: string): Promise<void> {
    await publishEvent('events.orders.inventory-release', {
      id: crypto.randomUUID(),
      type: 'inventory.release',
      timestamp: new Date().toISOString(),
      data: { orderId },
    });
  }
}
```

## Example Tasks

- "Set up NATS JetStream with Node.js"
- "Create event publisher for user events"
- "Implement consumer with retry logic"
- "Debug consumer lag issues"
- "Set up dead letter queue"
- "Implement saga pattern for orders"

## Troubleshooting

**Consumer not receiving messages**:
```bash
# Check stream
nats stream info EVENTS

# Check consumer
nats consumer info EVENTS email-sender

# Check subject filter
nats sub 'events.users.>' --count=10
```

**High consumer lag**:
- Scale consumers horizontally
- Optimize handler performance
- Increase batch size
- Check for blocking operations

**Message redeliveries**:
- Increase ackWait time
- Make handlers idempotent
- Check for unhandled errors
- Review max_deliver setting

## Output Format

Provide complete NATS JetStream setup, publisher/consumer implementations, error handling, monitoring, and troubleshooting guides.
