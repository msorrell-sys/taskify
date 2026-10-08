import { Request, Response, NextFunction } from 'express';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
} from '../services/taskService';
import { sanitizeObject } from '../utils/sanitize';
import { ApiResponse, ErrorCode, ApiError, CreateTaskInput, UpdateTaskInput } from '@taskify/shared';

/**
 * GET /api/v1/projects/:projectId/tasks
 * List tasks for a project with optional user filter
 */
export async function listProjectTasks(
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const { projectId } = req.params;
    const { assigneeId } = req.query;

    const tasks = await getTasksByProject(
      projectId,
      assigneeId as string | undefined
    );

    const response: ApiResponse<any> = {
      data: tasks,
      meta: { total: tasks.length },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/tasks/:taskId
 * Get task by ID
 */
export async function getTask(
  req: Request,
  res: Response<ApiResponse<any> | ApiError>,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await getTaskById(taskId);

    if (!task) {
      const apiError: ApiError = {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Task not found',
        },
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<any> = {
      data: task,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/projects/:projectId/tasks
 * Create a new task
 */
export async function createProjectTask(
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const { projectId } = req.params;
    const data = req.body as CreateTaskInput;

    // Sanitize user input
    const sanitized = sanitizeObject(data);

    const task = await createTask(projectId, sanitized);

    const response: ApiResponse<any> = {
      data: task,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/tasks/:taskId
 * Update a task
 */
export async function updateExistingTask(
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const data = req.body as UpdateTaskInput;

    // Sanitize user input
    const sanitized = sanitizeObject(data);

    const task = await updateTask(taskId, sanitized);

    const response: ApiResponse<any> = {
      data: task,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
