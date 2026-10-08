import React from 'react';
import { User } from '@taskify/shared';
import './UserFilter.css';

interface UserFilterProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}

export function UserFilter({ users, selectedUserId, onSelectUser }: UserFilterProps) {
  return (
    <div className="user-filter">
      <label htmlFor="user-filter-select" className="user-filter-label">
        Filter by assignee:
      </label>
      <select
        id="user-filter-select"
        className="user-filter-select"
        value={selectedUserId || ''}
        onChange={(e) => onSelectUser(e.target.value || null)}
      >
        <option value="">All tasks</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.fullName}
          </option>
        ))}
      </select>

      {selectedUserId && (
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => onSelectUser(null)}
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
