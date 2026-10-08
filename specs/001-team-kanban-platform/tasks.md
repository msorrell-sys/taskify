# Tasks: Team Kanban Platform

**Input**: Design documents from `/specs/001-team-kanban-platform/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT included per constitution requirement (≥80% coverage will be implemented alongside features)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- **Frontend**: `frontend/src/`, `frontend/tests/`
- **Shared**: `shared/` (optional for TypeScript types and constants)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and basic structure

- [ ] T001 Initialize Git repository with .gitignore for Node.js, add README.md at root
- [ ] T002 Create monorepo directory structure: backend/, frontend/, shared/ (optional)
- [ ] T003 [P] Initialize backend Node.js 20 project with package.json in backend/
- [ ] T004 [P] Initialize frontend Vite + React 18 project with package.json in frontend/
- [ ] T005 [P] Install backend dependencies: express@4.x, @types/express, typescript@5.x, ts-node, prisma@5.x, @prisma/client, zod, cors, dotenv in backend/
- [ ] T006 [P] Install frontend dependencies: react@18, react-dom@18, @dnd-kit/core, axios, zod, dompurify, @types/react, @types/react-dom, typescript@5.x in frontend/
- [ ] T007 [P] Configure TypeScript for backend: tsconfig.json with strict mode, ES2022 target, commonjs module in backend/
- [ ] T008 [P] Configure TypeScript for frontend: tsconfig.json with strict mode, ES2022 target, ESNext module in frontend/
- [ ] T009 [P] Setup ESLint and Prettier for backend in backend/.eslintrc.json and backend/.prettierrc
- [ ] T010 [P] Setup ESLint and Prettier for frontend in frontend/.eslintrc.json and frontend/.prettierrc
- [ ] T011 [P] Create backend environment template: backend/.env.example with DATABASE_URL, PORT (3000), NODE_ENV
- [ ] T012 [P] Create frontend environment template: frontend/.env.example with VITE_API_BASE_URL (http://localhost:3000/api/v1)

**Checkpoint**: Project structure ready - can start database and foundational setup

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Install PostgreSQL 16 and create taskify_dev database
- [ ] T014 Create Prisma schema file at backend/prisma/schema.prisma with datasource and generator blocks
- [ ] T015 Define User model in backend/prisma/schema.prisma with fields: id UUID @id @default(uuid()), fullName String @db.VarChar(100), role enum (ProductManager, Engineer), createdAt DateTime @default(now())
- [ ] T016 Define Project model in backend/prisma/schema.prisma with fields: id UUID @id @default(uuid()), name String @unique @db.VarChar(100), createdAt DateTime @default(now())
- [ ] T017 Define Task model in backend/prisma/schema.prisma with fields: id UUID @id @default(uuid()), title String @db.VarChar(200), description String? @db.VarChar(2000), status enum (ToDo, InProgress, InReview, Done) @default(ToDo), assigneeId String? (FK to User), projectId String (FK to Project, NOT NULL), createdAt DateTime @default(now()), updatedAt DateTime @updatedAt with indexes on projectId, assigneeId, status, and composite (projectId, status)
- [ ] T018 Define Comment model in backend/prisma/schema.prisma with fields: id UUID @id @default(uuid()), text String @db.VarChar(1000), authorId String (FK to User, NOT NULL), taskId String (FK to Task, NOT NULL), createdAt DateTime @default(now()) with indexes on taskId and composite (taskId, createdAt)
- [ ] T019 Run Prisma migration: npx prisma migrate dev --name init to create database tables in backend/
- [ ] T020 Create seed script backend/prisma/seed.ts that inserts exactly 5 users (Sarah Chen as ProductManager, Alex Rivera/Jordan Kim/Morgan Patel/Casey Zhang as Engineers), 3 projects (Mobile App Redesign, API v2 Migration, Customer Dashboard), 15-30 sample tasks distributed across projects with mixed statuses, and 10-20 sample comments
- [ ] T021 Run seed script: npx prisma db seed to populate database with initial data in backend/
- [ ] T022 Create shared validation schemas file at shared/validation.ts with Zod schemas for: TaskCreateSchema (title 1-200 chars required, description 0-2000 chars optional nullable, assigneeId UUID optional nullable), TaskUpdateSchema (all fields optional), CommentCreateSchema (text 1-1000 chars required, authorId UUID required), StatusEnum (ToDo | InProgress | InReview | Done)
- [ ] T023 [P] Create Express app initialization at backend/src/main.ts with CORS middleware (allow frontend origin), JSON body parser, error handling middleware, health check endpoint GET /health
- [ ] T024 [P] Create Prisma client singleton at backend/src/lib/prisma.ts exporting configured PrismaClient instance
- [ ] T025 [P] Create input validation middleware at backend/src/api/middleware/validate.ts using Zod schemas, sanitizing with DOMPurify, returning 400 with field-level error details on validation failure
- [ ] T026 [P] Create error handling middleware at backend/src/api/middleware/errorHandler.ts catching errors, logging them, returning JSON error response with code, message, details (never expose stack traces)
- [ ] T027 [P] Create axios HTTP client at frontend/src/services/api.ts with baseURL from env, interceptors for error handling, JSON transforms
- [ ] T028 [P] Create shared TypeScript types file at shared/types.ts with interfaces: User (id, fullName, role), Project (id, name, createdAt), TaskStatus enum, TaskSummary (id, title, descriptionPreview, status, assignee nullable, commentCount, projectId, createdAt, updatedAt), Task (extends TaskSummary with description, comments array), Comment (id, text, author User, taskId, createdAt)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Navigate Projects (Priority: P1) 🎯 MVP

**Goal**: Enable users to view all three sample projects and navigate to project Kanban boards showing tasks in four columns

**Independent Test**: Load application, verify 3 projects display, click project, verify Kanban board with 4 columns (To Do, In Progress, In Review, Done) and task cards appear, click back to return to project list

### Backend Implementation for User Story 1

- [ ] T029 [P] [US1] Create ProjectService at backend/src/services/ProjectService.ts with method listProjects() returning all projects ordered by name using Prisma
- [ ] T030 [P] [US1] Create TaskService at backend/src/services/TaskService.ts with method listTasksByProject(projectId) returning tasks with assignee and comment count using Prisma include and _count
- [ ] T031 [US1] Create GET /api/v1/projects route at backend/src/api/routes/projects.ts calling ProjectService.listProjects(), returning {data: projects[], meta: {total}}
- [ ] T032 [US1] Create GET /api/v1/projects/:projectId/tasks route at backend/src/api/routes/projects.ts calling TaskService.listTasksByProject(), supporting optional query params assigneeId and status for filtering, generating descriptionPreview (first 50 chars with ellipsis), returning {data: tasks[], meta: {total, projectId}}
- [ ] T033 [US1] Register project routes in backend/src/main.ts under /api/v1 path

### Frontend Implementation for User Story 1

- [ ] T034 [P] [US1] Create ProjectService API client at frontend/src/services/projectService.ts with methods: listProjects() calling GET /projects, listTasks(projectId, filters?) calling GET /projects/:projectId/tasks
- [ ] T035 [P] [US1] Create ProjectList component at frontend/src/components/ProjectList/ProjectList.tsx displaying project cards with name, calling projectService.listProjects() on mount, handling click to navigate to /projects/:projectId
- [ ] T036 [P] [US1] Create KanbanBoard component at frontend/src/components/KanbanBoard/KanbanBoard.tsx with 4 column sections (To Do, In Progress, In Review, Done), accepting tasks prop, grouping tasks by status
- [ ] T037 [P] [US1] Create TaskCard component at frontend/src/components/TaskCard/TaskCard.tsx displaying title (truncate if >40 chars), assignee name or "Unassigned", descriptionPreview (from API, already truncated to 50 chars with ellipsis), comment count badge (e.g., "3 comments")
- [ ] T038 [US1] Create ProjectListPage at frontend/src/pages/ProjectListPage.tsx rendering ProjectList component, this is the root route /
- [ ] T039 [US1] Create KanbanBoardPage at frontend/src/pages/KanbanBoardPage.tsx fetching tasks for projectId from URL params, passing to KanbanBoard component, showing project name in header, providing back button to navigate to /, this is route /projects/:projectId
- [ ] T040 [US1] Configure React Router at frontend/src/App.tsx with routes: / (ProjectListPage), /projects/:projectId (KanbanBoardPage)
- [ ] T041 [US1] Add basic styling for ProjectList, KanbanBoard (4 columns in flexbox/grid), TaskCard (card layout with padding, border, shadow) in respective component CSS modules

**Checkpoint**: User Story 1 complete - users can view projects, navigate to Kanban boards, see tasks in columns. This is a minimal viable product (MVP) delivering foundational value.

---

## Phase 4: User Story 2 - Move Tasks Across Kanban Columns (Priority: P2)

**Goal**: Enable drag-and-drop task movement between Kanban columns with status persistence

**Independent Test**: Drag task from To Do to In Progress, verify it moves visually in <1 second, refresh page, verify task stays in In Progress column

### Backend Implementation for User Story 2

- [ ] T042 [US2] Add updateTask(taskId, updates) method to TaskService at backend/src/services/TaskService.ts validating taskId exists, updating fields (including status), returning updated task with Prisma
- [ ] T043 [US2] Create PATCH /api/v1/tasks/:taskId route at backend/src/api/routes/tasks.ts validating request body with TaskUpdateSchema from shared/validation.ts, calling TaskService.updateTask(), returning {data: task}, handling 404 if task not found
- [ ] T044 [US2] Register task routes in backend/src/main.ts under /api/v1 path

### Frontend Implementation for User Story 2

- [ ] T045 [US2] Create TaskService API client at frontend/src/services/taskService.ts with method updateTask(taskId, updates) calling PATCH /tasks/:taskId
- [ ] T046 [US2] Install and configure @dnd-kit/core in KanbanBoard component at frontend/src/components/KanbanBoard/KanbanBoard.tsx wrapping columns with DndContext, making columns droppable zones, making TaskCard components draggable
- [ ] T047 [US2] Implement onDragEnd handler in KanbanBoard component that updates task status optimistically in local state (meets SC-002 <1s visual update requirement), calls taskService.updateTask(taskId, {status: newStatus}) in background, rolls back on error with user notification
- [ ] T048 [US2] Add visual feedback during drag: highlight drop zones, show drag preview/ghost, provide smooth animations in frontend/src/components/KanbanBoard/KanbanBoard.css
- [ ] T049 [US2] Handle edge case: dragging task to same column (no API call, brief feedback or no action) in KanbanBoard onDragEnd handler

**Checkpoint**: User Story 2 complete - users can drag tasks between columns, status persists. Core Kanban workflow functional.

---

## Phase 5: User Story 3 - Create New Tasks (Priority: P3)

**Goal**: Enable task creation with title (required, 1-200 chars, XSS sanitized), description (optional, max 2000 chars, XSS sanitized), and assignee selection from 5 predefined users

**Independent Test**: Click "Add Task" button, fill form with title "Test Task", description "Test Description", assignee "Alex Rivera", click Save, verify new task appears in To Do column with correct data

### Backend Implementation for User Story 3

- [ ] T050 [P] [US3] Add createTask(projectId, taskData) method to TaskService at backend/src/services/TaskService.ts validating projectId exists, creating task with status defaulted to ToDo, returning created task
- [ ] T051 [P] [US3] Create UserService at backend/src/services/UserService.ts with method listUsers() returning all 5 users ordered by role (PM first) then name
- [ ] T052 [US3] Create POST /api/v1/projects/:projectId/tasks route at backend/src/api/routes/projects.ts validating request body with TaskCreateSchema from shared/validation.ts (enforces title 1-200 chars required, description 0-2000 chars optional nullable, XSS sanitization), calling TaskService.createTask(), returning 201 with {data: task}, handling 404 if project not found
- [ ] T053 [US3] Create GET /api/v1/users route at backend/src/api/routes/users.ts calling UserService.listUsers(), returning {data: users[], meta: {total: 5}}
- [ ] T054 [US3] Register user routes in backend/src/main.ts under /api/v1 path

### Frontend Implementation for User Story 3

- [ ] T055 [P] [US3] Add createTask(projectId, taskData) method to TaskService at frontend/src/services/taskService.ts calling POST /projects/:projectId/tasks
- [ ] T056 [P] [US3] Create UserService API client at frontend/src/services/userService.ts with method listUsers() calling GET /users
- [ ] T057 [US3] Create TaskForm component at frontend/src/components/TaskForm/TaskForm.tsx with controlled inputs: title (text input, required, maxLength 200), description (textarea, optional, maxLength 2000), assignee (dropdown showing 5 users plus "Unassigned" option), Save and Cancel buttons, client-side validation (title required 1-200 chars, description max 2000 chars), displaying validation errors below fields
- [ ] T058 [US3] Fetch users in TaskForm component on mount using userService.listUsers(), populate assignee dropdown with user.fullName and user.role (e.g., "Sarah Chen (Product Manager)")
- [ ] T059 [US3] Add "Add Task" button to KanbanBoardPage that opens TaskForm modal/dialog
- [ ] T060 [US3] Handle TaskForm submission: call taskService.createTask(projectId, formData), on success close form and refresh task list, on validation error (400) display field-level errors from API response, handle empty title edge case (show "Title is required" error)
- [ ] T061 [US3] Add styling for TaskForm modal, form fields, validation error messages, buttons in frontend/src/components/TaskForm/TaskForm.css

**Checkpoint**: User Story 3 complete - users can create tasks with validation, tasks appear in To Do column. System can grow beyond initial sample data.

---

## Phase 6: User Story 4 - Reassign Tasks (Priority: P4)

**Goal**: Enable changing task assignee through task detail view, allowing any team member to reassign any task to any user or to unassigned status

**Independent Test**: Click task card to open detail view, change assignee dropdown from "Alex Rivera" to "Jordan Kim", save, verify task card shows "Jordan Kim", reopen detail view to verify persistence

### Backend Implementation for User Story 4

- [ ] T062 [US4] Add getTask(taskId) method to TaskService at backend/src/services/TaskService.ts returning task with full details including assignee object, comments with author objects, ordered by createdAt ASC, using Prisma include
- [ ] T063 [US4] Create GET /api/v1/tasks/:taskId route at backend/src/api/routes/tasks.ts calling TaskService.getTask(), returning {data: task}, handling 404 if task not found
- [ ] T064 [US4] Verify PATCH /api/v1/tasks/:taskId from T043 supports assigneeId updates (including null for unassigned per FR-007a clarification)

### Frontend Implementation for User Story 4

- [ ] T065 [P] [US4] Add getTask(taskId) method to TaskService at frontend/src/services/taskService.ts calling GET /tasks/:taskId
- [ ] T066 [US4] Create TaskDetail component at frontend/src/components/TaskDetail/TaskDetail.tsx displaying full task.title, full task.description (not truncated), current assignee, editable assignee dropdown (populated from users, includes "Unassigned" option), Save button to persist assignee change, Close button
- [ ] T067 [US4] Make TaskCard clickable in KanbanBoard component, on click open TaskDetail modal/dialog passing taskId
- [ ] T068 [US4] Handle assignee change in TaskDetail: call taskService.updateTask(taskId, {assigneeId}), on success update local task state and refresh KanbanBoard to show updated assignee on card, handle setting assigneeId to null for "Unassigned" selection (edge case from spec)
- [ ] T069 [US4] Add styling for TaskDetail modal, assignee dropdown, Save/Close buttons in frontend/src/components/TaskDetail/TaskDetail.css

**Checkpoint**: User Story 4 complete - users can reassign tasks, changes persist. Workload flexibility enabled.

---

## Phase 7: User Story 5 - Add Comments to Tasks (Priority: P5)

**Goal**: Enable adding comments (1-1000 chars, non-empty, XSS sanitized) to tasks with author attribution and chronological ordering

**Independent Test**: Open task detail view, type comment "Test comment", click Add Comment, verify comment appears with author name and timestamp, verify chronological order (oldest first) when multiple comments exist

### Backend Implementation for User Story 5

- [ ] T070 [P] [US5] Create CommentService at backend/src/services/CommentService.ts with methods: listComments(taskId) returning comments for task ordered by createdAt ASC with author objects, createComment(taskId, commentData) creating comment and returning it with author object
- [ ] T071 [US5] Create GET /api/v1/tasks/:taskId/comments route at backend/src/api/routes/tasks.ts calling CommentService.listComments(), returning {data: comments[], meta: {total, taskId}}
- [ ] T072 [US5] Create POST /api/v1/tasks/:taskId/comments route at backend/src/api/routes/tasks.ts validating request body with CommentCreateSchema from shared/validation.ts (enforces text 1-1000 chars non-empty required, XSS sanitization), calling CommentService.createComment(), returning 201 with {data: comment}, handling 404 if task not found, handling empty comment edge case (validation returns 400 "Comment cannot be empty")

### Frontend Implementation for User Story 5

- [ ] T073 [P] [US5] Create CommentService API client at frontend/src/services/commentService.ts with methods: listComments(taskId) calling GET /tasks/:taskId/comments, createComment(taskId, commentData) calling POST /tasks/:taskId/comments
- [ ] T074 [US5] Create CommentThread component at frontend/src/components/CommentThread/CommentThread.tsx displaying list of comments ordered by createdAt ASC, each showing comment.text, comment.author.fullName, formatted timestamp (e.g., "2 hours ago")
- [ ] T075 [US5] Create CommentInput component at frontend/src/components/CommentInput/CommentInput.tsx with textarea (maxLength 1000), character count display (e.g., "245/1000"), "Add Comment" button, client-side validation (non-empty 1-1000 chars), displaying validation errors
- [ ] T076 [US5] Integrate CommentThread and CommentInput into TaskDetail component (from US4), fetch comments on mount using commentService.listComments(taskId), display in chronological order
- [ ] T077 [US5] Handle comment submission in TaskDetail: call commentService.createComment(taskId, {text, authorId}), on success append to comment thread, clear input field, on validation error (400) display error below input (edge case: empty comment shows "Comment cannot be empty"), update task card comment count badge in KanbanBoard
- [ ] T078 [US5] Add styling for CommentThread (list layout, alternating backgrounds), CommentInput (textarea, button), timestamp formatting in frontend/src/components/CommentThread/CommentThread.css and frontend/src/components/CommentInput/CommentInput.css

**Checkpoint**: User Story 5 complete - users can add comments to tasks, comments display chronologically. Contextual communication enabled.

---

## Phase 8: User Story 6 - View Task Assignments by User (Priority: P6)

**Goal**: Enable filtering Kanban board to show only tasks assigned to a specific user

**Independent Test**: On Kanban board, select "Jordan Kim" from user filter dropdown, verify only tasks assigned to Jordan Kim display across all columns, select "All Users" to clear filter and see all tasks again

### Backend Implementation for User Story 6

- [ ] T079 [US6] Verify GET /api/v1/projects/:projectId/tasks route from T032 supports assigneeId query parameter for filtering (already implemented as optional query param)

### Frontend Implementation for User Story 6

- [ ] T080 [US6] Create UserFilter component at frontend/src/components/UserFilter/UserFilter.tsx with dropdown showing "All Users" plus 5 predefined users, onChange callback to parent with selected userId or null
- [ ] T081 [US6] Integrate UserFilter into KanbanBoardPage, when user selected call projectService.listTasks(projectId, {assigneeId: userId}) to fetch filtered tasks, pass filtered tasks to KanbanBoard component, when "All Users" selected call projectService.listTasks(projectId) without filter
- [ ] T082 [US6] Add "Unassigned" option to UserFilter dropdown, when selected call projectService.listTasks(projectId, {assigneeId: null}) to show unassigned tasks (edge case from spec)
- [ ] T083 [US6] Add styling for UserFilter dropdown in frontend/src/components/UserFilter/UserFilter.css

**Checkpoint**: User Story 6 complete - users can filter tasks by assignee. Personal task lists easily accessible.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories, edge case handling, documentation, and validation

- [ ] T084 [P] Add error boundary component at frontend/src/components/ErrorBoundary/ErrorBoundary.tsx catching React errors, displaying user-friendly error message with "Reload" button
- [ ] T085 [P] Add loading states to all async operations: ProjectListPage (loading projects), KanbanBoardPage (loading tasks), TaskDetail (loading task details and comments), display spinner or skeleton screens
- [ ] T086 [P] Handle edge case: project with no tasks - display empty KanbanBoard columns with message "No tasks yet - add your first task" in KanbanBoard component
- [ ] T087 [P] Handle edge case: extremely long task title - ensure TaskCard truncates at ~40 chars with ellipsis, full title visible in TaskDetail (already partially handled by descriptionPreview from API)
- [ ] T088 [P] Add logging to all backend services using console.log or logging library (winston), log: requests (method, path, status), validation failures, errors with stack traces, task status changes, comment additions
- [ ] T089 [P] Create backend/README.md documenting: setup steps (npm install, database setup, migrations, seed), environment variables (.env), running dev server (npm run dev), running tests placeholder, API endpoints summary
- [ ] T090 [P] Create frontend/README.md documenting: setup steps (npm install), environment variables (.env), running dev server (npm run dev), running tests placeholder, component structure
- [ ] T091 [P] Create root README.md with project overview, link to spec.md, quick start (setup backend, setup frontend, run both), link to contracts/api.yaml for API docs
- [ ] T092 [P] Add CORS configuration to backend/src/main.ts allowing frontend origin (http://localhost:5173) with credentials
- [ ] T093 [P] Add .gitignore entries: node_modules/, .env, dist/, build/, *.log, .DS_Store in root, backend/, and frontend/
- [ ] T094 Run quickstart.md validation scenarios from specs/001-team-kanban-platform/quickstart.md: validate all 6 user stories, 6 edge cases, verify no errors

**Checkpoint**: All user stories complete and polished. System ready for testing and deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T012) completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational (T013-T028) completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational phase - No dependencies on other stories (FOUNDATION)
- **User Story 2 (P2)**: Depends on Foundational + US1 (T032 GET /tasks route, KanbanBoard component) - Extends US1 with drag-and-drop
- **User Story 3 (P3)**: Depends on Foundational + US1 (KanbanBoardPage to trigger "Add Task") - Independent of US2
- **User Story 4 (P4)**: Depends on Foundational + US1 (TaskCard click to open detail view) - Independent of US2, US3
- **User Story 5 (P5)**: Depends on Foundational + US1 + US4 (TaskDetail component to host comments) - Builds on US4 task detail view
- **User Story 6 (P6)**: Depends on Foundational + US1 (T032 GET /tasks route with assigneeId param, KanbanBoardPage to host filter) - Independent of US2-US5

### Within Each User Story

- Backend routes before frontend API clients
- API clients before components that use them
- Base components before pages that compose them
- Core implementation before edge case handling

### Parallel Opportunities

- **Setup**: T003-T012 (all [P] marked tasks can run in parallel)
- **Foundational**: T015-T018 (Prisma models), T023-T028 (backend/frontend infra) can run in parallel
- **User Stories**: Once Foundational completes, US1 must complete first, then US2-US6 can start in parallel with noted dependencies
- **Within US1**: T029-T030 (backend services), T034-T037 (frontend components) can run in parallel
- **Polish**: T084-T093 (all [P] marked tasks can run in parallel)

---

## Parallel Example: User Story 1

```bash
# Launch backend services in parallel:
Task: "Create ProjectService at backend/src/services/ProjectService.ts"
Task: "Create TaskService at backend/src/services/TaskService.ts"

# Launch frontend components in parallel (after API clients ready):
Task: "Create ProjectList component at frontend/src/components/ProjectList/ProjectList.tsx"
Task: "Create KanbanBoard component at frontend/src/components/KanbanBoard/KanbanBoard.tsx"
Task: "Create TaskCard component at frontend/src/components/TaskCard/TaskCard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T028) → CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T029-T041)
4. **STOP and VALIDATE**: Test US1 independently per quickstart.md Scenario 1
5. Deploy/demo if ready - delivers core value (view projects, navigate Kanban boards)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (drag-and-drop)
4. Add User Story 3 → Test independently → Deploy/Demo (task creation)
5. Add User Story 4 → Test independently → Deploy/Demo (reassignment)
6. Add User Story 5 → Test independently → Deploy/Demo (comments)
7. Add User Story 6 → Test independently → Deploy/Demo (filtering)
8. Polish phase → Final validation → Production deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Developer A: User Story 1 (blocking others)
3. Once US1 done, parallelize:
   - Developer A: User Story 2 (depends on US1)
   - Developer B: User Story 3 (independent after US1)
   - Developer C: User Story 4 (independent after US1)
4. After US4 done:
   - Developer D: User Story 5 (depends on US4)
   - Developer A/B/C: User Story 6 (depends on US1)
5. All developers: Polish tasks in parallel

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable (except noted dependencies)
- Tests are NOT included per constitution requirement (≥80% coverage implemented alongside features per constitutional principle IV)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All validation rules quoted verbatim from data-model.md (max lengths, nullable constraints, enum values)
- Security-First principle: all user inputs validated on both client (TaskForm, CommentInput) and server (Zod schemas, validation middleware) with XSS sanitization (DOMPurify)
- Microservices Architecture principle: frontend and backend independently deployable with clear API contract (contracts/api.yaml)
- Documentation Standards principle: README files for setup (T089-T091), inline comments for "why", OpenAPI docs generated from contracts/

## Phase 10: Convergence

**Purpose**: Address gaps between specification, plan, tasks, and current implementation discovered during convergence assessment on 2026-10-08

### CRITICAL - Constitutional Compliance

- [ ] T095 [CRITICAL] Implement unit tests for backend services per Constitution IV (missing)
  - Create test files for ProjectService, TaskService, UserService, CommentService
  - Achieve ≥80% coverage for business logic per constitutional requirement
  - Use Jest and supertest for integration tests
  - Cover happy paths, edge cases, and error conditions
  - Reference: Constitution Principle IV, tasks.md note line 339

- [ ] T096 [CRITICAL] Implement unit tests for frontend components per Constitution IV (missing)
  - Create test files for all React components (TaskCard, KanbanBoard, ProjectBoard, modals)
  - Use React Testing Library and Jest
  - Achieve ≥80% coverage for component logic
  - Test user interactions, state changes, API calls
  - Reference: Constitution Principle IV

- [ ] T097 [CRITICAL] Run Prisma migrations to initialize database per T019, T021 (missing)
  - Execute `cd backend && npx prisma migrate dev --name init`
  - Execute `cd backend && npx prisma db seed`
  - Verify 5 users, 3 projects, 24 tasks, 15 comments are created
  - Reference: T019, T021, FR-001, FR-002

### HIGH Priority - Architecture & Documentation

- [ ] T098 [HIGH] Create ADR documentation per Constitution III (missing)
  - Create docs/adr/ directory structure
  - Document ADR-001: Technology stack selection (Node.js, React, PostgreSQL, Prisma)
  - Document ADR-002: Microservices architecture decision (frontend/backend split)
  - Document ADR-003: Data model and entity relationships
  - Document ADR-004: Input validation and XSS prevention strategy
  - Reference: Constitution Principle III, plan.md constitution check

- [ ] T099 [HIGH] Refactor frontend routing to match specification per US1/AC3, T038-T040 (contradicts)
  - Create ProjectListPage component at frontend/src/pages/ProjectListPage.tsx showing list of 3 projects
  - Modify ProjectBoard to become KanbanBoardPage focused on single project
  - Configure React Router in App.tsx with routes: / (ProjectListPage), /projects/:projectId (KanbanBoardPage)
  - Add back navigation from KanbanBoardPage to ProjectListPage
  - Reference: US1 Acceptance Scenario 3, T038, T039, T040

- [ ] T100 [HIGH] Create ErrorBoundary component per T084 (missing)
  - Implement at frontend/src/components/ErrorBoundary/ErrorBoundary.tsx
  - Catch React errors and display user-friendly message
  - Include "Reload" button to recover from errors
  - Wrap App component with ErrorBoundary
  - Reference: T084, Phase 9 polish requirements

### MEDIUM Priority - Quality & Verification

- [ ] T101 [MEDIUM] Configure security testing tools per SC-006, Constitution I (missing)
  - Add npm audit to CI/CD checks
  - Configure SAST tool (e.g., ESLint security plugin, Snyk)
  - Run DAST scan on running application
  - Document security testing process in README
  - Reference: SC-006, Constitution Security Requirements section

- [ ] T102 [MEDIUM] Verify and enhance README documentation per T089-T091 (partial)
  - Audit backend/README.md for completeness (setup, env vars, migrations, seed, API summary)
  - Audit frontend/README.md for completeness (setup, env vars, components, testing)
  - Ensure root README.md includes quickstart with both services
  - Add troubleshooting section for common issues
  - Reference: T089, T090, T091

- [ ] T103 [MEDIUM] Verify TaskCard title truncation at ~40 chars per T087, spec edge case (partial)
  - Review TaskCard.tsx to confirm title truncation logic
  - Test with extremely long task title (>100 chars)
  - Ensure ellipsis shows at ~40 chars on card
  - Verify full title displays in TaskDetailsModal
  - Reference: T087, spec edge cases section

### LOW Priority - Validation

- [ ] T104 [LOW] Execute quickstart validation scenarios per T094 (missing)
  - Follow quickstart.md to validate all 6 user stories
  - Test all 6 edge cases documented in spec
  - Document any failures or issues found
  - Create follow-up tasks for any discovered gaps
  - Reference: T094, quickstart.md, spec.md edge cases

**Checkpoint**: Convergence phase complete - constitutional compliance achieved, architecture matches spec, all gaps addressed. System ready for production deployment.

