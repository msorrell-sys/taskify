# Taskify Backend

REST API service for the Taskify Team Kanban Platform.

## Technology Stack

- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.x
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.x
- **Validation**: Zod
- **Testing**: Jest, Supertest

## Getting Started

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 16 or higher
- npm 10 or higher

### Installation

```bash
# Install dependencies (from root)
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
```

### Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Server will run at http://localhost:3000
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Building

```bash
# Compile TypeScript
npm run build

# Run production build
npm start
```

## API Documentation

See [API Contracts](../specs/001-team-kanban-platform/contracts/README.md) for full OpenAPI specification.

### Base URL

```
http://localhost:3000/api/v1
```

### Endpoints

- `GET /projects` - List all projects
- `GET /projects/:projectId/tasks` - List tasks for a project
- `POST /projects/:projectId/tasks` - Create new task
- `GET /tasks/:taskId` - Get task details
- `PATCH /tasks/:taskId` - Update task
- `GET /tasks/:taskId/comments` - List comments
- `POST /tasks/:taskId/comments` - Add comment
- `GET /users` - List all users

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── db/              # Database client and seed
│   ├── middleware/      # Express middleware
│   ├── utils/           # Shared utilities
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - Check types
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client
