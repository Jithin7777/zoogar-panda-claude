import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSafeStorage, STORAGE_KEYS, warnInvalidStoredData } from '../lib/storage';
import { AuthUser } from '../types/auth';

// Import only from hooks/ and lib/ — screens use hooks/useAuth instead.

type SessionState = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clear: () => void;
};

type PersistedSession = Pick<SessionState, 'user'>;

const initialPersisted: PersistedSession = { user: null };

const persistedSessionSchema = z.object({
  user: z.object({ name: z.string(), email: z.string() }).nullable(),
});

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialPersisted,
      setUser: (user) => set({ user }),
      clear: () => set(initialPersisted),
    }),
    {
      name: STORAGE_KEYS.session,
      storage: createSafeStorage<PersistedSession>(),
      version: 1,
      partialize: (state) => ({ user: state.user }),
      // v1 is the first version: data from any other version is discarded.
      migrate: () => initialPersisted,
      merge: (persisted, current) => {
        const result = persistedSessionSchema.safeParse(persisted);
        if (!result.success) {
          warnInvalidStoredData(STORAGE_KEYS.session, persisted);
          return current;
        }
        return { ...current, ...result.data };
      },
    },
  ),
);
