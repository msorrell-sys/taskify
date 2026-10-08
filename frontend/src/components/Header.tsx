import React from 'react';
import './Header.css';

interface HeaderProps {
  projectName?: string;
}

export function Header({ projectName }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-left">
          <h1 className="header-title">Taskify</h1>
          {projectName && (
            <>
              <span className="header-divider">/</span>
              <span className="header-project">{projectName}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
