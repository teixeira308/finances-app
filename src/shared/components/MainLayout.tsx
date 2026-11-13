import React, { useState } from 'react';
import Sidebar from '../../navigation/Sidebar';
import Navigation from '../../navigation';
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import logoNome from '@/assets/logo-nome.png';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeWorkspace } = useWorkspaces();

  return (
    <div className="app-shell bg-black text-white d-flex">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content Area */}
      <main 
        className="app-main flex-grow-1 transition-all d-flex flex-column"
        style={{ 
          marginLeft: '0px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Workspace Identification Banner */}
        <div 
          className="app-workspace-bar d-flex align-items-center justify-content-between transition-all"
          style={{ 
            zIndex: 1020, 
            backgroundColor: activeWorkspace?.metadata?.color || '#1C1C1E',
            transition: 'background-color 0.3s ease'
          }}
        >
          <img src={logoNome} alt="Nexo" className="app-workspace-logo" />
          <WorkspaceSwitcher />
        </div>

        {/* Dynamic margin for desktop */}
        <style>{`
          @media (min-width: 768px) {
            main {
              margin-left: ${isCollapsed ? '80px' : '260px'} !important;
              padding-bottom: 0 !important;
            }
          }
        `}</style>
        
        <div className="content-wrapper flex-grow-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-navigation-wrapper d-md-none">
        <Navigation />
      </div>
    </div>
  );
};

export default MainLayout;
