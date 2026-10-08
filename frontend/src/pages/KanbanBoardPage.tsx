import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Task, Status, User, CreateTaskInput, UpdateTaskInput } from '@taskify/shared';
import { fetchProject } from '../services/projectService';
import { fetchProjectTasks, createTask, updateTask } from '../services/taskService';
import { fetchUsers } from '../services/userService';
import { Header } from '../components/Header';
import { UserFilter } from '../components/UserFilter';
import { DraggableKanbanBoard } from '../components/DraggableKanbanBoard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import './KanbanBoardPage.css';

export function KanbanBoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Fetch project and users on mount
  useEffect(() => {
    async function loadInitialData() {
      if (!projectId) return;

      try {
        const [projectData, usersData] = await Promise.all([
          fetchProject(projectId),
          fetchUsers(),
        ]);

        setProject(projectData);
        setUsers(usersData);

        // Set first user as default for comments
        if (usersData.length > 0) {
          setCurrentUserId(usersData[0].id);
        }
      } catch (err) {
        setError('Failed to load project data');
        console.error('Error loading project data:', err);
      }
    }

    loadInitialData();
  }, [projectId]);

  // Fetch tasks when project changes
  useEffect(() => {
    if (!projectId) return;

    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const tasksData = await fetchProjectTasks(projectId);
        setTasks(tasksData);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [projectId]);

  // Filter tasks by user
  useEffect(() => {
    if (selectedUserId) {
      setFilteredTasks(tasks.filter((task) => task.assigneeId === selectedUserId));
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, selectedUserId]);

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
      if (projectId) {
        const tasksData = await fetchProjectTasks(projectId);
        setTasks(tasksData);
      }
    }
  };

  const handleCreateTask = async (data: CreateTaskInput) => {
    if (!projectId) return;

    const newTask = await createTask(projectId, data);
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

  const handleBackToProjects = () => {
    navigate('/');
  };

  return (
    <div className="kanban-board-page">
      <Header projectName={project?.name} />

      <main className="kanban-board-main">
        <div className="container">
          <div className="kanban-board-header">
            <button className="btn btn-secondary" onClick={handleBackToProjects}>
              ← Back to Projects
            </button>

            <h1 className="kanban-board-title">{project?.name || 'Loading...'}</h1>

            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!projectId}
            >
              + New Task
            </button>
          </div>

          {projectId && (
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

          {!loading && !error && projectId && (
            <DraggableKanbanBoard
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onTaskMove={handleTaskMove}
            />
          )}

          {!loading && !error && !projectId && (
            <div className="empty-state">
              <p>Project not found</p>
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
