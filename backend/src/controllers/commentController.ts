import { Request, Response, NextFunction } from 'express';
import { getCommentsByTask, createComment } from '../services/commentService';
import { sanitizeObject } from '../utils/sanitize';
import { ApiResponse, CreateCommentInput } from '@taskify/shared';

/**
 * GET /api/v1/tasks/:taskId/comments
 * List comments for a task
 */
export async function listTaskComments(
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const comments = await getCommentsByTask(taskId);

    const response: ApiResponse<any> = {
      data: comments,
      meta: { total: comments.length },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/tasks/:taskId/comments
 * Create a new comment
 */
export async function createTaskComment(
  req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const data = req.body as CreateCommentInput;

    // Sanitize user input
    const sanitized = sanitizeObject(data);

    const comment = await createComment(taskId, sanitized);

    const response: ApiResponse<any> = {
      data: comment,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}
