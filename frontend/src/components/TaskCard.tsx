import React from 'react';
import { Task } from '@taskify/shared';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const descriptionPreview = task.description
    ? task.description.length > 50
      ? task.description.substring(0, 50) + '...'
      : task.description
    : null;

  const commentCount = task._count?.comments || 0;

  return (
    <div className="task-card" onClick={onClick}>
      <h3 className="task-card-title">{task.title}</h3>

      {descriptionPreview && (
        <p className="task-card-description">{descriptionPreview}</p>
      )}

      <div className="task-card-footer">
        <div className="task-card-assignee">
          {task.assignee ? (
            <span className="assignee-badge">{task.assignee.fullName}</span>
          ) : (
            <span className="assignee-badge unassigned">Unassigned</span>
          )}
        </div>

        {commentCount > 0 && (
          <div className="task-card-comments">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 10.667c0 .736-.597 1.333-1.333 1.333H4L1.333 14.667V2.667c0-.737.597-1.334 1.334-1.334h10.666c.736 0 1.334.597 1.334 1.334v8z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{commentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
