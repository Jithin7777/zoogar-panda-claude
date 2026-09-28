import { useProfileStore } from '../stores/profileStore';

// The saved profile. Onboarding screens use useOnboardingDraft instead.
export function useProfile() {
  const profile = useProfileStore((state) => state.profile);
  return { profile };
}
