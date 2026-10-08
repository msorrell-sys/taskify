import prisma from '../db/client';
import { Task, CreateTaskInput, UpdateTaskInput } from '@taskify/shared';

/**
 * Get tasks for a project with optional user filter
 * @param projectId - Project UUID
 * @param assigneeId - Optional user UUID to filter by
 * @returns List of tasks with assignee and comment count
 */
export async function getTasksByProject(
  projectId: string,
  assigneeId?: string
): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      ...(assigneeId ? { assigneeId } : {}),
    },
    include: {
      assignee: {
        select: {
          id: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as 'ToDo' | 'InProgress' | 'InReview' | 'Done',
    assigneeId: task.assigneeId,
    projectId: task.projectId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignee: task.assignee ? {
      id: task.assignee.id,
      fullName: task.assignee.fullName,
      role: task.assignee.role as 'ProductManager' | 'Engineer',
      createdAt: task.assignee.createdAt.toISOString(),
    } : null,
    _count: task._count,
  }));
}

/**
 * Get task by ID with full details
 * @param taskId - Task UUID
 * @returns Task with assignee and project or null if not found
 */
export async function getTaskById(taskId: string): Promise<Task | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: {
        select: {
          id: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!task) {
    return null;
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as 'ToDo' | 'InProgress' | 'InReview' | 'Done',
    assigneeId: task.assigneeId,
    projectId: task.projectId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignee: task.assignee ? {
      id: task.assignee.id,
      fullName: task.assignee.fullName,
      role: task.assignee.role as 'ProductManager' | 'Engineer',
      createdAt: task.assignee.createdAt.toISOString(),
    } : null,
    project: {
      id: task.project.id,
      name: task.project.name,
      createdAt: task.project.createdAt.toISOString(),
    },
    _count: task._count,
  };
}

/**
 * Create a new task
 * @param projectId - Project UUID
 * @param data - Task creation data
 * @returns Created task
 */
export async function createTask(
  projectId: string,
  data: CreateTaskInput
): Promise<Task> {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      projectId,
      assigneeId: data.assigneeId || null,
      status: 'ToDo',
    },
    include: {
      assignee: {
        select: {
          id: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as 'ToDo' | 'InProgress' | 'InReview' | 'Done',
    assigneeId: task.assigneeId,
    projectId: task.projectId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignee: task.assignee ? {
      id: task.assignee.id,
      fullName: task.assignee.fullName,
      role: task.assignee.role as 'ProductManager' | 'Engineer',
      createdAt: task.assignee.createdAt.toISOString(),
    } : null,
    _count: task._count,
  };
}

/**
 * Update a task
 * @param taskId - Task UUID
 * @param data - Task update data
 * @returns Updated task
 */
export async function updateTask(
  taskId: string,
  data: UpdateTaskInput
): Promise<Task> {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
    },
    include: {
      assignee: {
        select: {
          id: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as 'ToDo' | 'InProgress' | 'InReview' | 'Done',
    assigneeId: task.assigneeId,
    projectId: task.projectId,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    assignee: task.assignee ? {
      id: task.assignee.id,
      fullName: task.assignee.fullName,
      role: task.assignee.role as 'ProductManager' | 'Engineer',
      createdAt: task.assignee.createdAt.toISOString(),
    } : null,
    _count: task._count,
  };
}
