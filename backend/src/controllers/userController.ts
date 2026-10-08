import { Request, Response, NextFunction } from 'express';
import { getAllUsers, getUserById } from '../services/userService';
import { ApiResponse, ErrorCode, ApiError } from '@taskify/shared';

/**
 * GET /api/v1/users
 * List all users
 */
export async function listUsers(
  _req: Request,
  res: Response<ApiResponse<any>>,
  next: NextFunction
) {
  try {
    const users = await getAllUsers();

    const response: ApiResponse<any> = {
      data: users,
      meta: { total: users.length },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/users/:userId
 * Get user by ID
 */
export async function getUser(
  req: Request,
  res: Response<ApiResponse<any> | ApiError>,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);

    if (!user) {
      const apiError: ApiError = {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'User not found',
        },
      };
      return res.status(404).json(apiError);
    }

    const response: ApiResponse<any> = {
      data: user,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
