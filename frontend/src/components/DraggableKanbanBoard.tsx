import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Task, Status } from '@taskify/shared';
import { DroppableColumn } from './DroppableColumn';
import { TaskCard } from './TaskCard';
import './KanbanBoard.css';

interface DraggableKanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskMove: (taskId: string, newStatus: Status) => Promise<void>;
}

const STATUSES: Status[] = ['ToDo', 'InProgress', 'InReview', 'Done'];

export function DraggableKanbanBoard({
  tasks,
  onTaskClick,
  onTaskMove,
}: DraggableKanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  // Group tasks by status
  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {} as Record<Status, Task[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;
    const task = tasks.find((t) => t.id === taskId);

    // Only update if status actually changed
    if (task && task.status !== newStatus) {
      await onTaskMove(taskId, newStatus);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STATUSES.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
