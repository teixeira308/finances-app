import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Tags, Settings, Plus, BarChart3, Menu, ChevronLeft, CreditCard, Landmark, Repeat } from 'lucide-react';
import logoNome from '@/assets/logo-nome.png';
import favicon from '/favicon.png';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useUserProfile();
  const { activeWorkspace } = useWorkspaces();

  const getNavItems = () => {
    if (activeWorkspace?.type === 'CREDIT_CARD') {
      return [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Compras', path: '/extrato', icon: ListOrdered },
        { label: 'Faturas', path: '/faturas', icon: BarChart3 },
        { label: 'Parcelamentos', path: '/parcelamentos', icon: Repeat },
        { label: 'Ajustes', path: '/settings', icon: Settings },
      ];
    }
    return [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Extrato', path: '/extrato', icon: ListOrdered },
      { label: 'Relatórios', path: '/reports', icon: BarChart3 },
      { label: 'Categorias', path: '/categories', icon: Tags },
      { label: 'Ajustes', path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();
  const sidebarWidth = isCollapsed ? '80px' : '260px';

  return (
    <div 
      className="d-none d-md-flex flex-column fixed-top h-100 bg-ios-dark-gray border-end border-white border-opacity-10 transition-all shadow-lg" 
      style={{ width: sidebarWidth, zIndex: 1030, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Header with Toggle */}
      <div className={`p-3 d-flex align-items-center ${isCollapsed ? 'flex-column gap-3' : 'justify-content-between'} mb-4`}>
        {isCollapsed ? (
          <img src={favicon} alt="Logo" style={{ width: '32px', height: '32px' }} />
        ) : (
          <img src={logoNome} alt="Gastos Mensais" className="img-fluid rounded-3" style={{ maxHeight: '32px' }} />
        )}
        <button 
          onClick={onToggle}
          className="btn btn-link text-ios-gray p-2 border-0 shadow-none hover-white"
          aria-label="Alternar menu"
        >
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* Workspace Context Display */}
      {!isCollapsed && activeWorkspace && (
        <div 
          className="mx-3 mb-4 p-2 rounded-3 bg-black bg-opacity-30 border border-white border-opacity-5 d-flex align-items-center gap-2 cursor-pointer hover-white"
          onClick={() => navigate('/workspaces')}
          title="Mudar Espaço"
        >
          <div 
            className="rounded-2 p-2 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: activeWorkspace.metadata?.color || '#1C1C1E' }}
          >
            {activeWorkspace.type === 'ACCOUNT' ? <Landmark size={14} className="text-white" /> : <CreditCard size={14} className="text-white" />}
          </div>
          <div className="d-flex flex-column overflow-hidden">
            <span className="text-white small fw-bold text-truncate">{activeWorkspace.name}</span>
            <span className="text-ios-gray x-small">Mudar Espaço</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="px-3 mb-4 d-flex justify-content-center">
        <button
          onClick={() => navigate('/new-transaction')}
          className={`btn d-flex align-items-center justify-content-center shadow transition-all ${isCollapsed ? 'rounded-circle' : 'btn-primary text-white w-100 py-3 rounded-3 gap-2'}`}
          style={{ 
            height: isCollapsed ? '48px' : 'auto',
            width: isCollapsed ? '48px' : '100%',
            minWidth: isCollapsed ? '48px' : 'auto',
            padding: isCollapsed ? '0' : undefined,
            backgroundColor: isCollapsed ? 'var(--ios-blue)' : undefined,
            color: isCollapsed ? 'white' : undefined,
            border: 'none'
          }}
          title="Nova Transação"
          aria-label="Nova Transação"
        >
          <Plus size={24} strokeWidth={3} />
          {!isCollapsed && <span className="fw-bold">Nova Transação</span>}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-grow-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`btn w-100 d-flex align-items-center gap-3 px-3 py-3 mb-1 border-0 transition-all ${
                isActive ? 'bg-primary bg-opacity-10 text-primary' : 'text-ios-gray'
              }`}
              style={{ 
                borderRadius: '12px',
                textAlign: 'left',
                backgroundColor: isActive ? 'var(--ios-blue)' : 'transparent',
                color: isActive ? 'white' : 'var(--ios-gray)',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
              title={isCollapsed ? item.label : ''}
              aria-label={item.label}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? 'white' : 'inherit', minWidth: '22px' }} />
              {!isCollapsed && <span style={{ fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-3 border-top border-white border-opacity-10">
        <div 
          className={`d-flex align-items-center gap-3 text-ios-gray cursor-pointer hover-white transition-all ${isCollapsed ? 'justify-content-center' : ''}`}
          onClick={() => navigate('/profile')}
          title="Ver Perfil"
        >
          <UserAvatar 
            name={profile?.displayName || profile?.email || 'User'} 
            size={32} 
          />
          {!isCollapsed && (
            <div className="d-flex flex-column overflow-hidden">
              <span className="text-nowrap fw-bold text-white small">
                {profile?.firstName || profile?.displayName?.split(' ')[0] || 'Usuário'}
              </span>
              <span className="text-nowrap extra-small opacity-50" style={{ fontSize: '10px' }}>Meu Perfil</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
