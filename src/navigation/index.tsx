import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Tags, Settings } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Início', path: '/', icon: LayoutDashboard },
    { label: 'Extrato', path: '/extrato', icon: ListOrdered },
    { label: 'Categorias', path: '/categories', icon: Tags },
    { label: 'Ajustes', path: '/settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto bg-black/80 backdrop-blur-lg border-t border-white/10 px-6 h-20 flex items-center justify-between pb-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 transition-all duration-300"
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-ios-gray'}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-ios-gray'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
