# AsyncNodes

> AI Workflow Automation & Agent Orchestration Platform

AsyncNodes is an AI-native workflow automation platform that allows users to visually design, execute, monitor, and manage automated workflows using interconnected nodes.

Users can combine traditional automation steps, AI agents, external integrations, and workflow logic into reliable automation systems without building custom backend infrastructure.

The platform focuses on execution reliability, observability, AI orchestration, and workflow scalability.

---

# Vision

Modern automation systems are often built from custom scripts, integrations, scheduled jobs, and AI services.

AsyncNodes provides a unified platform where users can visually design workflows while the platform handles:

* Workflow execution
* State management
* Scheduling
* AI orchestration
* Monitoring
* Failure recovery
* Third-party integrations

### Core Vision

> Users should focus on designing processes.
>
> The system should handle running them reliably.

---

# Core Features

## Visual Workflow Builder

* Interactive workflow canvas
* Drag-and-drop node system
* Visual workflow editing
* Node configuration
* Edge management

---

## Workflow Execution Engine

* Real workflow execution
* Dependency resolution
* Parallel execution
* Durable execution state
* Long-running workflow support

---

## Trigger System

Supported trigger types:

* Manual Trigger
* Scheduled Trigger
* Webhook Trigger
* External Event Trigger

---

## AI Agent Workflows

Supported providers:

* OpenAI
* Anthropic
* Groq

Capabilities:

* AI agent nodes
* Multi-agent workflows
* Context propagation
* Structured outputs
* Agent chaining

---

## Workflow Logic

* Conditions
* Branching
* Parallel paths
* Data transformations
* Workflow routing

---

## Monitoring & Debugging

* Execution history
* Node logs
* Error tracking
* Execution metrics
* Real-time monitoring

---

## Failure Recovery

* Durable state storage
* Retry support
* Error visibility
* Safe workflow recovery

---

# High-Level Architecture

```text
Frontend (Next.js)
        │
        ▼
Backend API
        │
        ▼
Workflow Engine
        │
        ▼
BullMQ + Redis
        │
        ▼
Workers
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
AI     APIs    Integrations
        │
        ▼
 PostgreSQL
```

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* React Flow
* Tailwind CSS
* shadcn/ui
* Zustand

## Backend

* Node.js
* TypeScript
* Express / Fastify

## Database

* PostgreSQL
* Drizzle ORM

## Execution Layer

* BullMQ
* Redis

## Realtime

* Socket.IO

## Infrastructure

* Docker
* Nginx

## AI Providers

* OpenAI
* Anthropic
* Groq

---

# Project Structure

```text
asyncnodes/

├── apps/
│   ├── web/
│   └── api/
│
├── services/
│   ├── workflow-engine/
│   ├── scheduler/
│   ├── workers/
│   └── webhook-service/
│
├── packages/
│   ├── shared/
│   ├── database/
│   ├── integrations/
│   └── ai-providers/
│
├── docs/
│   ├── PRODUCT_BREAKDOWN.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── API_SPEC.md
│   ├── DATABASE_SCHEMA.md
│   └── EXECUTION_ENGINE.md
│
└── docker/
```

---

# Getting Started

## Prerequisites

Install:

* Node.js 22+
* PostgreSQL
* Redis
* Docker

---

## Clone Repository

```bash
git clone https://github.com/your-org/asyncnodes.git

cd asyncnodes
```

---

## Install Dependencies

```bash
npm install
```

## Run Database Migrations

```bash
npm run db:migrate
```

---

## Start Development Environment

```bash
npm run dev
```

---

# Documentation

| Document             | Purpose                         |
| -------------------- | ------------------------------- |
| PRODUCT_BREAKDOWN.md | Product understanding and scope |
| ARCHITECTURE.md      | System architecture overview    |
| DECISIONS.md         | Architectural decision records  |
| DATABASE_SCHEMA.md   | Database design                 |
| API_SPEC.md          | API definitions                 |
| EXECUTION_ENGINE.md  | Workflow execution details      |

---

# Product Goals

The platform should allow users to:

* Build workflows visually
* Execute workflows reliably
* Create AI-powered automations
* Integrate external services
* Monitor execution in real time
* Recover safely from failures

---

# Non-Goals (v1)

The following are intentionally out of scope:

* Public workflow marketplace
* Public node marketplace
* Native mobile applications
* Enterprise billing systems
* Hundreds of integrations

The focus is building a reliable workflow execution platform first.

---

# Success Criteria

A successful AsyncNodes deployment should:

* Execute workflows reliably
* Support long-running executions
* Recover safely from failures
* Provide complete execution visibility
* Scale to thousands of concurrent workflow runs

---

# License

Internal Project – DevClub Product Builders Program

Version: v1.0
