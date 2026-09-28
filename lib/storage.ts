import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistStorage, StorageValue } from 'zustand/middleware';

export const STORAGE_KEYS = {
  session: 'zoogar_session',
  profile: 'zoogar_profile',
};

// Keys written by the old AuthContext/ProfileContext. Their data is dev/test
// only and is not imported; it is cleared once after the new stores hydrate.
const LEGACY_STORAGE_KEYS = ['zoogar_auth_user', 'zoogar_user_profile'];
const LEGACY_CLEANUP_DONE_KEY = 'zoogar_legacy_keys_cleared';

function warnInDev(message: string, error?: unknown) {
  if (__DEV__) console.warn(`[storage] ${message}`, error ?? '');
}

// AsyncStorage adapter for Zustand's persist middleware that never throws.
// persist leaves a store un-hydrated forever if reading fails, which would
// keep AppGate on its spinner, so unreadable data is treated as "nothing
// stored" instead.
export function createSafeStorage<S>(): PersistStorage<S> {
  return {
    getItem: async (name) => {
      let raw: string | null;
      try {
        raw = await AsyncStorage.getItem(name);
      } catch (error) {
        warnInDev(`Could not read "${name}".`, error);
        return null;
      }
      if (raw === null) return null;

      try {
        return JSON.parse(raw) as StorageValue<S>;
      } catch (error) {
        warnInDev(`Discarding unparseable data for "${name}".`, error);
        AsyncStorage.removeItem(name).catch(() => {});
        return null;
      }
    },
    setItem: async (name, value) => {
      try {
        await AsyncStorage.setItem(name, JSON.stringify(value));
      } catch (error) {
        warnInDev(`Could not write "${name}".`, error);
      }
    },
    removeItem: async (name) => {
      try {
        await AsyncStorage.removeItem(name);
      } catch (error) {
        warnInDev(`Could not remove "${name}".`, error);
      }
    },
  };
}

// Logs a warning in development when stored data exists but fails validation
// and is replaced by the store's initial state.
export function warnInvalidStoredData(name: string, persisted: unknown) {
  if (persisted !== undefined) warnInDev(`Discarding invalid data for "${name}".`);
}

let legacyCleanupStarted = false;

// One-time removal of the pre-Zustand keys. Call only after the new stores
// have hydrated; a marker key stops it from running again on later launches.
export async function clearLegacyStorageOnce() {
  if (legacyCleanupStarted) return;
  legacyCleanupStarted = true;

  try {
    if (await AsyncStorage.getItem(LEGACY_CLEANUP_DONE_KEY)) return;
    await AsyncStorage.multiRemove(LEGACY_STORAGE_KEYS);
    await AsyncStorage.setItem(LEGACY_CLEANUP_DONE_KEY, 'true');
  } catch (error) {
    warnInDev('Could not clear legacy storage keys.', error);
  }
}
