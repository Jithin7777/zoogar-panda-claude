import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addMealEntry, parsePersistedLogs, removeMealEntry } from '../lib/dailyLog';
import { toDateKey } from '../lib/dates';
import { createSafeStorage, STORAGE_KEYS, warnInDev, warnInvalidStoredData } from '../lib/storage';
import { DailyLog, DateKey, LogMealResult, MealPlanSnapshot, SugarLevel } from '../types/dailyLog';

// Import only from hooks/ and lib/ — screens use hooks/useTodayLog and hooks/useLogMeal.

type LogMealInput = {
  date: DateKey;
  mealIndex: number;
  level: SugarLevel;
  plan: MealPlanSnapshot;
  loggedAt: string;
};

type DailyLogState = {
  logs: Record<DateKey, DailyLog>;
  // Not persisted: always derived from the clock. Kept current by useDayRollover.
  todayKey: DateKey;
  logMeal: (input: LogMealInput) => LogMealResult;
  // Undo for the entry just saved; see removeMealEntry. Returns false if nothing was removed.
  removeMeal: (input: { date: DateKey; mealIndex: number; loggedAt: string }) => boolean;
  refreshToday: () => void;
  reset: () => void;
};

type PersistedDailyLogs = Pick<DailyLogState, 'logs'>;

const initialPersisted: PersistedDailyLogs = { logs: {} };

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      todayKey: toDateKey(new Date()),
      logMeal: (input) => {
        // Catch a midnight that passed since the caller read todayKey.
        get().refreshToday();
        const { logs, todayKey } = get();

        const result = addMealEntry(logs[input.date], { ...input, todayKey });
        if (!result.ok) return result;

        set({ logs: { ...logs, [input.date]: result.log } });
        return { ok: true, entry: result.entry };
      },
      removeMeal: (input) => {
        get().refreshToday();
        const { logs, todayKey } = get();

        const updated = removeMealEntry(logs[input.date], { ...input, todayKey });
        if (updated === undefined) return false;

        const { [input.date]: _removed, ...otherDays } = logs;
        set({ logs: updated === null ? otherDays : { ...otherDays, [input.date]: updated } });
        return true;
      },
      refreshToday: () => {
        const todayKey = toDateKey(new Date());
        if (todayKey !== get().todayKey) set({ todayKey });
      },
      reset: () => set({ ...initialPersisted, todayKey: toDateKey(new Date()) }),
    }),
    {
      name: STORAGE_KEYS.dailyLogs,
      storage: createSafeStorage<PersistedDailyLogs>(),
      version: 1,
      partialize: (state) => ({ logs: state.logs }),
      // v1 is the first version: data from any other version is discarded.
      migrate: () => initialPersisted,
      merge: (persisted, current) => {
        const parsed = parsePersistedLogs(persisted);
        if (!parsed) {
          warnInvalidStoredData(STORAGE_KEYS.dailyLogs, persisted);
          return current;
        }
        if (parsed.droppedDays > 0) {
          warnInDev(`Discarding ${parsed.droppedDays} invalid day(s) from "${STORAGE_KEYS.dailyLogs}".`);
        }
        return { ...current, logs: parsed.logs };
      },
    },
  ),
);
