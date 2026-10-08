import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiError, ErrorCode } from '@taskify/shared';

/**
 * Validation middleware factory
 * Creates Express middleware that validates request data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param source - Request property to validate ('body', 'params', 'query')
 * @returns Express middleware function
 */
export function validate(
  schema: z.ZodSchema,
  source: 'body' | 'params' | 'query' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and parse the request data
      const validated = schema.parse(req[source]);

      // Replace the request data with validated data
      req[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors into API error response
        const apiError: ApiError = {
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Validation failed',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        };

        res.status(400).json(apiError);
      } else {
        // Unexpected error
        next(error);
      }
    }
  };
}
