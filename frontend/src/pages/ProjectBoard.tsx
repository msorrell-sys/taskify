import React, { useEffect, useState } from 'react';
import { Project, Task, Status, User, CreateTaskInput, UpdateTaskInput } from '@taskify/shared';
import { fetchProjects } from '../services/projectService';
import { fetchProjectTasks, createTask, updateTask } from '../services/taskService';
import { fetchUsers } from '../services/userService';
import { Header } from '../components/Header';
import { ProjectSelector } from '../components/ProjectSelector';
import { UserFilter } from '../components/UserFilter';
import { DraggableKanbanBoard } from '../components/DraggableKanbanBoard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import './ProjectBoard.css';

export function ProjectBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>(''); // Default user for comments
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch projects and users on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [projectsData, usersData] = await Promise.all([
          fetchProjects(),
          fetchUsers(),
        ]);

        setProjects(projectsData);
        setUsers(usersData);

        // Auto-select first project
        if (projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
        }

        // Set first user as default for comments
        if (usersData.length > 0) {
          setCurrentUserId(usersData[0].id);
        }
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Error loading initial data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Fetch tasks when project changes
  useEffect(() => {
    if (!selectedProjectId) return;

    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const tasksData = await fetchProjectTasks(selectedProjectId);
        setTasks(tasksData);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [selectedProjectId]);

  // Filter tasks by user
  useEffect(() => {
    if (selectedUserId) {
      setFilteredTasks(tasks.filter((task) => task.assigneeId === selectedUserId));
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, selectedUserId]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskMove = async (taskId: string, newStatus: Status) => {
    try {
      // Optimistically update UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Update on server
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      setError('Failed to move task');
      console.error('Error moving task:', err);

      // Reload tasks to get correct state
      if (selectedProjectId) {
        const tasksData = await fetchProjectTasks(selectedProjectId);
        setTasks(tasksData);
      }
    }
  };

  const handleCreateTask = async (data: CreateTaskInput) => {
    if (!selectedProjectId) return;

    const newTask = await createTask(selectedProjectId, data);
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdate = async (taskId: string, updates: UpdateTaskInput) => {
    const updatedTask = await updateTask(taskId, updates);

    // Update in local state
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );

    // Update selected task if it's open
    if (selectedTask?.id === taskId) {
      setSelectedTask(updatedTask);
    }
  };

  return (
    <div className="project-board">
      <Header projectName={selectedProject?.name} />

      <main className="project-board-main">
        <div className="container">
          <div className="project-board-toolbar">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
            />

            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!selectedProjectId}
            >
              + New Task
            </button>
          </div>

          {selectedProjectId && (
            <UserFilter
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          )}

          {error && <div className="error-message">{error}</div>}

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          )}

          {!loading && !error && selectedProjectId && (
            <DraggableKanbanBoard
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onTaskMove={handleTaskMove}
            />
          )}

          {!loading && !error && !selectedProjectId && (
            <div className="empty-state">
              <p>Select a project to view tasks</p>
            </div>
          )}
        </div>
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        users={users}
      />

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        users={users}
        currentUserId={currentUserId}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}
