import React from 'react';
import { Task, Status } from '@taskify/shared';
import { TaskCard } from './TaskCard';
import './KanbanColumn.css';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const COLUMN_TITLES: Record<Status, string> = {
  ToDo: 'To Do',
  InProgress: 'In Progress',
  InReview: 'In Review',
  Done: 'Done',
};

const COLUMN_COLORS: Record<Status, string> = {
  ToDo: 'column-todo',
  InProgress: 'column-inprogress',
  InReview: 'column-inreview',
  Done: 'column-done',
};

export function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  return (
    <div className="kanban-column">
      <div className={`kanban-column-header ${COLUMN_COLORS[status]}`}>
        <h2 className="kanban-column-title">{COLUMN_TITLES[status]}</h2>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>

      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <p className="kanban-column-empty">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}
