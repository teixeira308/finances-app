import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Tags, Settings, Plus } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItemsLeft = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Extrato', path: '/extrato', icon: ListOrdered },
  ];

  const navItemsRight = [
    { label: 'Categorias', path: '/categories', icon: Tags },
    { label: 'Ajustes', path: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed-bottom d-flex justify-content-center pointer-events-none">
      <div 
        className="w-100 bottom-nav d-flex align-items-center px-3 pb-3 pointer-events-auto position-relative" 
        style={{ maxWidth: '448px', backgroundColor: 'black' }}
      >
        
        {/* Left Side (2 items) */}
        <div className="d-flex flex-grow-1 justify-content-around" style={{ flexBasis: '40%' }}>
          {navItemsLeft.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon!;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="btn border-0 d-flex flex-column align-items-center gap-1 shadow-none"
                style={{ background: 'none' }}
              >
                <div style={{ color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' }}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: 500, 
                  color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' 
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Central Button - Perfectly Centered */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-25px' }}>
          <button
            onClick={() => navigate('/new-transaction')}
            className="btn rounded-circle d-flex align-items-center justify-content-center shadow"
            style={{ 
              width: '56px', 
              height: '56px', 
              backgroundColor: 'var(--ios-blue)', 
              color: 'white',
              border: 'none'
            }}
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Right Side (2 items) */}
        <div className="d-flex flex-grow-1 justify-content-around" style={{ flexBasis: '40%' }}>
          {navItemsRight.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon!;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="btn border-0 d-flex flex-column align-items-center gap-1 shadow-none"
                style={{ background: 'none' }}
              >
                <div style={{ color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' }}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span style={{ 
                  fontSize: '9px', 
                  fontWeight: 500, 
                  color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' 
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
