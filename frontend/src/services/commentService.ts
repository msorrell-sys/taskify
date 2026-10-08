import { get, post } from './api';
import { Comment, CreateCommentInput } from '@taskify/shared';

/**
 * Fetch comments for a task
 */
export async function fetchTaskComments(taskId: string): Promise<Comment[]> {
  return get<Comment[]>(`/tasks/${taskId}/comments`);
}

/**
 * Create a new comment
 */
export async function createComment(
  taskId: string,
  data: CreateCommentInput
): Promise<Comment> {
  return post<Comment, CreateCommentInput>(`/tasks/${taskId}/comments`, data);
}
