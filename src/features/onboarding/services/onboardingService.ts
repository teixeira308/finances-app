import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/shared/services/firebase';

const COLLECTION_NAME = 'users';

export interface OnboardingState {
  hasSeenOnboarding: boolean;
  completedAt?: string;
}

export interface TransactionGuideState {
  hasSeenTransactionGuide: boolean;
}

export async function loadOnboardingState(): Promise<OnboardingState> {
  const user = auth.currentUser;
  if (!user) return { hasSeenOnboarding: false };

  try {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.hasSeenOnboarding === true) {
        return {
          hasSeenOnboarding: true,
          completedAt: data.onboardingCompletedAt,
        };
      }
    }
    return { hasSeenOnboarding: false };
  } catch {
    return { hasSeenOnboarding: false };
  }
}

export async function completeOnboarding(): Promise<OnboardingState> {
  const user = auth.currentUser;
  if (!user) return { hasSeenOnboarding: false };

  const state: OnboardingState = {
    hasSeenOnboarding: true,
    completedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    await updateDoc(docRef, {
      hasSeenOnboarding: true,
      onboardingCompletedAt: state.completedAt,
    });
  } catch {
    await setDoc(doc(db, COLLECTION_NAME, user.uid), {
      hasSeenOnboarding: true,
      onboardingCompletedAt: state.completedAt,
    });
  }

  return state;
}

export async function loadTransactionGuideState(): Promise<TransactionGuideState> {
  const user = auth.currentUser;
  if (!user) return { hasSeenTransactionGuide: false };

  try {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().hasSeenTransactionGuide === true) {
      return { hasSeenTransactionGuide: true };
    }
    return { hasSeenTransactionGuide: false };
  } catch {
    return { hasSeenTransactionGuide: false };
  }
}

export async function completeTransactionGuide(): Promise<TransactionGuideState> {
  const user = auth.currentUser;
  if (!user) return { hasSeenTransactionGuide: false };

  try {
    await updateDoc(doc(db, COLLECTION_NAME, user.uid), {
      hasSeenTransactionGuide: true,
    });
  } catch {
    await setDoc(doc(db, COLLECTION_NAME, user.uid), {
      hasSeenTransactionGuide: true,
    });
  }

  return { hasSeenTransactionGuide: true };
}
