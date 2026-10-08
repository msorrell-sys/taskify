import { z } from 'zod';

// User ID param schema
export const UserIdSchema = z.string().uuid('Invalid user ID format');

// Note: No create/update schemas for users in Phase 1
// Users are predefined and immutable per FR-001
