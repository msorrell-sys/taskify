import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '@taskify/shared';
import { TaskCard } from './TaskCard';

interface DraggableTaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function DraggableTaskCard({ task, onClick }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    : { cursor: 'grab' };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}
