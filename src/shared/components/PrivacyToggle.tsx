import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from 'react-bootstrap';
import { usePrivacyStore } from '@/store/privacyStore';

export const PrivacyToggle = () => {
  const { isHidden, togglePrivacy } = usePrivacyStore();

  return (
    <Button 
      variant="link" 
      onClick={togglePrivacy} 
      className="p-1 text-white shadow-none border-0"
    >
      {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
    </Button>
  );
};
