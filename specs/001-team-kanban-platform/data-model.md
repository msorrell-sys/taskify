# Data Model: Team Kanban Platform

**Feature**: Team Kanban Platform
**Date**: 2026-10-08
**Source**: Extracted from spec.md Key Entities section

## Overview

The data model consists of four core entities with clear relationships supporting the Kanban workflow. All entities follow the Security-First principle with input validation and XSS prevention. The relational structure ensures data integrity and supports the required queries for user stories P1-P6.

## Entity Definitions

### User

**Purpose**: Represents a team member who can interact with projects, tasks, and comments.

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the user |
| full_name | String | NOT NULL, 1-100 chars | User's display name (e.g., "Sarah Chen") |
| role | Enum | NOT NULL, ('ProductManager', 'Engineer') | User's role (informational only in phase 1) |
| created_at | Timestamp | NOT NULL, DEFAULT NOW() | When user record was created |

**Validation Rules**:
- `full_name`: Required, 1-100 characters, sanitized for XSS
- `role`: Must be one of: 'ProductManager', 'Engineer'
- **Phase 1 constraint**: Exactly 5 predefined users (1 PM, 4 engineers) per FR-001

**Relationships**:
- One-to-many with Task (as assignee)
- One-to-many with Comment (as author)

**Sample Data** (5 predefined users per FR-001):
```
1. Sarah Chen - Product Manager
2. Alex Rivera - Engineer
3. Jordan Kim - Engineer
4. Morgan Patel - Engineer
5. Casey Zhang - Engineer
```

---

### Project

**Purpose**: Represents a work initiative containing related tasks organized in a Kanban board.

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the project |
| name | String | NOT NULL, UNIQUE, 1-100 chars | Project display name (e.g., "Mobile App Redesign") |
| created_at | Timestamp | NOT NULL, DEFAULT NOW() | When project was created |

**Validation Rules**:
- `name`: Required, unique, 1-100 characters, sanitized for XSS
- **Phase 1 constraint**: Exactly 3 predefined projects per FR-002, no user-created projects per assumptions

**Relationships**:
- One-to-many with Task (parent project)

**Sample Data** (3 predefined projects per FR-002):
```
1. Mobile App Redesign
2. API v2 Migration
3. Customer Dashboard
```

---

### Task

**Purpose**: Represents a unit of work within a project, tracked through Kanban workflow stages.

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the task |
| title | String | NOT NULL, 1-200 chars | Task title/summary |
| description | String | NULLABLE, 0-2000 chars | Detailed task description |
| status | Enum | NOT NULL, DEFAULT 'ToDo' | Current workflow stage |
| assignee_id | UUID | NULLABLE, FOREIGN KEY → User.id | Assigned user (null = unassigned) |
| project_id | UUID | NOT NULL, FOREIGN KEY → Project.id | Parent project |
| created_at | Timestamp | NOT NULL, DEFAULT NOW() | When task was created |
| updated_at | Timestamp | NOT NULL, DEFAULT NOW() | When task was last modified |

**Status Enum Values** (per FR-003):
- `ToDo` - Task not started, initial state for new tasks
- `InProgress` - Task actively being worked on
- `InReview` - Task completed, awaiting review
- `Done` - Task completed and accepted

**Validation Rules** (per FR-007):
- `title`: Required, 1-200 characters, sanitized for XSS
- `description`: Optional, max 2000 characters, sanitized for XSS
- `status`: Must be one of: 'ToDo', 'InProgress', 'InReview', 'Done'
- `assignee_id`: Optional (null allowed per edge case), must reference valid User if provided
- `project_id`: Required, must reference valid Project

**State Transitions** (per FR-004, FR-005):
- Any team member can move any task to any status (no role restrictions per clarifications)
- Valid transitions: Any status → Any status (no workflow enforcement in phase 1)
- Status changes persist across page refreshes (per SC-005)

**Relationships**:
- Many-to-one with User (via assignee_id)
- Many-to-one with Project (via project_id)
- One-to-many with Comment (task comments)

**Indexes** (for query performance):
- `project_id` - Fetch all tasks for a project (User Story 1)
- `assignee_id` - Filter tasks by user (User Story 6)
- `status` - Group tasks by column (Kanban board display)
- Composite: `(project_id, status)` - Fetch tasks by project and column

---

### Comment

**Purpose**: Represents a discussion message on a task, enabling team collaboration.

**Attributes**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the comment |
| text | String | NOT NULL, 1-1000 chars | Comment content |
| author_id | UUID | NOT NULL, FOREIGN KEY → User.id | User who wrote the comment |
| task_id | UUID | NOT NULL, FOREIGN KEY → Task.id | Parent task |
| created_at | Timestamp | NOT NULL, DEFAULT NOW() | When comment was posted |

**Validation Rules** (per FR-009):
- `text`: Required (non-empty per edge case), 1-1000 characters, sanitized for XSS
- `author_id`: Required, must reference valid User
- `task_id`: Required, must reference valid Task

**Ordering** (per FR-014, User Story 5):
- Comments displayed in chronological order (oldest first)
- Query: `ORDER BY created_at ASC`

**Relationships**:
- Many-to-one with User (via author_id)
- Many-to-one with Task (via task_id)

**Indexes** (for query performance):
- `task_id` - Fetch all comments for a task (User Story 5)
- Composite: `(task_id, created_at)` - Chronological ordering per task

---

## Entity Relationship Diagram

```
┌──────────┐
│   User   │
│──────────│
│ id (PK)  │
│ full_name│
│ role     │
└────┬─────┘
     │
     │ 1:N (assignee)
     │
     ▼
┌──────────────────┐         ┌──────────┐
│      Task        │    N:1  │ Project  │
│──────────────────│◄────────│──────────│
│ id (PK)          │         │ id (PK)  │
│ title            │         │ name     │
│ description      │         └──────────┘
│ status           │
│ assignee_id (FK) │
│ project_id (FK)  │
└────┬─────────────┘
     │
     │ 1:N
     │
     ▼
┌──────────┐
│ Comment  │
│──────────│
│ id (PK)  │
│ text     │
│ author_id│◄───┐
│ task_id  │    │
└──────────┘    │
                │ 1:N (author)
                │
         ┌──────┴─────┐
         │    User    │
         └────────────┘
```

**Cardinality Summary**:
- User → Task (assignee): 1:N (one user assigned to many tasks)
- User → Comment (author): 1:N (one user authors many comments)
- Project → Task: 1:N (one project contains many tasks)
- Task → Comment: 1:N (one task has many comments)

---

## Database Schema (Prisma)

```prisma
model User {
  id           String    @id @default(uuid())
  fullName     String    @map("full_name") @db.VarChar(100)
  role         Role
  createdAt    DateTime  @default(now()) @map("created_at")

  assignedTasks Task[]    @relation("TaskAssignee")
  comments     Comment[]

  @@map("users")
}

enum Role {
  ProductManager @map("product_manager")
  Engineer
}

model Project {
  id        String   @id @default(uuid())
  name      String   @unique @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")

  tasks Task[]

  @@map("projects")
}

model Task {
  id          String   @id @default(uuid())
  title       String   @db.VarChar(200)
  description String?  @db.VarChar(2000)
  status      Status   @default(ToDo)
  assigneeId  String?  @map("assignee_id")
  projectId   String   @map("project_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  assignee User?    @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  project  Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  comments Comment[]

  @@index([projectId])
  @@index([assigneeId])
  @@index([status])
  @@index([projectId, status])
  @@map("tasks")
}

enum Status {
  ToDo       @map("todo")
  InProgress @map("in_progress")
  InReview   @map("in_review")
  Done
}

model Comment {
  id        String   @id @default(uuid())
  text      String   @db.VarChar(1000)
  authorId  String   @map("author_id")
  taskId    String   @map("task_id")
  createdAt DateTime @default(now()) @map("created_at")

  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
  @@index([taskId, createdAt])
  @@map("comments")
}
```

---

## Query Patterns

### User Story 1: View Projects and Tasks

```typescript
// Fetch all projects
const projects = await prisma.project.findMany({
  orderBy: { name: 'asc' }
});

// Fetch tasks for a project, grouped by status
const tasks = await prisma.task.findMany({
  where: { projectId: projectId },
  include: {
    assignee: { select: { id: true, fullName: true, role: true } }
  },
  orderBy: { createdAt: 'desc' }
});
```

### User Story 2: Move Task Between Columns

```typescript
// Update task status
await prisma.task.update({
  where: { id: taskId },
  data: {
    status: newStatus,
    updatedAt: new Date()
  }
});
```

### User Story 3: Create New Task

```typescript
// Create task with validation
await prisma.task.create({
  data: {
    title: validatedTitle,
    description: validatedDescription,
    status: 'ToDo',
    assigneeId: assigneeId,
    projectId: projectId
  }
});
```

### User Story 4: Reassign Task

```typescript
// Update task assignee (null = unassigned)
await prisma.task.update({
  where: { id: taskId },
  data: {
    assigneeId: newAssigneeId,  // null allowed
    updatedAt: new Date()
  }
});
```

### User Story 5: Add Comment to Task

```typescript
// Create comment with chronological ordering
const comment = await prisma.comment.create({
  data: {
    text: validatedText,
    authorId: userId,
    taskId: taskId
  },
  include: {
    author: { select: { fullName: true, role: true } }
  }
});

// Fetch comments in chronological order
const comments = await prisma.comment.findMany({
  where: { taskId: taskId },
  include: {
    author: { select: { fullName: true, role: true } }
  },
  orderBy: { createdAt: 'asc' }
});
```

### User Story 6: Filter Tasks by User

```typescript
// Fetch tasks assigned to specific user
const userTasks = await prisma.task.findMany({
  where: {
    projectId: projectId,
    assigneeId: userId
  },
  include: {
    assignee: { select: { fullName: true } }
  },
  orderBy: { status: 'asc' }
});
```

---

## Data Integrity Rules

### Referential Integrity

1. **Task → User (assignee)**:
   - `ON DELETE SET NULL`: If user deleted, task becomes unassigned
   - Allows null assignee (unassigned tasks per edge case)

2. **Task → Project**:
   - `ON DELETE CASCADE`: If project deleted, all tasks deleted
   - Projects are predefined and immutable in phase 1

3. **Comment → Task**:
   - `ON DELETE CASCADE`: If task deleted, all comments deleted
   - Ensures orphaned comments don't exist

4. **Comment → User (author)**:
   - `ON DELETE CASCADE`: If user deleted, their comments deleted
   - Users are predefined and immutable in phase 1

### Business Rules

1. **Status Transitions**: No workflow enforcement in phase 1 (any status → any status allowed per clarifications)
2. **Role Permissions**: No role-based restrictions (all users can perform all actions per clarifications)
3. **Unique Constraints**: Project name must be unique
4. **Immutability**: Users and projects are predefined and cannot be created/deleted by users in phase 1

---

## Migration Strategy

### Initial Schema Creation

1. Create enums (Role, Status)
2. Create tables in dependency order:
   - Users (no dependencies)
   - Projects (no dependencies)
   - Tasks (depends on Users, Projects)
   - Comments (depends on Users, Tasks)
3. Create indexes for query performance
4. Add foreign key constraints

### Seed Data

1. **Seed 5 users** (per FR-001):
   - 1 Product Manager: Sarah Chen
   - 4 Engineers: Alex Rivera, Jordan Kim, Morgan Patel, Casey Zhang

2. **Seed 3 projects** (per FR-002):
   - Mobile App Redesign
   - API v2 Migration
   - Customer Dashboard

3. **Seed 15-30 sample tasks**:
   - Distributed across 3 projects
   - Mixed status across 4 columns
   - Varied assignees (some unassigned)
   - Realistic titles and descriptions

4. **Seed 10-20 sample comments**:
   - Distributed across tasks
   - Various authors
   - Chronological timestamps

---

## Performance Considerations

### Indexes

All critical query paths are indexed:
- Single-column: `project_id`, `assignee_id`, `status`, `task_id`
- Composite: `(project_id, status)`, `(task_id, created_at)`

### Query Optimization

1. **Eager Loading**: Use Prisma `include` to fetch related data in single query (N+1 prevention)
2. **Select Optimization**: Only fetch needed fields (e.g., `select: { id, fullName }` for assignee display)
3. **Connection Pooling**: Prisma handles connection pooling automatically

### Scalability Notes

Current schema handles phase 1 scope (5 users, 3 projects, hundreds of tasks) efficiently. For future scaling:
- Add pagination for task lists (currently fetch all tasks per project)
- Consider caching for user/project lists (static data)
- Add database replication for read scaling
- Partition comments table by task_id for large comment volumes
