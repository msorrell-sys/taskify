# Phase 0: Research & Technology Decisions

**Feature**: Team Kanban Platform
**Date**: 2026-10-08
**Purpose**: Resolve technical unknowns from plan.md Technical Context section

## Technology Stack Decisions

### 1. Language/Version

**Decision**: Node.js 20 LTS with TypeScript 5.x

**Rationale**:
- **Full-stack JavaScript/TypeScript**: Single language across frontend and backend reduces context switching, enables code sharing (types, validation rules, constants)
- **Node.js 20 LTS**: Long-term support release (April 2023 - April 2026), stable, mature ecosystem
- **TypeScript 5.x**: Type safety reduces bugs, improves maintainability, excellent IDE support, enforces contracts at compile time
- **Performance**: Node.js event loop handles concurrent requests efficiently, meets SC-002 (<1s task updates) easily
- **Ecosystem**: npm has extensive package ecosystem for web development needs

**Alternatives Considered**:
- **Python/Django**: Excellent for backend but separate frontend language increases complexity, slower for real-time UI updates
- **Go**: Great performance but smaller ecosystem, steeper learning curve, less frontend integration
- **Ruby/Rails**: Convention over configuration but slower runtime, declining ecosystem momentum

### 2. Frontend Framework

**Decision**: React 18 with Vite build tool

**Rationale**:
- **React 18**: Most popular UI library, massive ecosystem, excellent for interactive UIs, component reusability
- **Drag-and-drop support**: Multiple mature libraries (react-beautiful-dnd, dnd-kit) for Kanban board interactions
- **Performance**: Virtual DOM, concurrent rendering features meet SC-002 (<1s updates) requirement
- **Developer experience**: Hot module replacement, extensive tooling, large community support
- **Vite**: Modern build tool, fast HMR, optimized production builds, TypeScript support out-of-box

**Alternatives Considered**:
- **Vue 3**: Great DX but smaller ecosystem for drag-and-drop libraries
- **Svelte**: Excellent performance but smaller community, fewer drag-and-drop options
- **Angular**: Full-featured but heavyweight for this use case, steeper learning curve

### 3. Backend Framework

**Decision**: Express.js 4.x with TypeScript

**Rationale**:
- **Express.js**: De facto Node.js web framework, minimalist, flexible, mature
- **Middleware ecosystem**: Rich ecosystem for validation, error handling, logging, security
- **REST API**: Simple to implement RESTful endpoints meeting OpenAPI specification requirement
- **Performance**: Lightweight, meets performance goals (SC-001 through SC-004) with proper design
- **TypeScript integration**: Excellent type definitions available via @types/express

**Alternatives Considered**:
- **Fastify**: Faster but less mature ecosystem, fewer middleware options
- **NestJS**: Full-featured but heavyweight, adds unnecessary complexity for this scope
- **Koa**: Modern but smaller ecosystem than Express

### 4. Database

**Decision**: PostgreSQL 16

**Rationale**:
- **Relational structure**: Feature has clear entity relationships (User → Task, Project → Task, Task → Comment)
- **ACID compliance**: Ensures data consistency for task status changes, comment ordering
- **JSON support**: Can store flexible metadata if needed while maintaining relational integrity
- **Performance**: Handles expected scale (5 users, 3 projects, hundreds of tasks) easily
- **Open source**: No licensing costs, excellent community support
- **Mature ecosystem**: TypeORM, Prisma, node-postgres libraries for Node.js integration

**Alternatives Considered**:
- **MySQL**: Popular but PostgreSQL has better JSON support and standards compliance
- **MongoDB**: NoSQL flexibility not needed, loses relational integrity benefits
- **SQLite**: Too limited for production deployment, no concurrent write handling

### 5. ORM/Database Library

**Decision**: Prisma 5.x

**Rationale**:
- **TypeScript-first**: Auto-generates types from schema, compile-time safety
- **Developer experience**: Prisma Studio for data inspection, intuitive query API
- **Migrations**: Built-in migration system for schema evolution
- **Type safety**: Prevents common SQL injection vectors, enforces schema at compile time
- **Performance**: Efficient query generation, connection pooling built-in

**Alternatives Considered**:
- **TypeORM**: More traditional ORM but less TypeScript-native, more boilerplate
- **Sequelize**: Older, less TypeScript support, more complex API
- **node-postgres (raw)**: Maximum control but loses type safety, more maintenance burden

### 6. Testing Frameworks

**Decision**:
- **Unit/Integration**: Vitest (frontend), Jest (backend)
- **E2E**: Playwright
- **Security**: npm audit, OWASP ZAP

**Rationale**:
- **Vitest**: Native Vite integration, fast, compatible with Jest API, TypeScript support
- **Jest**: Industry standard for Node.js, rich assertion library, snapshot testing, mocking support
- **Playwright**: Cross-browser E2E testing (Chrome, Firefox, Safari), reliable, modern API, auto-waiting
- **npm audit**: Built-in dependency vulnerability scanning (constitution requirement)
- **OWASP ZAP**: Open-source security testing for XSS, injection vulnerabilities (SC-006 requirement)

**Alternatives Considered**:
- **Mocha/Chai**: More setup required, less integrated ecosystem
- **Cypress**: Good E2E but Playwright has better cross-browser support and parallelization
- **Selenium**: Older, more complex, slower than Playwright

### 7. Input Validation & Sanitization

**Decision**:
- **Backend**: Zod schema validation
- **Frontend**: Same Zod schemas (shared validation)
- **Sanitization**: DOMPurify for HTML/XSS prevention

**Rationale**:
- **Zod**: TypeScript-first schema validation, runtime type checking, composable schemas
- **Shared validation**: Same schemas on frontend and backend ensure consistency, DRY principle
- **DOMPurify**: Industry-standard XSS sanitization, prevents script injection in user content
- **Constitutional compliance**: Meets FR-007, FR-009, FR-016 input validation requirements

**Alternatives Considered**:
- **Joi**: Popular but Zod has better TypeScript integration
- **Yup**: Good but Zod is more modern, better type inference
- **express-validator**: Backend-only, loses code sharing benefit

### 8. API Documentation

**Decision**: OpenAPI 3.1 specification with Swagger UI

**Rationale**:
- **OpenAPI 3.1**: Industry standard, constitution requires Swagger/OpenAPI documentation
- **Swagger UI**: Interactive API documentation, allows testing endpoints in browser
- **Code generation**: Can generate client SDK or server stubs if needed
- **Validation**: Schema enforcement ensures API contract adherence

**Alternatives Considered**:
- **API Blueprint**: Less popular, fewer tools
- **RAML**: Declining adoption, limited tooling

### 9. Drag-and-Drop Library

**Decision**: @dnd-kit/core

**Rationale**:
- **Modern**: Built for React, TypeScript support, actively maintained
- **Accessible**: WCAG compliant keyboard navigation support
- **Performance**: Optimized for smooth animations, meets SC-002 (<1s update) requirement
- **Flexible**: Supports multiple drop zones (4 Kanban columns), custom drag previews
- **Lightweight**: Smaller bundle size than react-beautiful-dnd

**Alternatives Considered**:
- **react-beautiful-dnd**: Popular but no longer actively maintained, larger bundle
- **react-dnd**: More complex API, steeper learning curve, heavier bundle

### 10. HTTP Client (Frontend)

**Decision**: Axios

**Rationale**:
- **Promise-based**: Clean async/await syntax
- **Interceptors**: Centralized error handling, request/response transformation
- **Browser support**: Works in all target browsers (Chrome, Firefox, Safari, Edge)
- **TypeScript support**: Excellent type definitions
- **Features**: Automatic JSON transforms, timeout support, request cancellation

**Alternatives Considered**:
- **fetch API**: Native but lacks interceptors, less features, more boilerplate
- **ky**: Modern but smaller ecosystem, fewer examples

## Best Practices & Patterns

### Security Best Practices

1. **Input Validation Strategy**:
   - Validate all inputs on both client and server (defense in depth)
   - Use allowlist validation for constrained fields (status enum: To Do, In Progress, In Review, Done)
   - Sanitize all text inputs with DOMPurify before rendering
   - Enforce maximum lengths: title 200 chars, description 2000 chars, comment 1000 chars
   - Reject empty required fields with specific error messages

2. **XSS Prevention**:
   - Content Security Policy (CSP) headers on frontend
   - DOMPurify sanitization for user-generated content (title, description, comments)
   - Escape HTML entities in database queries
   - Use React's built-in XSS protection (JSX escaping)

3. **SQL Injection Prevention**:
   - Prisma parameterized queries (prevents SQL injection by design)
   - Never construct SQL strings with user input
   - Input validation before database operations

### Architecture Patterns

1. **Service Layer Pattern**:
   - Backend: Controllers → Services → Repositories
   - Services encapsulate business logic (task creation, status transitions, comment threading)
   - Repositories handle database operations
   - Controllers handle HTTP concerns (request/response, validation)

2. **Repository Pattern**:
   - Abstract database operations behind repository interfaces
   - Enables testability (mock repositories in unit tests)
   - Encapsulates Prisma ORM implementation details

3. **Component Composition** (Frontend):
   - Atomic design: atoms (Button, Input) → molecules (TaskCard) → organisms (KanbanBoard) → pages
   - Container/Presenter pattern: Smart containers fetch data, presenters render UI
   - Custom hooks for shared logic (useTasks, useComments, useDragDrop)

### Performance Patterns

1. **Optimistic UI Updates**:
   - Update UI immediately on drag-and-drop (SC-002: <1s visual update)
   - Send API request in background
   - Rollback on error with user notification

2. **Data Fetching**:
   - Fetch project data on navigation (SC-001: <5s project switch)
   - Cache project/user lists (static for phase 1)
   - Lazy load comments (fetch on task detail open)

3. **Bundle Optimization**:
   - Code splitting by route (ProjectList page, KanbanBoard page)
   - Tree shaking with Vite
   - Lazy load heavy components (drag-and-drop library)

### Testing Patterns

1. **Unit Testing**:
   - Test business logic in isolation (services, utilities, validators)
   - Mock external dependencies (database, HTTP clients)
   - Achieve ≥80% coverage requirement

2. **Integration Testing**:
   - Test API endpoint contracts against OpenAPI spec
   - Test database operations with test database
   - Verify validation rules end-to-end

3. **E2E Testing**:
   - Test user stories P1-P6 with Playwright
   - Cover acceptance scenarios from spec.md
   - Test edge cases (empty columns, long text, unassigned tasks)

## Development Workflow

### Setup Steps

1. **Repository initialization**: Git repository, .gitignore, README
2. **Monorepo structure**: backend/, frontend/, shared/ directories
3. **Backend setup**: Express app, Prisma schema, seed data scripts
4. **Frontend setup**: Vite React app, component structure, API client
5. **Database setup**: PostgreSQL installation, migrations, seed data
6. **Testing setup**: Vitest, Jest, Playwright configuration
7. **CI/CD**: GitHub Actions for automated tests, linting, security scans

### Development Order (by user story priority)

1. **P1 - View Projects**: Project list API + UI, navigation
2. **P2 - Move Tasks**: Drag-and-drop UI, status update API
3. **P3 - Create Tasks**: Task creation form + API, validation
4. **P4 - Reassign Tasks**: Assignee update UI + API
5. **P5 - Add Comments**: Comment thread UI + API
6. **P6 - Filter by User**: Client-side filtering (no new API needed)

## Decision Summary

| Decision Area | Choice | Primary Reason |
|---------------|--------|----------------|
| Language | TypeScript + Node.js 20 | Full-stack type safety, code sharing |
| Frontend Framework | React 18 + Vite | Best drag-and-drop ecosystem, performance |
| Backend Framework | Express.js 4 | Mature, flexible, rich middleware ecosystem |
| Database | PostgreSQL 16 | Relational model fits data structure, ACID compliance |
| ORM | Prisma 5 | TypeScript-first, type safety, great DX |
| Unit Testing | Vitest + Jest | Fast, TypeScript support, Jest-compatible API |
| E2E Testing | Playwright | Cross-browser, reliable, modern API |
| Validation | Zod | TypeScript-first, shareable schemas, runtime safety |
| Sanitization | DOMPurify | Industry standard XSS prevention |
| API Docs | OpenAPI 3.1 + Swagger UI | Constitution requirement, interactive docs |
| Drag-and-Drop | @dnd-kit/core | Modern, accessible, performant, TypeScript support |

**All "NEEDS CLARIFICATION" items from plan.md Technical Context are now resolved.**
