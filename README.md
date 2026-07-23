# AsyncNode

A self-hostable workflow automation platform. Design workflows visually as a graph of nodes, then run them manually, on a webhook, or on a schedule — with execution history, per-node logs, and live status over WebSockets.

---

## What it actually does

- **Visual workflow builder** — a node-based canvas (React Flow) for wiring up trigger → action graphs.
- **Node types**: `trigger`, `ai` (OpenAI / Anthropic / Groq), `http` (HTTP request), `email` (SMTP via Nodemailer), `slack` (Slack message).
- **Triggers**: manual run, webhook (unique per-workflow token URL), and interval-based scheduling (repeatable BullMQ jobs).
- **Execution engine** — resolves node dependencies from the saved graph with a topological sort and runs them in order, persisting status/input/output per node.
- **Execution history** — every run and every node run is stored in Postgres (`execution`, `node_execution`, `execution_logs`), queryable via the API.
- **Live updates** — execution/node status is pushed to the frontend over Socket.IO as it happens.
- **Auth** — email/password signup+signin with JWT access/refresh tokens in httpOnly cookies, plus email verification.
- **CSRF protection** — double-submit cookie pattern on all state-changing requests to `/api/v1/workflows/*` (see [docs/api/API.md](docs/api/API.md#csrf-protection)).
- **Rate limiting** — global API limiter, a stricter limiter on auth endpoints, and a dedicated limiter on manual workflow runs.

This is a modular monolith: one Express API process plus BullMQ workers running in the same codebase (currently in-process), backed by Postgres and Redis. There are no separate "scheduler service" or "webhook service" deployables — those are just modules inside the same app.

---

## Tech stack

**Frontend** (`app/web`)

- Next.js 16 (App Router), React 19, TypeScript
- React Flow for the workflow canvas
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- Socket.IO client for live execution updates

**Backend** (`app/server`)

- Node.js, TypeScript, Express 5
- Drizzle ORM + PostgreSQL (targets Neon's serverless driver)
- BullMQ + Redis for job queues (workflow execution, verification emails)
- Socket.IO for realtime execution events
- JWT auth (access + refresh tokens), bcrypt password hashing
- Nodemailer (SMTP) for transactional email
- Winston for server-side logging
- Swagger/OpenAPI docs generated from JSDoc annotations
- AI provider SDKs: `@anthropic-ai/sdk`, `openai`, `groq-sdk`

**Infrastructure**

- Docker Compose (nginx, web, server, redis — Postgres is external in production, e.g. Neon)
- Nginx reverse proxy with TLS termination (Let's Encrypt) for production deployment
- GitHub Actions CI/CD — builds and pushes Docker images, then deploys to an EC2 host over SSH

---

## Project structure

```text
AsyncNode/
├── app/
│   ├── server/            # Express API + BullMQ workers
│   │   └── src/
│   │       ├── config/            # env, db, redis, swagger, queue setup
│   │       ├── db/schemas/        # Drizzle table definitions
│   │       ├── executors/         # per-node-type execution logic
│   │       ├── integrations/      # AI / email / slack / http clients
│   │       ├── jobs/               # BullMQ job definitions
│   │       ├── middlewares/       # auth, rate limiting, error handling
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── workflows/
│   │       │   └── executions/    # includes webhook trigger endpoint
│   │       ├── workers/           # BullMQ worker processes
│   │       └── ws/                # Socket.IO server
│   └── web/                # Next.js frontend
│       ├── app/                   # routes: /, /signin, /signup, /dashboard, /builder/[id]
│       ├── components/builder/    # the node-based workflow editor
│       └── hooks/, services/
├── docker/                 # docker-compose.yml (prod) + docker-compose.dev.yml (local db/redis)
├── nginx/                  # reverse proxy + TLS config (http.config, https.config)
├── .github/workflows/      # deploy.yml — build, push, and deploy CI/CD pipeline
└── docs/                   # architecture, API, database, decisions
```

---

## Installation

### Prerequisites

- Node.js (LTS) and npm
- Docker and Docker Compose

### Get the code

```bash
git clone <repo-url>
cd AsyncNode
```

---

## Local setup guide

AsyncNode's local Postgres and Redis are provided by `docker/docker-compose.dev.yml`, so you don't need to install or run these separately.

### 1. Start local Postgres and Redis

```bash
cd docker
cp .env.example .env   # fill in the values needed by docker-compose.dev.yml
docker compose -f docker-compose.dev.yml up
```

Leave this running — it provides the local database and Redis instance the backend connects to.

### 2. Backend setup

In a new terminal:

```bash
cd app/server
cp .env.example .env   # fill in DATABASE_URL, REDIS_URL, JWT secrets, SMTP creds, etc.
npm i
npm run dev
```

The API runs on `http://localhost:8080` (see `PORT` in `.env`). Swagger UI is available at `/api/docs`.

### 3. Frontend setup

In another terminal:

```bash
cd app/web
cp .env.example .env   # fill in backend_URI and any other required values
npm i
npm run dev
```

The app runs on `http://localhost:3000` and expects the backend at the URL configured via `backend_URI` in its environment.

### Summary of what's running

| Service          | How it's started                                             | Port |
| ---------------- | ------------------------------------------------------------ | ---- |
| Postgres + Redis | `docker compose -f docker-compose.dev.yml up` (in `docker/`) | —    |
| Backend API      | `npm run dev` (in `app/server`)                              | 8080 |
| Frontend         | `npm run dev` (in `app/web`)                                 | 3000 |

## License

MIT
