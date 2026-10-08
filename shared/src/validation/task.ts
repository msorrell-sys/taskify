import { z } from 'zod';

// Status enum matching Prisma schema
export const TaskStatus = z.enum(['ToDo', 'InProgress', 'InReview', 'Done']);
export type TaskStatus = z.infer<typeof TaskStatus>;

// Create Task Request Schema
export const CreateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z.string()
    .max(2000, 'Description must be 2000 characters or less')
    .trim()
    .nullable()
    .optional(),
  assigneeId: z.string()
    .uuid('Invalid user ID format')
    .nullable()
    .optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

// Update Task Request Schema
export const UpdateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .optional(),
  description: z.string()
    .max(2000, 'Description must be 2000 characters or less')
    .trim()
    .nullable()
    .optional(),
  status: TaskStatus.optional(),
  assigneeId: z.string()
    .uuid('Invalid user ID format')
    .nullable()
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

// Task ID param schema
export const TaskIdSchema = z.string().uuid('Invalid task ID format');
