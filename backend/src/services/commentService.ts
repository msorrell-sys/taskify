import prisma from '../db/client';
import { Comment, CreateCommentInput } from '@taskify/shared';

/**
 * Get comments for a task in chronological order
 * @param taskId - Task UUID
 * @returns List of comments with author info
 */
export async function getCommentsByTask(taskId: string): Promise<Comment[]> {
  const comments = await prisma.comment.findMany({
    where: { taskId },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments.map(comment => ({
    id: comment.id,
    text: comment.text,
    authorId: comment.authorId,
    taskId: comment.taskId,
    createdAt: comment.createdAt.toISOString(),
    author: {
      id: comment.author.id,
      fullName: comment.author.fullName,
      role: comment.author.role as 'ProductManager' | 'Engineer',
      createdAt: comment.author.createdAt.toISOString(),
    },
  }));
}

/**
 * Create a new comment on a task
 * @param taskId - Task UUID
 * @param data - Comment creation data
 * @returns Created comment with author info
 */
export async function createComment(
  taskId: string,
  data: CreateCommentInput
): Promise<Comment> {
  const comment = await prisma.comment.create({
    data: {
      text: data.text,
      taskId,
      authorId: data.authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  return {
    id: comment.id,
    text: comment.text,
    authorId: comment.authorId,
    taskId: comment.taskId,
    createdAt: comment.createdAt.toISOString(),
    author: {
      id: comment.author.id,
      fullName: comment.author.fullName,
      role: comment.author.role as 'ProductManager' | 'Engineer',
      createdAt: comment.author.createdAt.toISOString(),
    },
  };
}
