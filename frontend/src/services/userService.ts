import { get } from './api';
import { User } from '@taskify/shared';

/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<User[]> {
  return get<User[]>('/users');
}

/**
 * Fetch single user by ID
 */
export async function fetchUser(userId: string): Promise<User> {
  return get<User>(`/users/${userId}`);
}
