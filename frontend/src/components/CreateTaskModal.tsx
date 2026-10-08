import React, { useState } from 'react';
import { User, CreateTaskInput } from '@taskify/shared';
import { Modal } from './Modal';
import './CreateTaskModal.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  users: User[];
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  users,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId: assigneeId || undefined,
      });

      // Reset form and close
      setTitle('');
      setDescription('');
      setAssigneeId('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      setAssigneeId('');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="create-task-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-field">
          <label htmlFor="task-title" className="label">
            Title <span className="required">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            maxLength={200}
            disabled={isSubmitting}
            autoFocus
          />
          <span className="field-hint">{title.length}/200</span>
        </div>

        <div className="form-field">
          <label htmlFor="task-description" className="label">
            Description
          </label>
          <textarea
            id="task-description"
            className="input textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows={4}
            maxLength={2000}
            disabled={isSubmitting}
          />
          <span className="field-hint">{description.length}/2000</span>
        </div>

        <div className="form-field">
          <label htmlFor="task-assignee" className="label">
            Assign to
          </label>
          <select
            id="task-assignee"
            className="input"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
