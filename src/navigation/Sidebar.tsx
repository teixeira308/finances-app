import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Tags, Settings, Plus, BarChart3, Menu, ChevronLeft } from 'lucide-react';
import logoNome from '@/assets/logo-nome.png';
import favicon from '/favicon.png';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Extrato', path: '/extrato', icon: ListOrdered },
    { label: 'Relatórios', path: '/reports', icon: BarChart3 },
    { label: 'Categorias', path: '/categories', icon: Tags },
    { label: 'Ajustes', path: '/settings', icon: Settings },
  ];

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
          <img src={logoNome} alt="Gastos Mensais" className="img-fluid" style={{ maxHeight: '32px' }} />
        )}
        <button 
          onClick={onToggle}
          className="btn btn-link text-ios-gray p-2 border-0 shadow-none hover-white"
        >
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

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
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? 'white' : 'inherit', minWidth: '22px' }} />
              {!isCollapsed && <span style={{ fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
 
    </div>
  );
};

export default Sidebar;
