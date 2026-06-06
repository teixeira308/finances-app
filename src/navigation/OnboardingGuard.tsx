import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectHasSeenOnboarding } from '../features/onboarding/store/onboardingSlice';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const hasSeenOnboarding = useAppSelector(selectHasSeenOnboarding);

  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
