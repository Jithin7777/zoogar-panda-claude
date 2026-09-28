import { create } from 'zustand';
import { UserProfile } from '../types/user';

// Import only from hooks/ and lib/ — screens use hooks/useOnboardingDraft instead.

export type OnboardingDraft = Omit<UserProfile, 'onboardingCompleted'>;

type OnboardingState = {
  draft: OnboardingDraft;
  updateDraft: (changes: Partial<OnboardingDraft>) => void;
  reset: () => void;
};

const initialDraft: OnboardingDraft = { name: '', age: '' };

// Memory only: onboarding answers are not persisted, so the user can freely
// go back and edit, and an interrupted onboarding starts fresh next launch.
export const useOnboardingStore = create<OnboardingState>()((set) => ({
  draft: initialDraft,
  updateDraft: (changes) => set((state) => ({ draft: { ...state.draft, ...changes } })),
  reset: () => set({ draft: initialDraft }),
}));
