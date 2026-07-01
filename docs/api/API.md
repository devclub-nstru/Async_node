# API.md

# AsyncNode REST API Reference

Base URL: `http://localhost:8080/api/v1`

Interactive docs: `http://localhost:8080/api/docs`

All responses follow a consistent envelope:

**Success**
```json
{
  "success": true,
  "status": 200,
  "message": "...",
  "data": {},
  "request": { "ip": "...", "method": "GET", "url": "..." }
}
```

**Error**
```json
{
  "success": false,
  "status": 400,
  "message": "...",
  "data": null,
  "trace": null,
  "request": { "ip": "...", "method": "POST", "url": "..." }
}
```

Authentication uses **httpOnly cookies** (`accessToken`, `refreshToken`). Protected routes require a valid `accessToken` cookie — no Authorization header.

---

## Auth

### POST /auth/signup

Register a new user.

**Body**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses**

| Status | Description |
|--------|-------------|
| 201 | User created successfully |
| 400 | Missing username, email, or password / user already exists |
| 500 | Internal server error |

---

### POST /auth/signin

Sign in and receive httpOnly cookies.

**Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses**

| Status | Description |
|--------|-------------|
| 200 | Signed in — sets `accessToken` (15m) and `refreshToken` (7d) cookies |
| 400 | Missing email or password |
| 401 | User not found or invalid password |
| 500 | Internal server error |

---

### POST /auth/signout

Clear auth cookies and invalidate the refresh token in the database.

**Responses**

| Status | Description |
|--------|-------------|
| 200 | Signed out successfully |
| 500 | Internal server error |

---

## Workflows

All workflow routes require authentication (`accessToken` cookie).

### GET /workflows/workflows

Get all workflows belonging to the authenticated user.

**Responses**

| Status | Description |
|--------|-------------|
| 200 | Array of workflow objects |
| 401 | Unauthorized |
| 500 | Internal server error |

**Response data**
```json
[
  {
    "id": 1,
    "userId": 42,
    "name": "My Workflow",
    "description": "Automates data processing",
    "graphJson": null,
    "status": "draft",
    "createdAt": "2026-06-20T10:00:00.000Z",
    "updatedAt": "2026-06-20T10:00:00.000Z"
  }
]
```

---

### GET /workflows/workflows/:workflowId

Get a single workflow by ID.

**Path params**

| Param | Type | Description |
|-------|------|-------------|
| workflowId | integer | Numeric workflow ID |

**Responses**

| Status | Description |
|--------|-------------|
| 200 | Workflow object |
| 400 | Invalid workflow ID (non-numeric) |
| 401 | Unauthorized |
| 404 | Workflow not found |
| 500 | Internal server error |

---

### POST /workflows/workflows

Create a new workflow.

**Body**
```json
{
  "name": "My Workflow",
  "description": "Automates data processing"
}
```

**Responses**

| Status | Description |
|--------|-------------|
| 201 | Workflow created — returns the new workflow object |
| 400 | Missing name or description |
| 401 | Unauthorized |
| 500 | Internal server error |

---

## Workflow Status Enum

| Value | Description |
|-------|-------------|
| `draft` | Workflow is being built, not yet active |
| `active` | Workflow is live and can be triggered |
| `completed` | Workflow has been archived/completed |
