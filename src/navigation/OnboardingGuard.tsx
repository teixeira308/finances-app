import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAppSelector } from '../store/hooks';
import { selectHasSeenOnboarding, selectOnboardingBootstrapped } from '../features/onboarding/store/onboardingSlice';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const hasSeenOnboarding = useAppSelector(selectHasSeenOnboarding);
  const bootstrapped = useAppSelector(selectOnboardingBootstrapped);

  if (!bootstrapped) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-black" style={{ minHeight: '100dvh', height: '100%' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
