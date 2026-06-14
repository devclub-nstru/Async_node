# ARCHITECTURE.md

# AsyncNodes Architecture

## System Overview

AsyncNodes is an AI-native workflow automation platform that allows users to visually create, execute, monitor, and manage automated workflows.

Users design workflows using a node-based canvas while the platform handles execution, scheduling, state management, AI orchestration, integrations, monitoring, and failure recovery. The system is designed to support long-running workflows, external events, and AI-powered automation at scale.

---

# Component Map

## Frontend Application

**Technology**

* Next.js
* React
* TypeScript
* React Flow
* Zustand

**Responsibilities**

* User authentication
* Workflow builder UI
* Node configuration
* Workflow management
* Execution monitoring
* Real-time execution updates
* Execution history visualization

The frontend never executes workflows. It only manages workflow definitions and displays execution data.

---

## API Gateway / Backend API

**Technology**

* Node.js
* Express/Fastify
* TypeScript

**Responsibilities**

* Authentication & authorization
* Workflow CRUD operations
* Trigger management
* Integration management
* Execution management
* Validation
* Webhook registration
* Realtime event broadcasting

Acts as the primary entry point for all client requests.

---

## Workflow Engine

**Responsibilities**

* Workflow execution orchestration
* Dependency resolution
* Node scheduling
* State transitions
* Retry handling
* Failure recovery

The workflow engine determines:

* Which node should run
* When it should run
* What data should be passed

The workflow engine never directly executes heavy tasks. It schedules them through the queue system.

---

## Queue System

**Technology**

* BullMQ
* Redis

**Responsibilities**

* Job scheduling
* Background execution
* Retry management
* Delayed execution
* Long-running workflow support

Every node execution becomes a queue job.

Benefits:

* Horizontal scalability
* Worker isolation
* Failure tolerance
* Retry support

---

## Worker Service

**Responsibilities**

* Execute node logic
* Call AI providers
* Execute integrations
* Process data transformations
* Store outputs

Workers consume jobs from BullMQ and execute actual business logic.

Worker instances can scale independently.

---

## Scheduler Service

**Responsibilities**

* Scheduled workflow execution
* Cron processing
* Recurring automation triggers

Examples:

* Daily reports
* Weekly summaries
* Hourly checks

The scheduler creates workflow execution records and sends jobs to the workflow engine.

---

## Webhook Service

**Responsibilities**

* Receive external HTTP events
* Validate incoming requests
* Identify target workflow
* Create workflow executions

Example:

External Form
→ Webhook Endpoint
→ Workflow Execution

---

## Realtime Service

**Technology**

* Socket.IO

**Responsibilities**

* Live execution updates
* Workflow status updates
* Node completion notifications
* Execution log streaming

Allows users to monitor workflows without refreshing the page.

---

## Database Layer

**Technology**

* PostgreSQL
* Drizzle ORM

**Responsibilities**

* User data
* Workflow definitions
* Nodes
* Edges
* Execution records
* Execution logs
* Trigger configurations
* Integration configurations

The database is the source of truth for all durable state.

---

## Redis Layer

**Technology**

* Redis

**Responsibilities**

* Queue storage
* Temporary execution state
* Job coordination
* Rate limiting
* Cache storage

Redis is used for performance and coordination but is not the primary source of truth.

---

## External Services

### AI Providers

* OpenAI
* Anthropic
* Groq

Used by AI nodes and agent workflows.

---

### Integration Providers

#### Gmail

* Send emails
* Process incoming emails

#### Google Sheets

* Read records
* Update records

#### Slack

* Send notifications
* Receive events

#### Telegram

* Bot automation
* Message handling

---

# Communication Patterns

## REST API

Used for:

* Authentication
* Workflow management
* Execution history
* Configuration management

Pattern:

Frontend
→ Backend API
→ Database

---

## WebSocket Communication

Used for:

* Live execution updates
* Node status changes
* Execution progress

Pattern:

Worker
→ Backend
→ Socket.IO
→ Frontend

---

## Event-Driven Processing

Used for workflow execution.

Pattern:

Workflow Trigger
→ Execution Created
→ Queue Job Created
→ Worker Executes
→ Next Job Scheduled

This allows workflows to scale independently from user traffic.

---

## Message Queue Communication

BullMQ is used between:

* Workflow Engine
* Workers
* Scheduler

Benefits:

* Reliability
* Retry support
* Load distribution
* Long-running workflows

---

# Key Decisions

See:

* DECISIONS.md

Major architectural decisions include:

* PostgreSQL as primary datastore
* Redis + BullMQ for execution orchestration
* Event-driven workflow execution
* Node-based workflow architecture
* Provider-agnostic AI abstraction layer
* Durable execution state storage

---

# Data Flow

## Example: Manual Workflow Execution

### Step 1

User clicks "Execute Workflow".

Frontend sends request:

Frontend
→ Backend API

---

### Step 2

Backend validates:

* User permissions
* Workflow existence
* Workflow status

Execution record is created.

Backend
→ PostgreSQL

---

### Step 3

Workflow Engine starts execution.

Workflow Engine
→ BullMQ

Queue jobs are generated for trigger-ready nodes.

---

### Step 4

Worker consumes node job.

BullMQ
→ Worker

Worker executes node logic.

Examples:

* AI call
* Slack message
* Data transformation
* API request

---

### Step 5

Node output is stored.

Worker
→ PostgreSQL

Execution logs are updated.

---

### Step 6

Workflow Engine evaluates graph state.

If downstream nodes are ready:

Workflow Engine
→ BullMQ

Additional jobs are created.

---

### Step 7

Execution progress is streamed.

Worker
→ Socket.IO
→ Frontend

User sees live updates.

---

### Step 8

Workflow completes.

Execution status becomes:

COMPLETED

Final results remain available in execution history.

---

# High-Level Architecture Diagram

User
↓
Frontend (Next.js)
↓
Backend API
↓
PostgreSQL

Backend API
↓
Workflow Engine
↓
BullMQ Queue
↓
Workers

Workers
↓
AI Providers / Integrations

Workers
↓
PostgreSQL

Workers
↓
Socket.IO
↓
Frontend

External Events
↓
Webhook Service
↓
Workflow Engine

Scheduler
↓
Workflow Engine
