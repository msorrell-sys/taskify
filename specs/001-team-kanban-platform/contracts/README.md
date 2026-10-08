# API Contracts: Team Kanban Platform

**Feature**: Team Kanban Platform
**Version**: 1.0.0
**Date**: 2026-10-08

## Overview

This directory contains the API contract specifications for the Taskify Team Kanban Platform backend service. The contracts define the REST API interface between the frontend and backend services, ensuring clear communication protocols and data structures.

## Files

- **`api.yaml`**: OpenAPI 3.1 specification documenting all REST API endpoints, request/response schemas, validation rules, and error responses

## Contract Purpose

The API contract serves multiple purposes:

1. **Service Interface Definition**: Specifies how frontend and backend services communicate
2. **Input Validation Rules**: Documents validation constraints (per Security-First constitutional principle)
3. **Developer Documentation**: Provides interactive API documentation via Swagger UI
4. **Testing Reference**: Defines expected behavior for integration and contract tests
5. **Client SDK Generation**: Enables auto-generation of type-safe API clients

## API Specification

### Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Production** (future): `https://api.taskify.dev/v1`

### Endpoints Summary

| Method | Path | Description | User Story |
|--------|------|-------------|------------|
| GET | `/projects` | List all projects | P1 - View Projects |
| GET | `/projects/{projectId}/tasks` | List tasks for a project | P1 - View Projects |
| POST | `/projects/{projectId}/tasks` | Create new task | P3 - Create Tasks |
| GET | `/tasks/{taskId}` | Get task details | P5 - Add Comments |
| PATCH | `/tasks/{taskId}` | Update task (status, assignee, etc.) | P2 - Move Tasks, P4 - Reassign |
| GET | `/tasks/{taskId}/comments` | List comments for a task | P5 - Add Comments |
| POST | `/tasks/{taskId}/comments` | Add comment to task | P5 - Add Comments |
| GET | `/users` | List all users | All stories (assignee dropdowns) |

### Authentication

**Phase 1**: No authentication required. All endpoints are publicly accessible.

**Future Phases**: Will add bearer token authentication for all endpoints.

### Input Validation

All user inputs are validated according to Security-First constitutional principle:

- **Task Title**: Required, 1-200 characters, XSS sanitized
- **Task Description**: Optional, max 2000 characters, XSS sanitized
- **Comment Text**: Required (non-empty), 1-1000 characters, XSS sanitized
- **Status**: Must be one of: `ToDo`, `InProgress`, `InReview`, `Done`
- **User/Project/Task IDs**: Must be valid UUIDs referencing existing resources

Validation errors return HTTP 400 with detailed error messages specifying which fields failed validation.

### Response Format

All successful responses follow this structure:

```json
{
  "data": { /* resource object or array */ },
  "meta": { /* optional metadata like total count */ }
}
```

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [ /* optional field-level details */ ]
  }
}
```

### Status Codes

- **200 OK**: Successful GET/PATCH request
- **201 Created**: Successful POST request (resource created)
- **400 Bad Request**: Validation error or malformed request
- **404 Not Found**: Resource does not exist
- **500 Internal Server Error**: Unexpected server error

## Viewing the API Documentation

### Option 1: Swagger UI (Recommended)

1. Install Swagger UI viewer:
   ```bash
   npm install -g swagger-ui-express
   ```

2. Serve the spec:
   ```bash
   swagger-ui-serve contracts/api.yaml
   ```

3. Open browser: `http://localhost:8080`

### Option 2: Online Viewer

1. Go to [Swagger Editor](https://editor.swagger.io/)
2. File → Import File → Select `contracts/api.yaml`
3. View interactive documentation in right panel

### Option 3: VS Code Extension

1. Install "OpenAPI (Swagger) Editor" extension
2. Open `contracts/api.yaml`
3. Right-click → "Preview Swagger" or press `Shift+Alt+P`

## Contract Testing

Integration tests should verify the API implementation matches this contract:

```typescript
// Example: Verify POST /projects/{projectId}/tasks contract
describe('POST /projects/{projectId}/tasks', () => {
  it('should create task with valid input', async () => {
    const response = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .send({
        title: 'Test task',
        description: 'Test description',
        assigneeId: userId
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      title: 'Test task',
      status: 'ToDo',
      projectId: projectId
    });
  });

  it('should reject empty title (validation rule)', async () => {
    const response = await request(app)
      .post(`/api/v1/projects/${projectId}/tasks`)
      .send({
        title: '',  // Invalid: empty title
        description: 'Test'
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## Client Code Generation

The OpenAPI spec can generate type-safe API clients:

### TypeScript Client (Frontend)

```bash
npm install -g @openapitools/openapi-generator-cli

openapi-generator-cli generate \
  -i contracts/api.yaml \
  -g typescript-axios \
  -o frontend/src/generated/api
```

### Usage in Frontend

```typescript
import { TasksApi, CreateTaskRequest } from '@/generated/api';

const api = new TasksApi();

// Type-safe API call
const task = await api.createTask(projectId, {
  title: 'New task',
  description: 'Task description',
  assigneeId: userId
});
```

## Schema Validation

The contract defines strict schemas for all request/response bodies. Backend implementation should validate against these schemas using the Zod library (see research.md for rationale).

### Example: Task Creation Schema (Zod)

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  assigneeId: z.string().uuid().nullable().optional()
});

// Validate request body
const validatedData = CreateTaskSchema.parse(req.body);
```

## Constitutional Compliance

### I. Security-First (Input Validation) ✅

- All input fields have explicit validation rules (min/max lengths, required/optional)
- XSS sanitization documented as mandatory for text inputs
- Validation error responses expose no internal system details
- Maximum length constraints prevent DoS attacks via large payloads

### II. Microservices Architecture ✅

- API contract defines clear interface between frontend and backend services
- Services can be developed, tested, and deployed independently
- Contract-first approach enables parallel development of frontend and backend

### III. Documentation Standards ✅

- OpenAPI 3.1 specification meets constitutional requirement for API documentation
- All endpoints documented with descriptions, parameters, examples, and error responses
- Interactive documentation available via Swagger UI
- Enables auto-generation of client SDKs and server stubs

### IV. Code Quality & Testing ✅

- Contract provides reference for integration tests
- Schemas enable automated contract testing
- Examples provide test case templates
- Error responses document expected failure modes

## API Versioning

Current version: **v1** (indicated in base URL: `/api/v1`)

Future breaking changes will increment the major version number (v2, v3, etc.) and may run alongside previous versions during migration periods.

Non-breaking changes (new endpoints, optional fields) can be added to v1 without versioning bump.

## Change Log

### Version 1.0.0 (2026-10-08)

- Initial API specification
- 8 endpoints covering user stories P1-P6
- No authentication (phase 1 requirement)
- Input validation rules per Security-First principle
- OpenAPI 3.1 format for modern tooling support

## References

- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- Feature Specification: `../spec.md`
- Data Model: `../data-model.md`
- Technology Decisions: `../research.md`
