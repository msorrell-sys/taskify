import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, Status } from '@taskify/shared';
import { DraggableTaskCard } from './DraggableTaskCard';
import './KanbanColumn.css';

interface DroppableColumnProps {
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

export function DroppableColumn({ status, tasks, onTaskClick }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  });

  const columnClass = `kanban-column ${isOver ? 'kanban-column-over' : ''}`;

  return (
    <div className={columnClass}>
      <div className={`kanban-column-header ${COLUMN_COLORS[status]}`}>
        <h2 className="kanban-column-title">{COLUMN_TITLES[status]}</h2>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>

      <div ref={setNodeRef} className="kanban-column-content">
        {tasks.length === 0 ? (
          <p className="kanban-column-empty">No tasks</p>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
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
