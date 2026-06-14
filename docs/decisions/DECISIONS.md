# DECISIONS.md

# Architecture Decision Records (ADR)

This document records major architectural decisions made during the development of AsyncNodes.

Each decision includes:

* Context
* Alternatives considered
* Reasoning
* Trade-offs

---

# ADR-001: Use PostgreSQL as the Primary Database

## Decision

Use PostgreSQL as the primary persistent datastore.

## Context

AsyncNodes manages highly related entities:

* Users
* Workspaces
* Workflows
* Nodes
* Edges
* Executions
* Execution Logs
* Integrations

The system requires:

* Strong consistency
* Relationships
* Transactions
* Complex querying
* Durable execution state

## Alternatives Considered

### MongoDB

Rejected because:

* Workflow execution data is highly relational
* Frequent joins would be difficult
* Consistency guarantees are weaker

### SQLite

Rejected because:

* Not suitable for production-scale concurrent workloads
* Limited horizontal growth options

## Reason Chosen

PostgreSQL provides:

* ACID transactions
* Foreign keys
* Complex queries
* JSON support
* Excellent ecosystem

## Trade-offs Accepted

* More schema management
* More complex scaling than document databases

Accepted because expected scale is achievable within PostgreSQL.

---

# ADR-002: Use Redis + BullMQ for Workflow Execution

## Decision

Use BullMQ and Redis as the workflow job execution system.

## Context

Workflow executions may:

* Run for minutes or hours
* Execute thousands of jobs
* Require retries
* Require scheduling
* Require concurrent processing

A simple in-memory execution model is insufficient.

## Alternatives Considered

### Direct Process Execution

Rejected because:

* Lost state during crashes
* Difficult retry support
* Limited scalability

### RabbitMQ

Rejected because:

* More operational complexity
* BullMQ provides required features out of the box

### Apache Kafka

Rejected because:

* Excessive complexity for v1
* Better suited for event streaming

## Reason Chosen

BullMQ provides:

* Delayed jobs
* Retries
* Concurrency controls
* Scheduling
* Worker management

## Trade-offs Accepted

* Additional infrastructure dependency
* Redis operational complexity

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

* Historical tracking becomes difficult
* Concurrent executions become complicated

## Reason Chosen

Separation provides:

* Better scalability
* Historical execution tracking
* Easier debugging
* Cleaner architecture

## Trade-offs Accepted

* Additional database tables
* More joins

Accepted for maintainability and observability.

---

# ADR-004: Event-Driven Execution Architecture

## Decision

Execute workflows through events and queued jobs rather than synchronous API requests.

## Context

Workflows may:

* Contain 100+ nodes
* Call external APIs
* Wait for human approval
* Execute long-running AI tasks

HTTP request lifetimes are insufficient.

## Alternatives Considered

### Synchronous Execution

Rejected because:

* Request timeouts
* Poor reliability
* Limited scalability

## Reason Chosen

Event-driven systems allow:

* Long-running execution
* Recovery
* Retry support
* Horizontal scaling

## Trade-offs Accepted

* More system complexity
* Harder debugging

Accepted because reliability is a core product requirement.

---

# ADR-005: Store Workflow Structure as JSON

## Decision

Store workflow graph definitions as JSON documents.

## Context

Workflow structures are dynamic.

Different workflows contain:

* Different node types
* Different configurations
* Different graph shapes

## Alternatives Considered

### Fully Normalized Node Tables

Rejected because:

* Excessive complexity
* Frequent schema changes

## Reason Chosen

JSON provides:

* Flexibility
* Faster development
* Easier versioning

Workflow metadata remains relational while graph definitions remain flexible.

## Trade-offs Accepted

* Harder database-level validation
* More application validation required

Accepted because workflow structures evolve frequently.

---

# ADR-006: Use Socket.IO for Realtime Updates

## Decision

Use Socket.IO for workflow execution monitoring.

## Context

Users need live visibility into:

* Node completion
* Workflow progress
* Failures
* Logs

Polling would generate unnecessary load.

## Alternatives Considered

### HTTP Polling

Rejected because:

* Increased API traffic
* Higher latency
* Poor user experience

### Server-Sent Events (SSE)

Rejected because:

* Less flexible for future bidirectional communication

## Reason Chosen

Socket.IO provides:

* Realtime communication
* Automatic reconnection
* Room-based subscriptions

## Trade-offs Accepted

* Persistent connections
* Additional infrastructure complexity

Accepted because monitoring is a core product feature.

---

# ADR-007: Provider-Agnostic AI Layer

## Decision

Abstract AI providers behind a common interface.

## Context

The PRD requires support for:

* OpenAI
* Anthropic
* Groq

Users should not be locked into one provider.

## Alternatives Considered

### Direct Provider Integration in Nodes

Rejected because:

* Difficult maintenance
* Vendor lock-in
* Repeated logic

## Reason Chosen

A provider abstraction enables:

* Easy provider switching
* Shared guardrails
* Consistent node behavior

## Trade-offs Accepted

* Additional abstraction layer
* Slightly more development effort

Accepted for long-term flexibility.

---

# ADR-008: Durable Execution State Storage

## Decision

Persist workflow execution state in PostgreSQL.

## Context

The PRD requires:

* Failure recovery
* Long-running workflows
* Retry capability
* Execution history

Execution progress cannot exist only in memory.

## Alternatives Considered

### In-Memory State

Rejected because:

* Lost on crashes
* Impossible recovery

### Redis-Only State

Rejected because:

* Not primary durable storage
* Risk of data loss

## Reason Chosen

PostgreSQL guarantees:

* Durability
* Recovery
* Historical tracking

## Trade-offs Accepted

* Additional database writes
* Slightly slower execution updates

Accepted because reliability is more important than raw speed.

---

# ADR-009: Worker-Based Node Execution

## Decision

Execute node logic in dedicated worker processes.

## Context

Some nodes may perform:

* AI requests
* External API calls
* Heavy processing

API servers should not perform execution work.

## Alternatives Considered

### Execute Nodes Inside API Server

Rejected because:

* Blocks API requests
* Poor scalability
* Higher failure impact

## Reason Chosen

Worker isolation provides:

* Better scalability
* Independent deployment
* Improved reliability

## Trade-offs Accepted

* Additional deployment complexity
* More infrastructure

Accepted because execution workloads vary significantly.
