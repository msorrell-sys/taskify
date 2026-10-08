import { Request, Response, NextFunction } from 'express';
import { getAllProjects, getProjectById } from '../services/projectService';
import { ApiResponse, ErrorCode, ApiError } from '@taskify/shared';

/**
 * GET /api/v1/projects
 * List all projects
 */
export async function listProjects(
  _req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const projects = await getAllProjects();

    const response: ApiResponse<any> = {
      data: projects,
      meta: { total: projects.length },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/projects/:projectId
 * Get project by ID
 */
export async function getProject(
  req: Request,
  res: Response<ApiResponse<any> | ApiError>,
  next: NextFunction
) {
  try {
    const { projectId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      const apiError: ApiError = {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Project not found',
        },
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<any> = {
      data: project,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
