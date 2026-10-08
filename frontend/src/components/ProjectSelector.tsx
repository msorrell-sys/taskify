import React from 'react';
import { Project } from '@taskify/shared';
import './ProjectSelector.css';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
}: ProjectSelectorProps) {
  return (
    <div className="project-selector">
      <label htmlFor="project-select" className="project-selector-label">
        Select Project:
      </label>
      <select
        id="project-select"
        className="project-selector-select"
        value={selectedProjectId || ''}
        onChange={(e) => onSelectProject(e.target.value)}
      >
        <option value="" disabled>
          Choose a project...
        </option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
