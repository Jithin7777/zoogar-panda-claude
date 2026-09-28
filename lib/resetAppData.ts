import { useOnboardingStore } from '../stores/onboardingStore';
import { useProfileStore } from '../stores/profileStore';
import { useSessionStore } from '../stores/sessionStore';

// Returns every store to its initial state and removes their persisted data.
// Used by DevResetButton. Stores stay hydrated, so AppGate does not reload.
export async function resetAppData() {
  useSessionStore.getState().clear();
  useProfileStore.getState().reset();
  useOnboardingStore.getState().reset();

  // The resets above also re-save the initial state; whichever write lands
  // last, the next launch hydrates to the same empty state.
  useSessionStore.persist.clearStorage();
  useProfileStore.persist.clearStorage();
}
