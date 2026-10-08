import React from 'react';
import { Task, Status } from '@taskify/shared';
import { KanbanColumn } from './KanbanColumn';
import './KanbanBoard.css';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const STATUSES: Status[] = ['ToDo', 'InProgress', 'InReview', 'Done'];

export function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  // Group tasks by status
  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<Status, Task[]>);

  return (
    <div className="kanban-board">
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
}
