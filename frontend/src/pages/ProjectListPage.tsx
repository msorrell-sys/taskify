import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@taskify/shared';
import { fetchProjects } from '../services/projectService';
import { Header } from '../components/Header';
import './ProjectListPage.css';

export function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="project-list-page">
      <Header />

      <main className="project-list-main">
        <div className="container">
          <h1 className="project-list-title">Projects</h1>

          {error && <div className="error-message">{error}</div>}

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          )}

          {!loading && !error && (
            <div className="project-grid">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <h2 className="project-card-name">{project.name}</h2>
                  <div className="project-card-footer">
                    <span className="project-card-link">View Board →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="empty-state">
              <p>No projects available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
