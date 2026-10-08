# Taskify Frontend

React web application for the Taskify Team Kanban Platform.

## Technology Stack

- **Framework**: React 18
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Drag & Drop**: @dnd-kit/core
- **HTTP Client**: Axios
- **Validation**: Zod
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- Backend service running on http://localhost:3000

### Installation

```bash
# Install dependencies (from root)
npm install
```

### Development

```bash
# Start development server
npm run dev

# Application will run at http://localhost:5173
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client services
│   ├── types/           # TypeScript types
│   ├── utils/           # Shared utilities
│   ├── e2e/             # End-to-end tests
│   ├── test/            # Test utilities and setup
│   ├── App.tsx          # Root component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
└── package.json
```

## Features

- **Project Navigation**: View and switch between multiple projects
- **Kanban Board**: Visual task management with 4 columns (To Do, In Progress, In Review, Done)
- **Drag & Drop**: Move tasks between columns with smooth animations
- **Task Management**: Create, update, and assign tasks
- **Comments**: Collaborate through task comments
- **User Filtering**: Filter tasks by assigned user

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Lint code
- `npm run type-check` - Check types

## Environment Variables

Frontend uses Vite's environment variable system. Create `.env.local` if you need to override defaults:

```bash
# API Base URL (default: proxied through Vite)
VITE_API_BASE_URL=http://localhost:3000/api/v1
```
