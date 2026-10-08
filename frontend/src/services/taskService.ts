import { get, post, patch } from './api';
import { Task, CreateTaskInput, UpdateTaskInput } from '@taskify/shared';

/**
 * Fetch tasks for a project
 */
export async function fetchProjectTasks(
  projectId: string,
  assigneeId?: string
): Promise<Task[]> {
  const url = assigneeId
    ? `/projects/${projectId}/tasks?assigneeId=${assigneeId}`
    : `/projects/${projectId}/tasks`;
  return get<Task[]>(url);
}

/**
 * Fetch single task by ID
 */
export async function fetchTask(taskId: string): Promise<Task> {
  return get<Task>(`/tasks/${taskId}`);
}

/**
 * Create a new task
 */
export async function createTask(
  projectId: string,
  data: CreateTaskInput
): Promise<Task> {
  return post<Task, CreateTaskInput>(`/projects/${projectId}/tasks`, data);
}

/**
 * Update a task
 */
export async function updateTask(
  taskId: string,
  data: UpdateTaskInput
): Promise<Task> {
  return patch<Task, UpdateTaskInput>(`/tasks/${taskId}`, data);
}
