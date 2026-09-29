import { useEffect, useState } from 'react';
import { useDailyLogStore } from '../stores/dailyLogStore';
import { useProfileStore } from '../stores/profileStore';
import { useSessionStore } from '../stores/sessionStore';

type HydrationApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
};

// Every persisted store the app must wait for before rendering.
const persistedStores: HydrationApi[] = [
  useSessionStore.persist,
  useProfileStore.persist,
  useDailyLogStore.persist,
];

const allHydrated = () => persistedStores.every((store) => store.hasHydrated());

// True once every persisted store has loaded from AsyncStorage. Used only by AppGate.
export function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    const unsubscribers = persistedStores.map((store) =>
      store.onFinishHydration(() => setHydrated(allHydrated())),
    );
    // A store may have finished between the first render and subscribing.
    setHydrated(allHydrated());
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  return hydrated;
}
