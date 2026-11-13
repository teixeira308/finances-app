import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppLoader } from '@/shared/components/AppLoader';
import { useAppSelector } from '../store/hooks';
import { selectHasSeenOnboarding, selectOnboardingBootstrapped } from '../features/onboarding/store/onboardingSlice';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const hasSeenOnboarding = useAppSelector(selectHasSeenOnboarding);
  const bootstrapped = useAppSelector(selectOnboardingBootstrapped);

  if (!bootstrapped) {
    return <AppLoader message="Preparando sua experiência..." />;
  }

  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
