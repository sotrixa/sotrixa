# Architecture Diagram Generation

Generate architecture diagrams and system documentation for event-driven applications.

## When to Use

- Documenting system architecture
- Creating technical diagrams
- Visualizing data flows
- Planning new features
- Onboarding new team members
- Architecture decision records (ADRs)

## Tech Stack Context

- **Architecture**: Event-driven, NATS JetStream
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 19 + TypeScript
- **Infrastructure**: Kubernetes on Hetzner Cloud
- **Diagrams**: Mermaid, PlantUML, Excalidraw

## Instructions

When creating architecture documentation:

1. **Diagram Types**:
   - **System Context**: High-level overview (C4 model level 1)
   - **Container**: Services, databases, message queues (C4 level 2)
   - **Component**: Internal structure of services (C4 level 3)
   - **Sequence**: Event flows, API interactions
   - **Deployment**: Infrastructure and hosting
   - **Data Flow**: How data moves through system
   - **ER Diagram**: Database schema

2. **Diagramming Tools**:
   - **Mermaid**: Text-based, version-controllable, renders in GitHub
   - **PlantUML**: More features, UML-focused
   - **Diagrams.net (draw.io)**: Visual editing
   - **Excalidraw**: Hand-drawn style, collaborative

3. **C4 Model Approach**:
   - **Level 1** (Context): System + users + external systems
   - **Level 2** (Container): Apps, databases, message brokers
   - **Level 3** (Component): Classes, modules within containers
   - **Level 4** (Code): Implementation details (rarely needed)

4. **Event-Driven Patterns**:
   - Show event publishers and consumers
   - Indicate event subjects/topics
   - Document event payloads
   - Show retry and error handling
   - Illustrate eventual consistency

5. **Best Practices**:
   - Keep diagrams simple and focused
   - Use consistent notation
   - Include legends
   - Version control diagrams (text-based when possible)
   - Keep diagrams up to date
   - Link from code to diagrams

## Mermaid Diagrams

**System Context (C4 Level 1)**:
```mermaid
C4Context
    title System Context - Dikrasin.bg

    Person(user, "User", "End user of the platform")
    System(webapp, "Web Application", "React 19 SPA")
    System_Ext(email, "Email Service", "SendGrid")
    System_Ext(payment, "Payment Gateway", "Stripe")

    System_Boundary(backend, "Dikrasin.bg Backend") {
        System(api, "API Server", "Node.js + Express")
        SystemDb(db, "Database", "PostgreSQL")
        System(events, "Event Bus", "NATS JetStream")
    }

    Rel(user, webapp, "Uses", "HTTPS")
    Rel(webapp, api, "API Calls", "HTTPS/REST")
    Rel(api, db, "Reads/Writes")
    Rel(api, events, "Publishes/Consumes events")
    Rel(api, email, "Sends emails", "API")
    Rel(api, payment, "Processes payments", "API")
```

**Container Diagram (C4 Level 2)**:
```mermaid
C4Container
    title Container Diagram - Backend Services

    Person(user, "User")

    Container_Boundary(frontend, "Frontend") {
        Container(webapp, "Web App", "React 19", "SPA")
    }

    Container_Boundary(backend, "Backend") {
        Container(api, "API Server", "Node.js/Express", "REST API")
        Container(auth, "Auth Service", "Node.js", "JWT authentication")
        Container(notification, "Notification Worker", "Node.js", "Consumes events, sends emails")
        ContainerDb(postgres, "Database", "PostgreSQL", "User data, transactions")
        Container(nats, "Message Broker", "NATS JetStream", "Event streaming")
    }

    Container_Ext(email, "Email Service", "SendGrid")

    Rel(user, webapp, "Uses", "HTTPS")
    Rel(webapp, api, "API calls", "JSON/HTTPS")
    Rel(api, auth, "Validates tokens", "Internal")
    Rel(api, postgres, "Reads/Writes")
    Rel(api, nats, "Publishes events")
    Rel(notification, nats, "Consumes events")
    Rel(notification, email, "Sends emails", "API")
```

**Event Flow Sequence**:
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    participant NATS
    participant Worker

    Client->>API: POST /api/users (create user)
    API->>DB: INSERT user
    DB-->>API: User created
    API->>NATS: Publish user.created event
    NATS-->>API: ACK
    API-->>Client: 201 Created

    NATS->>Worker: Consume user.created event
    Worker->>Worker: Generate welcome email
    Worker->>EmailService: Send email
    EmailService-->>Worker: Email sent
    Worker->>NATS: ACK event processed
```

**Deployment Diagram**:
```mermaid
graph TB
    subgraph "Hetzner Cloud"
        subgraph "Kubernetes Cluster"
            subgraph "API Pods"
                API1[API Pod 1]
                API2[API Pod 2]
                API3[API Pod 3]
            end

            subgraph "Worker Pods"
                W1[Worker Pod 1]
                W2[Worker Pod 2]
            end

            subgraph "Data Layer"
                PG[(PostgreSQL)]
                NATS[NATS JetStream]
            end

            LB[Load Balancer]
        end

        subgraph "Storage"
            VOL[Persistent Volumes]
        end
    end

    subgraph "External"
        CDN[Cloudflare CDN]
        DNS[DNS]
    end

    DNS --> CDN
    CDN --> LB
    LB --> API1
    LB --> API2
    LB --> API3

    API1 --> PG
    API2 --> PG
    API3 --> PG

    API1 --> NATS
    API2 --> NATS
    API3 --> NATS

    W1 --> NATS
    W2 --> NATS

    PG --> VOL
    NATS --> VOL
```

**Component Diagram (User Service)**:
```mermaid
graph TB
    subgraph "User Service"
        Controller[User Controller]
        Service[User Service]
        Repo[User Repository]
        EventPub[Event Publisher]
        Validator[Validation Middleware]
    end

    subgraph "External"
        DB[(PostgreSQL)]
        NATS[NATS JetStream]
    end

    HTTP[HTTP Request] --> Validator
    Validator --> Controller
    Controller --> Service
    Service --> Repo
    Service --> EventPub
    Repo --> DB
    EventPub --> NATS
```

**Entity Relationship Diagram**:
```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        uuid id PK
        string email UK
        string name
        enum role
        timestamp created_at
        timestamp updated_at
    }

    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal total
        enum status
        timestamp created_at
    }

    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT {
        uuid id PK
        string name
        text description
        decimal price
        int stock
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal price
    }
```

**Data Flow Diagram**:
```mermaid
flowchart LR
    User[User] -->|1. Submits order| API[API Server]
    API -->|2. Validate & Save| DB[(Database)]
    API -->|3. Publish event| NATS[NATS JetStream]

    NATS -->|4. order.created| PaymentWorker[Payment Worker]
    PaymentWorker -->|5. Process payment| Stripe[Stripe API]
    Stripe -->|6. Payment result| PaymentWorker
    PaymentWorker -->|7. Publish| NATS

    NATS -->|8. payment.completed| FullfillmentWorker[Fulfillment Worker]
    FullfillmentWorker -->|9. Create shipment| ShippingAPI[Shipping API]
    FullfillmentWorker -->|10. Update status| DB

    NATS -->|11. order.fulfilled| NotificationWorker[Notification Worker]
    NotificationWorker -->|12. Send email| EmailService[Email Service]
```

**NATS JetStream Architecture**:
```mermaid
graph TB
    subgraph "Publishers"
        API1[API Pod 1]
        API2[API Pod 2]
        Worker1[Worker 1]
    end

    subgraph "NATS JetStream"
        Stream[EVENTS Stream]
        subgraph "Consumers"
            C1[Email Consumer]
            C2[Analytics Consumer]
            C3[Audit Consumer]
        end
    end

    subgraph "Subscribers"
        Email[Email Worker]
        Analytics[Analytics Worker]
        Audit[Audit Worker]
    end

    API1 -->|user.created| Stream
    API2 -->|order.created| Stream
    Worker1 -->|payment.completed| Stream

    Stream --> C1
    Stream --> C2
    Stream --> C3

    C1 --> Email
    C2 --> Analytics
    C3 --> Audit
```

## PlantUML Examples

**Class Diagram**:
```plantuml
@startuml
class User {
  - id: UUID
  - email: string
  - password: string
  - role: Role
  + create(): Promise<User>
  + findById(id: UUID): Promise<User>
  + authenticate(email, password): Promise<string>
}

class Order {
  - id: UUID
  - userId: UUID
  - total: Decimal
  - status: OrderStatus
  + create(): Promise<Order>
  + findByUser(userId: UUID): Promise<Order[]>
  + updateStatus(status: OrderStatus): void
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  FULFILLED
  CANCELLED
}

User "1" -- "*" Order: places
@enduml
```

## Architecture Decision Record (ADR)

```markdown
# ADR-001: Use NATS JetStream for Event-Driven Architecture

## Status
Accepted

## Context
We need an event streaming platform for decoupling services and enabling event-driven architecture. Requirements:
- At-least-once delivery guarantees
- Message persistence
- Consumer acknowledgments
- Stream replay capabilities
- Low operational overhead

## Decision
Use NATS JetStream as our event streaming platform.

## Consequences

### Positive
- Lightweight compared to Kafka
- Built-in persistence and replay
- Easy deployment (single binary)
- Lower resource requirements
- Native Kubernetes support

### Negative
- Smaller ecosystem than Kafka
- Less mature for very high throughput (> 1M msg/sec)
- Fewer managed hosting options

## Alternatives Considered
1. **Apache Kafka**: More mature but higher operational complexity
2. **RabbitMQ**: Not designed for event streaming
3. **Redis Streams**: Limited persistence guarantees

## Implementation
- Deploy NATS JetStream on Kubernetes
- Use durable consumers for all workers
- Implement dead letter queue for failed messages
- Monitor consumer lag via metrics
```

## Example Tasks

- "Create system context diagram"
- "Document event flow for user registration"
- "Generate deployment architecture diagram"
- "Create ER diagram for database"
- "Document microservices architecture"
- "Write ADR for technology choice"

## Tools Setup

**Mermaid CLI**:
```bash
npm install -g @mermaid-js/mermaid-cli

# Generate PNG from mermaid file
mmdc -i diagram.mmd -o diagram.png

# Generate SVG
mmdc -i diagram.mmd -o diagram.svg
```

**PlantUML**:
```bash
# Install (requires Java)
brew install plantuml

# Generate diagram
plantuml diagram.puml
```

## Output Format

Provide complete diagrams in Mermaid or PlantUML format, with explanations of architecture decisions and relationships between components.
