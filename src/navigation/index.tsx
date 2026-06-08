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
    <div className="fixed-bottom bg-black border-top border-white border-opacity-10" style={{ zIndex: 1040 }}>
      <div 
        className="d-flex align-items-center justify-content-between mx-auto" 
        style={{ maxWidth: '448px', height: '60px' }}
      >
        
        {/* Left Side */}
        <div className="d-flex flex-grow-1 justify-content-evenly">
          {navItemsLeft.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon!;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="btn border-0 d-flex flex-column align-items-center justify-content-center p-0 shadow-none"
              >
                <div style={{ color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)', marginBottom: '2px' }}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: isActive ? 600 : 500, 
                  color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)' 
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Central Button */}
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
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Right Side */}
        <div className="d-flex flex-grow-1 justify-content-evenly">
          {navItemsRight.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon!;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="btn border-0 d-flex flex-column align-items-center justify-content-center p-0 shadow-none"
              >
                <div style={{ color: isActive ? 'var(--ios-blue)' : 'var(--ios-gray)', marginBottom: '2px' }}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: isActive ? 600 : 500, 
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
