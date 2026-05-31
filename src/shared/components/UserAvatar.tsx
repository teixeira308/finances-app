import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 40, className = "" }) => {
  const getInitials = (name: string) => {
    if (!name) return "?";
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div 
      className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        backgroundColor: 'var(--ios-blue)', 
        color: 'white',
        fontSize: `${size * 0.4}px`,
        flexShrink: 0
      }}
      title={name}
    >
      {initials}
    </div>
  );
};
