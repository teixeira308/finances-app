import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppLoader } from '@/shared/components/AppLoader';
import { useAppSelector } from '../store/hooks';
import { selectTermsAccepted, selectTermsLoading } from '../features/terms/store/termsSlice';

interface TermsGuardProps {
  children: React.ReactNode;
}

export const TermsGuard: React.FC<TermsGuardProps> = ({ children }) => {
  const accepted = useAppSelector(selectTermsAccepted);
  const loading = useAppSelector(selectTermsLoading);

  if (loading) {
    return <AppLoader message="Carregando termos de uso..." />;
  }

  if (!accepted) {
    return <Navigate to="/termos" replace />;
  }

  return <>{children}</>;
};
