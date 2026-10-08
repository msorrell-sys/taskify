import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectListPage } from './pages/ProjectListPage';
import { KanbanBoardPage } from './pages/KanbanBoardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectListPage />} />
        <Route path="/projects/:projectId" element={<KanbanBoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
