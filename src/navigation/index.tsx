import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Tags, Settings, Plus, BarChart3, CreditCard, Repeat } from 'lucide-react';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeWorkspace } = useWorkspaces();

  const isCreditCard = activeWorkspace?.type === 'CREDIT_CARD';

  const navItems = isCreditCard
    ? [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Faturas', path: '/faturas', icon: CreditCard },
        { label: 'Parcelamentos', path: '/parcelamentos', icon: Repeat },
        { label: 'Ajustes', path: '/settings', icon: Settings },
      ]
    : [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Extrato', path: '/extrato', icon: ListOrdered },
        { label: 'Relatórios', path: '/reports', icon: BarChart3 },
        { label: 'Ajustes', path: '/settings', icon: Settings },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed-bottom bg-black border-top border-white border-opacity-10 safe-area-bottom" style={{ zIndex: 1040 }}>
      <div 
        className="d-flex align-items-center justify-content-between mx-auto" 
        style={{ maxWidth: '448px', height: '60px' }}
      >
        {/* Left side: first half of items */}
        <div className="d-flex flex-grow-1 justify-content-around">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="btn border-0 d-flex flex-column align-items-center justify-content-center p-0 shadow-none"
              >
                <div style={{ color: active ? 'var(--ios-blue)' : 'var(--ios-gray)', marginBottom: '2px' }}>
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: active ? 600 : 500, 
                  color: active ? 'var(--ios-blue)' : 'var(--ios-gray)' 
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Central FAB */}
        <div style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/new-transaction')}
            className="btn rounded-circle d-flex align-items-center justify-content-center shadow-lg position-relative"
            style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: 'var(--ios-blue)', 
              color: 'white',
              border: 'none',
              marginTop: '-30px'
            }}
            aria-label="Nova transação"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Right side: last half of items */}
        <div className="d-flex flex-grow-1 justify-content-around">
          {navItems.slice(2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="btn border-0 d-flex flex-column align-items-center justify-content-center p-0 shadow-none"
              >
                <div style={{ color: active ? 'var(--ios-blue)' : 'var(--ios-gray)', marginBottom: '2px' }}>
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: active ? 600 : 500, 
                  color: active ? 'var(--ios-blue)' : 'var(--ios-gray)' 
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
