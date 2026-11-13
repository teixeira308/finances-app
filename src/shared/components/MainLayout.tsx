import React, { useState, useEffect } from 'react';
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

const [layoutDebug, setLayoutDebug] = useState('');

useEffect(() => {
  const measure = () => {
    const shell = document.querySelector('.app-shell');
    const nav = document.querySelector('.mobile-navigation');

    if (!shell || !nav) return;

    const shellRect = shell.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const navStyle = window.getComputedStyle(nav);

    setLayoutDebug(
      `tela=${window.screen.height} ` +
      `janela=${window.innerHeight} ` +
      `visual=${Math.round(window.visualViewport?.height ?? 0)} ` +
      `app=${Math.round(shellRect.height)} ` +
      `menuTopo=${Math.round(navRect.top)} ` +
      `menuFim=${Math.round(navRect.bottom)} ` +
      `margemMenu=${navStyle.paddingBottom}`
    );
  };

  const frame = requestAnimationFrame(measure);
  window.addEventListener('resize', measure);
  window.visualViewport?.addEventListener('resize', measure);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', measure);
    window.visualViewport?.removeEventListener('resize', measure);
  };
}, []);

  return (
     <div className="app-shell bg-black text-white d-flex">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content Area */}
      <main 
        className="app-main flex-grow-1 transition-all d-flex flex-column"
        style={{ 
          marginLeft: '0px',
          paddingBottom: 'calc(60px + var(--safe-area-bottom))',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Workspace Identification Banner */}
        <div 
          className="app-workspace-bar d-flex align-items-center justify-content-end px-4 py-2 sticky-top transition-all"
          style={{ 
            zIndex: 1020, 
            backgroundColor: activeWorkspace?.metadata?.color || '#1C1C1E',
            transition: 'background-color 0.3s ease'
          }}
        >
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
  <div
  style={{
    position: 'fixed',
    top: '40%',
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: '8px',
    background: '#fff',
    color: '#000',
    fontSize: '12px',
    overflowWrap: 'anywhere',
    pointerEvents: 'none',
  }}
>
  DEBUG: {layoutDebug}
</div>
</div>
  

        
      
    </div>
  );
};

export default MainLayout;
