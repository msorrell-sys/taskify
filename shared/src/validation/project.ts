import { z } from 'zod';

// Project ID param schema
export const ProjectIdSchema = z.string().uuid('Invalid project ID format');

// Note: No create/update schemas for projects in Phase 1
// Projects are predefined and immutable per FR-002
