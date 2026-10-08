import prisma from '../db/client';
import { User } from '@taskify/shared';

/**
 * Fetch all users
 * @returns List of all users ordered by name
 */
export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: { fullName: 'asc' },
  });

  return users.map(user => ({
    id: user.id,
    fullName: user.fullName,
    role: user.role as 'ProductManager' | 'Engineer',
    createdAt: user.createdAt.toISOString(),
  }));
}

/**
 * Get user by ID
 * @param userId - User UUID
 * @returns User or null if not found
 */
export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.fullName,
    role: user.role as 'ProductManager' | 'Engineer',
    createdAt: user.createdAt.toISOString(),
  };
}
