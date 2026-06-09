import React, { useState } from 'react';
import Sidebar from '../../navigation/Sidebar';
import Navigation from '../../navigation';
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { activeWorkspace } = useWorkspaces();

  return (
    <div className="bg-black text-white d-flex" style={{ minHeight: '100dvh', height: '100dvh' }}>
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content Area */}
      <main 
        className="flex-grow-1 transition-all d-flex flex-column"
        style={{ 
          marginLeft: '0px',
          paddingBottom: 'calc(100px + var(--safe-area-bottom))',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Workspace Identification Banner */}
        <div 
          className="d-flex align-items-center justify-content-end px-4 py-2 sticky-top transition-all"
          style={{ 
            zIndex: 1020, 
            backgroundColor: activeWorkspace?.metadata?.color || '#1C1C1E',
            transition: 'background-color 0.3s ease'
          }}
        >
          <WorkspaceSwitcher />
        </div>

        {/* Dynamic margin for desktop */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) {
            main {
              margin-left: ${isCollapsed ? '80px' : '260px'} !important;
              padding-bottom: 0 !important;
            }
            main > .content-wrapper {
              overflow-y: visible !important;
            }
          }
        `}} />
        
        <div className="content-wrapper flex-grow-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="d-md-none">
        <Navigation />
      </div>
    </div>
  );
};

export default MainLayout;
