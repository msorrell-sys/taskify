# Taskify - Team Kanban Platform

A team productivity platform where users create projects, assign tasks, comment, and move tasks across Kanban columns.

## Features

- **Project Management**: View and organize multiple projects
- **Kanban Workflow**: Move tasks across columns (To Do, In Progress, In Review, Done)
- **Task Management**: Create, assign, and track tasks
- **Collaboration**: Add comments and collaborate with team members
- **User Filtering**: Filter tasks by assigned user

## Project Structure

```
taskify/
├── backend/           # Express.js REST API service
├── frontend/          # React web application
├── shared/            # Shared types and utilities
└── specs/             # Feature specifications and documentation
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, @dnd-kit/core
- **Backend**: Node.js 20 LTS, Express.js, TypeScript
- **Database**: PostgreSQL 16 with Prisma ORM
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

See individual service README files:
- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)

## Documentation

- [Feature Specification](./specs/001-team-kanban-platform/spec.md)
- [Implementation Plan](./specs/001-team-kanban-platform/plan.md)
- [API Contracts](./specs/001-team-kanban-platform/contracts/README.md)
- [Data Model](./specs/001-team-kanban-platform/data-model.md)

## Constitutional Principles

This project adheres to four core principles:

1. **Security-First**: All user inputs must be validated (client + server)
2. **Microservices Architecture**: Independent, deployable services
3. **Documentation Standards**: Comprehensive API and code documentation
4. **Code Quality & Testing**: ≥80% test coverage for business logic

## License

Proprietary - Internal use only

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
