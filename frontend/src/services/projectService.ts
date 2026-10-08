import { get } from './api';
import { Project } from '@taskify/shared';

/**
 * Fetch all projects
 */
export async function fetchProjects(): Promise<Project[]> {
  return get<Project[]>('/projects');
}

/**
 * Fetch single project by ID
 */
export async function fetchProject(projectId: string): Promise<Project> {
  return get<Project>(`/projects/${projectId}`);
}
