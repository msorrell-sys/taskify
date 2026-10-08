import prisma from './client';
import { Role, Status } from '@prisma/client';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users (5 predefined users)
  console.log('Seeding users...');
  const sarah = await prisma.user.create({
    data: {
      fullName: 'Sarah Chen',
      role: Role.ProductManager,
    },
  });

  const alex = await prisma.user.create({
    data: {
      fullName: 'Alex Rivera',
      role: Role.Engineer,
    },
  });

  const jordan = await prisma.user.create({
    data: {
      fullName: 'Jordan Kim',
      role: Role.Engineer,
    },
  });

  const morgan = await prisma.user.create({
    data: {
      fullName: 'Morgan Patel',
      role: Role.Engineer,
    },
  });

  const casey = await prisma.user.create({
    data: {
      fullName: 'Casey Zhang',
      role: Role.Engineer,
    },
  });

  console.log(`✅ Created 5 users`);

  // Seed Projects (3 predefined projects)
  console.log('Seeding projects...');
  const mobileApp = await prisma.project.create({
    data: {
      name: 'Mobile App Redesign',
    },
  });

  const apiMigration = await prisma.project.create({
    data: {
      name: 'API v2 Migration',
    },
  });

  const dashboard = await prisma.project.create({
    data: {
      name: 'Customer Dashboard',
    },
  });

  console.log(`✅ Created 3 projects`);

  // Seed Tasks (distributed across projects and statuses)
  console.log('Seeding tasks...');

  // Mobile App Redesign tasks
  const mobileAppTasks = await prisma.task.createMany({
    data: [
      {
        title: 'Design new authentication flow',
        description: 'Create modern, user-friendly login and signup screens with social auth options',
        status: Status.InProgress,
        assigneeId: alex.id,
        projectId: mobileApp.id,
      },
      {
        title: 'Implement dark mode support',
        description: 'Add system-wide dark mode with user preference persistence',
        status: Status.ToDo,
        assigneeId: jordan.id,
        projectId: mobileApp.id,
      },
      {
        title: 'Optimize image loading performance',
        description: 'Implement lazy loading and compression for all images',
        status: Status.InReview,
        assigneeId: casey.id,
        projectId: mobileApp.id,
      },
      {
        title: 'Add pull-to-refresh functionality',
        description: 'Implement native pull-to-refresh on all list views',
        status: Status.Done,
        assigneeId: alex.id,
        projectId: mobileApp.id,
      },
      {
        title: 'Create onboarding tutorial',
        description: 'Design and implement interactive tutorial for new users',
        status: Status.ToDo,
        assigneeId: null,
        projectId: mobileApp.id,
      },
      {
        title: 'Redesign navigation menu',
        description: 'Update bottom navigation with new iconography and animations',
        status: Status.InProgress,
        assigneeId: jordan.id,
        projectId: mobileApp.id,
      },
      {
        title: 'Fix profile picture upload bug',
        description: 'Resolve issue where large images fail to upload',
        status: Status.InReview,
        assigneeId: morgan.id,
        projectId: mobileApp.id,
      },
      {
        title: 'Add offline mode support',
        description: 'Enable core functionality when network is unavailable',
        status: Status.ToDo,
        assigneeId: casey.id,
        projectId: mobileApp.id,
      },
    ],
  });

  // API v2 Migration tasks
  const apiMigrationTasks = await prisma.task.createMany({
    data: [
      {
        title: 'Design new REST API schema',
        description: 'Plan RESTful endpoints with OpenAPI 3.1 specification',
        status: Status.Done,
        assigneeId: sarah.id,
        projectId: apiMigration.id,
      },
      {
        title: 'Implement user authentication endpoints',
        description: 'JWT-based auth with refresh tokens',
        status: Status.InProgress,
        assigneeId: alex.id,
        projectId: apiMigration.id,
      },
      {
        title: 'Migrate database schema',
        description: 'Update PostgreSQL schema to support new API requirements',
        status: Status.InReview,
        assigneeId: morgan.id,
        projectId: apiMigration.id,
      },
      {
        title: 'Write API integration tests',
        description: 'Comprehensive test suite with >80% coverage',
        status: Status.InProgress,
        assigneeId: jordan.id,
        projectId: apiMigration.id,
      },
      {
        title: 'Set up rate limiting',
        description: 'Implement Redis-based rate limiting for all endpoints',
        status: Status.ToDo,
        assigneeId: casey.id,
        projectId: apiMigration.id,
      },
      {
        title: 'Document API endpoints',
        description: 'Generate Swagger UI documentation from OpenAPI spec',
        status: Status.ToDo,
        assigneeId: null,
        projectId: apiMigration.id,
      },
      {
        title: 'Add request validation middleware',
        description: 'Validate all inputs with Zod schemas',
        status: Status.InReview,
        assigneeId: alex.id,
        projectId: apiMigration.id,
      },
      {
        title: 'Performance test API under load',
        description: 'Load testing with k6 to ensure 1000+ req/s throughput',
        status: Status.ToDo,
        assigneeId: morgan.id,
        projectId: apiMigration.id,
      },
    ],
  });

  // Customer Dashboard tasks
  const dashboardTasks = await prisma.task.createMany({
    data: [
      {
        title: 'Build analytics chart components',
        description: 'Create reusable chart components with Chart.js',
        status: Status.InProgress,
        assigneeId: jordan.id,
        projectId: dashboard.id,
      },
      {
        title: 'Implement real-time data updates',
        description: 'WebSocket integration for live dashboard metrics',
        status: Status.ToDo,
        assigneeId: alex.id,
        projectId: dashboard.id,
      },
      {
        title: 'Design user permissions system',
        description: 'Role-based access control for dashboard features',
        status: Status.InReview,
        assigneeId: sarah.id,
        projectId: dashboard.id,
      },
      {
        title: 'Add data export functionality',
        description: 'Export reports to CSV, PDF, and Excel formats',
        status: Status.ToDo,
        assigneeId: casey.id,
        projectId: dashboard.id,
      },
      {
        title: 'Create custom report builder',
        description: 'Drag-and-drop interface for custom report creation',
        status: Status.ToDo,
        assigneeId: null,
        projectId: dashboard.id,
      },
      {
        title: 'Optimize dashboard load time',
        description: 'Reduce initial load to under 2 seconds',
        status: Status.InProgress,
        assigneeId: morgan.id,
        projectId: dashboard.id,
      },
      {
        title: 'Add email notification settings',
        description: 'Allow users to configure dashboard alert emails',
        status: Status.Done,
        assigneeId: casey.id,
        projectId: dashboard.id,
      },
      {
        title: 'Implement dashboard templates',
        description: 'Pre-built templates for common use cases',
        status: Status.ToDo,
        assigneeId: jordan.id,
        projectId: dashboard.id,
      },
    ],
  });

  console.log(`✅ Created 24 tasks`);

  // Seed Comments (on various tasks)
  console.log('Seeding comments...');

  // Get some task IDs for adding comments
  const tasks = await prisma.task.findMany({ take: 10 });

  const comments = await prisma.comment.createMany({
    data: [
      {
        text: 'I\'ve completed the initial design mockups. Ready for review!',
        authorId: alex.id,
        taskId: tasks[0].id,
      },
      {
        text: 'Great work! Just a few minor adjustments needed on the color scheme.',
        authorId: sarah.id,
        taskId: tasks[0].id,
      },
      {
        text: 'Updated the designs based on feedback. Take another look when you have a chance.',
        authorId: alex.id,
        taskId: tasks[0].id,
      },
      {
        text: 'This is blocked waiting for the API changes to be deployed.',
        authorId: jordan.id,
        taskId: tasks[1].id,
      },
      {
        text: 'API is now live in staging. You should be unblocked.',
        authorId: morgan.id,
        taskId: tasks[1].id,
      },
      {
        text: 'Do we have any performance benchmarks we should be targeting?',
        authorId: casey.id,
        taskId: tasks[2].id,
      },
      {
        text: 'Target is <2s load time on 3G networks. Let me know if you need the full requirements doc.',
        authorId: sarah.id,
        taskId: tasks[2].id,
      },
      {
        text: 'Perfect, thanks! I\'ll optimize with that target in mind.',
        authorId: casey.id,
        taskId: tasks[2].id,
      },
      {
        text: 'QA found a bug with the edge case where users have no profile picture.',
        authorId: morgan.id,
        taskId: tasks[3].id,
      },
      {
        text: 'Good catch! Fixed and pushed. The default avatar now shows correctly.',
        authorId: alex.id,
        taskId: tasks[3].id,
      },
      {
        text: 'Can someone help me understand the requirements for offline sync?',
        authorId: jordan.id,
        taskId: tasks[4].id,
      },
      {
        text: 'I\'ll schedule a quick sync meeting to go over the offline strategy.',
        authorId: sarah.id,
        taskId: tasks[4].id,
      },
      {
        text: 'The test coverage is looking good - currently at 87%.',
        authorId: morgan.id,
        taskId: tasks[5].id,
      },
      {
        text: 'Excellent! That exceeds our 80% requirement.',
        authorId: sarah.id,
        taskId: tasks[5].id,
      },
      {
        text: 'Deployed to staging for testing. Link in the PR description.',
        authorId: casey.id,
        taskId: tasks[6].id,
      },
    ],
  });

  console.log(`✅ Created 15 comments`);

  console.log('✨ Database seed completed successfully!');
  console.log('\nSummary:');
  console.log(`  - 5 users (1 PM, 4 engineers)`);
  console.log(`  - 3 projects`);
  console.log(`  - 24 tasks (distributed across all statuses)`);
  console.log(`  - 15 comments`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
