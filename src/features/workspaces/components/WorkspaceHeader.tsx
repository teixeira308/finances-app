import React from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

interface WorkspaceHeaderProps {
  title: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ title }) => {
  const { activeWorkspace } = useWorkspaces();

  return (
    <div 
      className="px-4 py-3 d-flex align-items-center justify-content-between text-white"
      style={{ 
        backgroundColor: activeWorkspace?.metadata?.color || '#1C1C1E',
        transition: 'background-color 0.3s ease'
      }}
    >
      <h1 className="h3 fw-bold m-0">{title}</h1>
      <WorkspaceSwitcher />
    </div>
  );
};
