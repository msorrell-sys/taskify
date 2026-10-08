import { Request, Response, NextFunction } from 'express';
import { ApiError, ErrorCode } from '@taskify/shared';
import { Prisma } from '@prisma/client';

/**
 * Global error handling middleware
 * Catches all errors and returns consistent API error responses
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Record not found
    if (err.code === 'P2025') {
      const apiError: ApiError = {
        error: {
          code: ErrorCode.NOT_FOUND,
          message: 'Resource not found',
        },
      };
      return res.status(404).json(apiError);
    }

    // Foreign key constraint failed
    if (err.code === 'P2003') {
      const apiError: ApiError = {
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid reference to related resource',
        },
      };
      return res.status(400).json(apiError);
    }

    // Unique constraint failed
    if (err.code === 'P2002') {
      const apiError: ApiError = {
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'A record with this value already exists',
        },
      };
      return res.status(400).json(apiError);
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    const apiError: ApiError = {
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid data provided',
      },
    };
    return res.status(400).json(apiError);
  }

  // Default internal server error
  const apiError: ApiError = {
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred',
    },
  };

  res.status(500).json(apiError);
}

/**
 * 404 Not Found middleware for undefined routes
 */
export function notFoundHandler(req: Request, res: Response) {
  const apiError: ApiError = {
    error: {
      code: ErrorCode.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
  };

  res.status(404).json(apiError);
}
