import type { OnboardingState } from "@/shared/models/finance";

const STORAGE_KEY = 'onboarding_state';

const defaultState: OnboardingState = {
  hasSeenOnboarding: false,
  entryMode: "skip_to_local"
};

export async function loadOnboardingState(): Promise<OnboardingState> {
  const cached = localStorage.getItem(STORAGE_KEY);
  return cached ? (JSON.parse(cached) as OnboardingState) : defaultState;
}

export async function completeOnboarding(): Promise<OnboardingState> {
  const state: OnboardingState = {
    hasSeenOnboarding: true,
    completedAt: new Date().toISOString(),
    entryMode: "skip_to_local"
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}
