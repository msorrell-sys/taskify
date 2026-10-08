import prisma from '../db/client';
import { Project } from '@taskify/shared';

/**
 * Fetch all projects
 * @returns List of all projects ordered by name
 */
export async function getAllProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: { name: 'asc' },
  });

  return projects.map(project => ({
    ...project,
    createdAt: project.createdAt.toISOString(),
  }));
}

/**
 * Get project by ID
 * @param projectId - Project UUID
 * @returns Project or null if not found
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return null;
  }

  return {
    ...project,
    createdAt: project.createdAt.toISOString(),
  };
}
