import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Landmark, CreditCard, ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkspaceSwitcher: React.FC = () => {
  const { workspaces, activeWorkspace, changeWorkspace } = useWorkspaces();
  const navigate = useNavigate();

  if (!activeWorkspace) return null;

  return (
    <Dropdown className="workspace-switcher">
      <Dropdown.Toggle 
        variant="transparent" 
        className="d-flex align-items-center gap-2 border-0 p-0 text-white shadow-none no-caret"
      >
        <div 
          className="rounded-2 p-1.5 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: activeWorkspace.metadata?.color || '#1C1C1E' }}
        >
          {activeWorkspace.type === 'ACCOUNT' ? <Landmark size={20} /> : <CreditCard size={20} />}
        </div>
        <span className="fw-bold small">{activeWorkspace.name}</span>
        <ChevronDown size={14} className="text-ios-gray" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="bg-ios-dark-gray border-white border-opacity-10 shadow-lg p-2 rounded-3 mt-2">
        <div className="px-3 py-2 text-ios-gray x-small fw-bold text-uppercase">Meus Espaços</div>
        {workspaces.map((ws) => (
          <Dropdown.Item 
            key={ws.id} 
            onClick={() => changeWorkspace(ws.id)}
            className={`rounded-2 d-flex align-items-center gap-3 py-2 px-3 text-white transition-all ${ws.id === activeWorkspace.id ? 'bg-primary' : 'hover-bg-white-10'}`}
          >
            {ws.type === 'ACCOUNT' ? <Landmark size={16} /> : <CreditCard size={16} />}
            <span className="small fw-medium">{ws.name}</span>
          </Dropdown.Item>
        ))}
        
        <Dropdown.Divider className="border-white border-opacity-10" />
        
        <Dropdown.Item 
          onClick={() => navigate('/workspaces')}
          className="rounded-2 d-flex align-items-center gap-3 py-2 px-3 text-ios-blue hover-bg-white-10"
        >
          <Plus size={16} />
          <span className="small fw-bold">Gerenciar Espaços</span>
        </Dropdown.Item>
      </Dropdown.Menu>

      <style>{`
        .no-caret::after {
          display: none !important;
        }
        .workspace-switcher .dropdown-menu {
          min-width: 220px;
        }
        .hover-bg-white-10:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </Dropdown>
  );
};
