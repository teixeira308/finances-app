import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PrivacyState {
  isHidden: boolean;
  togglePrivacy: () => void;
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      isHidden: false,
      togglePrivacy: () => set((state) => ({ isHidden: !state.isHidden })),
    }),
    {
      name: 'privacy-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
