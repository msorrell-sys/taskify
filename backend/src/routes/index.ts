import { Router } from 'express';
import { listProjects, getProject } from '../controllers/projectController';
import {
  listProjectTasks,
  getTask,
  createProjectTask,
  updateExistingTask,
} from '../controllers/taskController';
import { listUsers, getUser } from '../controllers/userController';
import { listTaskComments, createTaskComment } from '../controllers/commentController';
import { validate } from '../middleware/validate';
import {
  ProjectIdSchema,
  TaskIdSchema,
  UserIdSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateCommentSchema,
} from '@taskify/shared';

const router = Router();

// Project routes
router.get('/projects', listProjects);
router.get('/projects/:projectId', validate(ProjectIdSchema, 'params'), getProject);

// Task routes
router.get(
  '/projects/:projectId/tasks',
  validate(ProjectIdSchema, 'params'),
  listProjectTasks
);
router.post(
  '/projects/:projectId/tasks',
  validate(ProjectIdSchema, 'params'),
  validate(CreateTaskSchema, 'body'),
  createProjectTask
);
router.get('/tasks/:taskId', validate(TaskIdSchema, 'params'), getTask);
router.patch(
  '/tasks/:taskId',
  validate(TaskIdSchema, 'params'),
  validate(UpdateTaskSchema, 'body'),
  updateExistingTask
);

// Comment routes
router.get(
  '/tasks/:taskId/comments',
  validate(TaskIdSchema, 'params'),
  listTaskComments
);
router.post(
  '/tasks/:taskId/comments',
  validate(TaskIdSchema, 'params'),
  validate(CreateCommentSchema, 'body'),
  createTaskComment
);

// User routes
router.get('/users', listUsers);
router.get('/users/:userId', validate(UserIdSchema, 'params'), getUser);

export default router;
