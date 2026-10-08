import React, { useState, useEffect } from 'react';
import { Task, User, Comment, CreateCommentInput, UpdateTaskInput } from '@taskify/shared';
import { fetchTaskComments, createComment } from '../services/commentService';
import { Modal } from './Modal';
import './TaskDetailsModal.css';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  users: User[];
  currentUserId: string; // For adding comments
  onTaskUpdate: (taskId: string, updates: UpdateTaskInput) => Promise<void>;
}

export function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  users,
  currentUserId,
  onTaskUpdate,
}: TaskDetailsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load comments when task changes
  useEffect(() => {
    if (!task || !isOpen) return;

    async function loadComments() {
      setIsLoadingComments(true);
      setError(null);

      try {
        const commentsData = await fetchTaskComments(task.id);
        setComments(commentsData);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error loading comments:', err);
      } finally {
        setIsLoadingComments(false);
      }
    }

    loadComments();
  }, [task, isOpen]);

  const handleAssigneeChange = async (newAssigneeId: string) => {
    if (!task) return;

    try {
      await onTaskUpdate(task.id, {
        assigneeId: newAssigneeId || null,
      });
    } catch (err) {
      setError('Failed to update assignee');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !commentText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await createComment(task.id, {
        text: commentText.trim(),
        authorId: currentUserId,
      });

      setComments([...comments, newComment]);
      setCommentText('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) return null;

  const statusBadgeClass = `badge badge-${task.status.toLowerCase()}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="task-details">
        {error && <div className="error-message">{error}</div>}

        <div className="task-details-header">
          <h3 className="task-details-title">{task.title}</h3>
          <span className={statusBadgeClass}>{task.status}</span>
        </div>

        {task.description && (
          <div className="task-details-section">
            <h4 className="section-title">Description</h4>
            <p className="task-description">{task.description}</p>
          </div>
        )}

        <div className="task-details-section">
          <h4 className="section-title">Assigned to</h4>
          <select
            className="input"
            value={task.assigneeId || ''}
            onChange={(e) => handleAssigneeChange(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <div className="task-details-section">
          <h4 className="section-title">Comments ({comments.length})</h4>

          {isLoadingComments ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading comments...</p>
            </div>
          ) : (
            <>
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="text-muted text-sm">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.author.fullName}
                        </span>
                        <span className="comment-date text-xs text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                  className="input textarea"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  maxLength={1000}
                  disabled={isSubmitting}
                />
                <div className="add-comment-actions">
                  <span className="field-hint">{commentText.length}/1000</span>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSubmitting || !commentText.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        Adding...
                      </>
                    ) : (
                      'Add Comment'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
