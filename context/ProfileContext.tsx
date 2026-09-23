import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { emptyProfile, UserProfile } from '../types/user';

type ProfileContextValue = {
  profile: UserProfile;
  isLoading: boolean;
  updateDraft: (changes: Partial<UserProfile>) => void;
  completeOnboarding: () => Promise<void>;
  resetProfile: () => Promise<void>;
};

const STORAGE_KEY = 'zoogar_user_profile';

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setProfile(JSON.parse(stored));
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Updates the in-memory draft only. Onboarding answers are not persisted
  // until completeOnboarding() runs, so the user can freely go back and edit.
  const updateDraft = (changes: Partial<UserProfile>) => {
    setProfile((current) => ({ ...current, ...changes }));
  };

  const completeOnboarding = async () => {
    const finalProfile: UserProfile = { ...profile, onboardingCompleted: true };
    setProfile(finalProfile);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalProfile));
  };

  const resetProfile = async () => {
    setProfile(emptyProfile);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateDraft, completeOnboarding, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
}
