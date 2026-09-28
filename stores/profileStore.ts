import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSafeStorage, STORAGE_KEYS, warnInvalidStoredData } from '../lib/storage';
import { emptyProfile, UserProfile } from '../types/user';

// Import only from hooks/ and lib/ — screens use hooks/useProfile instead.

type ProfileState = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  reset: () => void;
};

type PersistedProfile = Pick<ProfileState, 'profile'>;

const initialPersisted: PersistedProfile = { profile: emptyProfile };

// Mirrors UserProfile in types/user.ts; the annotation keeps the two in sync.
const userProfileSchema: z.ZodType<UserProfile> = z.object({
  name: z.string(),
  age: z.string(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  activityLevel: z.enum(['low', 'moderate', 'high']).optional(),
  sugarConsumptionFrequency: z.enum(['rarely', 'sometimes', 'daily', 'several_times_daily']).optional(),
  goal: z.enum(['reduce_sugar', 'maintain_habits', 'build_healthier_habits']).optional(),
  mealsPerDay: z.enum(['1', '2', '3', '4', '5_plus']).optional(),
  onboardingCompleted: z.boolean(),
});

const persistedProfileSchema = z.object({ profile: userProfileSchema });

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...initialPersisted,
      setProfile: (profile) => set({ profile }),
      reset: () => set(initialPersisted),
    }),
    {
      name: STORAGE_KEYS.profile,
      storage: createSafeStorage<PersistedProfile>(),
      version: 1,
      partialize: (state) => ({ profile: state.profile }),
      // v1 is the first version: data from any other version is discarded.
      migrate: () => initialPersisted,
      merge: (persisted, current) => {
        const result = persistedProfileSchema.safeParse(persisted);
        if (!result.success) {
          warnInvalidStoredData(STORAGE_KEYS.profile, persisted);
          return current;
        }
        return { ...current, ...result.data };
      },
    },
  ),
);
