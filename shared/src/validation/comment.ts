import { z } from 'zod';

// Create Comment Request Schema
export const CreateCommentSchema = z.object({
  text: z.string()
    .min(1, 'Comment text is required and cannot be empty')
    .max(1000, 'Comment must be 1000 characters or less')
    .trim(),
  authorId: z.string()
    .uuid('Invalid user ID format'),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

// Comment ID param schema
export const CommentIdSchema = z.string().uuid('Invalid comment ID format');
