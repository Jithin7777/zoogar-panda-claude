import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';

// Saves the draft as the user's profile. The draft is deliberately kept (not
// reset) so the Complete screen can keep showing the name until it navigates
// away; it is memory-only and cleared on the next launch or app reset.
async function completeOnboarding() {
  const { draft } = useOnboardingStore.getState();
  useProfileStore.getState().setProfile({ ...draft, onboardingCompleted: true });
}

export function useOnboardingDraft() {
  const draft = useOnboardingStore((state) => state.draft);
  const updateDraft = useOnboardingStore((state) => state.updateDraft);
  return { draft, updateDraft, completeOnboarding };
}
