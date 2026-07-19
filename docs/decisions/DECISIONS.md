# DECISIONS.md

# Architecture Decision Records (ADR)

This document records major architectural decisions made during the development of AsyncNode.

Each decision includes:

- Context
- Alternatives considered
- Reasoning
- Trade-offs

---

# ADR-001: Use PostgreSQL as the Primary Database

## Decision

Use PostgreSQL as the primary persistent datastore.

## Context

AsyncNode manages highly related entities:

- Users
- Workflows (with node/edge graphs stored as JSON, see ADR-005)
- Triggers
- Integrations
- Executions
- Node Executions
- Execution Logs

The system requires:

- Strong consistency
- Relationships
- Transactions
- Complex querying
- Durable execution state

## Alternatives Considered

### MongoDB

Rejected because:

- Workflow execution data is highly relational
- Frequent joins would be difficult
- Consistency guarantees are weaker

### SQLite

Rejected because:

- Not suitable for production-scale concurrent workloads
- Limited horizontal growth options

## Reason Chosen

PostgreSQL provides:

- ACID transactions
- Foreign keys
- Complex queries
- JSON support
- Excellent ecosystem

## Trade-offs Accepted

- More schema management
- More complex scaling than document databases

Accepted because expected scale is achievable within PostgreSQL.

---

# ADR-002: Use Redis + BullMQ for Workflow Execution

## Decision

Use BullMQ and Redis as the workflow job execution system.

## Context

Workflow executions may:

- Run for minutes or hours
- Execute thousands of jobs
- Require retries
- Require scheduling
- Require concurrent processing

A simple in-memory execution model is insufficient.

## Alternatives Considered

### Direct Process Execution

Rejected because:

- Lost state during crashes
- Difficult retry support
- Limited scalability

### RabbitMQ

Rejected because:

- More operational complexity
- BullMQ provides required features out of the box

### Apache Kafka

Rejected because:

- Excessive complexity for v1
- Better suited for event streaming

## Reason Chosen

BullMQ provides:

- Delayed jobs
- Retries
- Concurrency controls
- Scheduling
- Worker management

## Trade-offs Accepted

- Additional infrastructure dependency
- Redis operational complexity

Accepted because workflow reliability depends on durable job execution.

---

# ADR-003: Separate Workflow Definitions from Executions

## Decision

Store workflow definitions separately from workflow executions.

## Context

A workflow can execute thousands of times.

Workflow structure changes should not affect historical executions.

## Alternatives Considered

### Store execution state inside workflow records

Rejected because:

- Historical tracking becomes difficult
- Concurrent executions become complicated

## Reason Chosen

Separation provides:

- Better scalability
- Historical execution tracking
- Easier debugging
- Cleaner architecture

## Trade-offs Accepted

- Additional database tables
- More joins

Accepted for maintainability and observability.

---

# ADR-004: Event-Driven Execution Architecture

## Decision

Execute workflows through events and queued jobs rather than synchronous API requests.

## Context

Workflows may:

- Contain 100+ nodes
- Call external APIs
- Wait for human approval
- Execute long-running AI tasks

HTTP request lifetimes are insufficient.

## Alternatives Considered

### Synchronous Execution

Rejected because:

- Request timeouts
- Poor reliability
- Limited scalability

## Reason Chosen

Event-driven systems allow:

- Long-running execution
- Recovery
- Retry support
- Horizontal scaling

## Trade-offs Accepted

- More system complexity
- Harder debugging

Accepted because reliability is a core product requirement.

---

# ADR-005: Store Workflow Structure as JSON

## Decision

Store workflow graph definitions as JSON documents.

## Context

Workflow structures are dynamic.

Different workflows contain:

- Different node types
- Different configurations
- Different graph shapes

## Alternatives Considered

### Fully Normalized Node Tables

Rejected because:

- Excessive complexity
- Frequent schema changes

## Reason Chosen

JSON provides:

- Flexibility
- Faster development
- Easier versioning

Workflow metadata remains relational while graph definitions remain flexible.

## Trade-offs Accepted

- Harder database-level validation
- More application validation required

Accepted because workflow structures evolve frequently.

---

# ADR-006: Use Socket.IO for Realtime Updates

## Decision

Use Socket.IO for workflow execution monitoring.

## Context

Users need live visibility into:

- Node completion
- Workflow progress
- Failures
- Logs

Polling would generate unnecessary load.

## Alternatives Considered

### HTTP Polling

Rejected because:

- Increased API traffic
- Higher latency
- Poor user experience

### Server-Sent Events (SSE)

Rejected because:

- Less flexible for future bidirectional communication

## Reason Chosen

Socket.IO provides:

- Realtime communication
- Automatic reconnection
- Room-based subscriptions

## Trade-offs Accepted

- Persistent connections
- Additional infrastructure complexity

Accepted because monitoring is a core product feature.

---

# ADR-007: One Executor Per AI Provider

## Decision

Support OpenAI, Anthropic, and Groq as separate node types, each with its own executor function, rather than building a unified provider abstraction up front.

## Context

The product requires support for:

- OpenAI
- Anthropic
- Groq

## Alternatives Considered

### Unified Provider Interface

A shared interface behind which any provider could be swapped was considered, but rejected for the initial implementation because:

- The three SDKs have different enough request/response shapes that a forced abstraction would leak provider details anyway
- Premature abstraction would slow down adding the first working version of each

## Reason Chosen

Three thin executors (`anthropic.executor.ts`, `openai.executor.ts`, `groq.executor.ts`) sharing only the common executor function signature used by the execution engine. This keeps each provider's integration simple and independently changeable.

## Trade-offs Accepted

- No single point to add cross-provider guardrails or fallback logic today
- Adding a new provider means writing a new executor rather than configuring an existing one

Revisit this decision if/when a real need for provider-agnostic switching (e.g. automatic fallback) emerges.

---

# ADR-008: Durable Execution State Storage

## Decision

Persist workflow execution state in PostgreSQL.

## Context

The PRD requires:

- Failure recovery
- Long-running workflows
- Retry capability
- Execution history

Execution progress cannot exist only in memory.

## Alternatives Considered

### In-Memory State

Rejected because:

- Lost on crashes
- Impossible recovery

### Redis-Only State

Rejected because:

- Not primary durable storage
- Risk of data loss

## Reason Chosen

PostgreSQL guarantees:

- Durability
- Recovery
- Historical tracking

## Trade-offs Accepted

- Additional database writes
- Slightly slower execution updates

Accepted because reliability is more important than raw speed.

---

# ADR-009: Queue-Based Node Execution (In-Process Worker)

## Decision

Route workflow execution through a BullMQ queue and worker rather than running it inline on the request that triggers it, so that AI calls, HTTP requests, and other node logic don't block the API server's request/response cycle.

## Context

Some nodes may perform:

- AI requests
- External API calls
- Long-running operations

## Alternatives Considered

### Execute Nodes Synchronously Inside the Request Handler

Rejected because:

- Ties execution duration to an HTTP request lifetime
- One slow node run could tie up an API server thread/connection
- No retry or crash-recovery story

## Reason Chosen

Queueing the run and consuming it via a BullMQ worker gives:

- Decoupling from the triggering request
- BullMQ's built-in retry/backoff primitives
- A path to running the worker as a separate process later, without changing the execution engine

## Current State

The worker (`src/workers/WorkflowExecutionWorker.ts`) currently runs in the same Node process as the API server — it is not yet a separately deployed/scaled service. Splitting it out is straightforward (it already only talks to Postgres and Redis) but has not been done.

## Trade-offs Accepted

- Added Redis/BullMQ dependency for what is currently a single-process deployment
- Execution status is only as fresh as the last DB write + Socket.IO emit, not truly synchronous

Accepted because decoupling now avoids a harder migration later if/when the worker needs to scale independently.

---

# ADR-010: Double-Submit Cookie CSRF Protection

## Decision

Protect all state-changing requests to `/api/v1/workflows/*` with a double-submit cookie: the server issues a readable `XSRF-TOKEN` cookie, and the client must echo its value back as an `x-xsrf-token` header on every `POST`/`PUT`/`PATCH`/`DELETE`. `/api/v1/auth/*` and `/api/v1/webhooks/*` are exempt.

## Context

Session auth uses httpOnly `accessToken`/`refreshToken` cookies sent automatically by the browser on every request to the API's origin. Without CSRF protection, a malicious page could trigger state-changing requests (create/delete/run a workflow) using the victim's ambient session cookie, since the browser attaches cookies regardless of which site initiated the request.

## Alternatives Considered

### Synchronizer Token Pattern (server-side session-stored token)

Rejected because it requires server-side session storage keyed per user/session, adding infrastructure the app doesn't otherwise need (auth is already stateless JWT).

### Custom header-only check (e.g. requiring `X-Requested-With`)

Rejected because it is weaker — some legacy browser/proxy configurations still allow simple cross-origin requests to carry arbitrary headers in certain cases, and it provides no cryptographic binding between the request and a value only the same-origin JS could have read.

## Reason Chosen

The double-submit cookie pattern needs no server-side session state: a cross-site page can cause the cookie to be sent, but cannot read its value (cookies aren't readable cross-origin) to also set the matching header. It composes cleanly with the existing stateless JWT auth model.

## Trade-offs Accepted

- The frontend's HTTP client must be configured to read the cookie and set the header (axios does this out of the box via `xsrfCookieName`/`xsrfHeaderName`; see `app/web/lib/api.ts`) — any new client (mobile app, CLI, script) must replicate this manually.
- The `XSRF-TOKEN` cookie is only issued in response to a safe (`GET`/`HEAD`/`OPTIONS`) request, so a client that only ever sends mutating requests without a prior `GET` will not have a token yet.

Accepted because it protects the highest-value routes (workflow CRUD, run, schedule) without adding session storage.

---

# ADR-011: Docker Compose + Nginx + Single EC2 Host for Deployment

## Decision

Deploy `web`, `server`, `redis`, and an `nginx` reverse proxy as Docker Compose services on a single EC2 host, with GitHub Actions building/pushing images and driving the deploy over SSH.

## Context

The project needed a production deployment path that's simple to operate for a small team, without committing to a specific PaaS or container orchestrator up front. Postgres is already externalized (Neon), so the remaining pieces (web, server, redis) needed a place to run together behind TLS.

## Alternatives Considered

### Managed PaaS (e.g. Render, Railway, Vercel + separate API host)

Rejected for now because it would split the frontend and backend across different deployment models/providers for no immediate benefit, and the team already has EC2 access.

### Kubernetes

Rejected as excessive operational complexity for a single-region, low-traffic deployment; Compose is sufficient at current scale.

## Reason Chosen

Docker Compose on one EC2 instance, fronted by an `nginx` container doing TLS termination (Let's Encrypt certs from the host) and routing `/api/` to `server` and everything else to `web`, keeps the whole stack (excluding Postgres) reproducible from one `docker-compose.yml` and deployable with a single SSH session.

## Trade-offs Accepted

- Single point of failure — one EC2 host, no redundancy or auto-scaling.
- `redis` has no persistence volume; a `docker compose down` loses in-flight BullMQ job state.
- Deploys are a rolling `docker compose pull && up -d`, not a zero-downtime blue/green rollout.

Revisit if/when traffic or reliability requirements outgrow a single host.
