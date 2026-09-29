import { useCallback } from 'react';
import { getMealSchedule, isMealOpen } from '../lib/mealSchedule';
import { resolveMealPlan } from '../lib/meals';
import { useDailyLogStore } from '../stores/dailyLogStore';
import { useProfileStore } from '../stores/profileStore';
import { LogMealResult, MealEntry, MealPlanSnapshot, SugarLevel } from '../types/dailyLog';

// Logs (and undoes) meals for the day the caller is showing. Subscribes only
// to todayKey, so components using it re-render just when the day changes.
export function useLogMeal() {
  const todayKey = useDailyLogStore((state) => state.todayKey);

  const logMeal = useCallback(
    (mealIndex: number, level: SugarLevel): LogMealResult => {
      const store = useDailyLogStore.getState();

      // If midnight passed since this screen rendered, don't write to the
      // new day on the old day's behalf; the UI re-renders for the new day.
      store.refreshToday();
      if (useDailyLogStore.getState().todayKey !== todayKey) {
        return { ok: false, reason: 'dayChanged' };
      }

      // An existing day keeps its saved plan; the first meal of the day uses
      // the profile's meal frequency as it is right now.
      let plan: MealPlanSnapshot;
      const existing = store.logs[todayKey];
      if (existing) {
        plan = existing.plan;
      } else {
        const resolution = resolveMealPlan(useProfileStore.getState().profile.mealsPerDay);
        if (resolution.status === 'missing') return { ok: false, reason: 'incompleteProfile' };
        if (resolution.status === 'unsupported') return { ok: false, reason: 'unsupportedMealPlan' };
        plan = resolution.snapshot;
      }

      // Meals can't be logged before their check-in time. Out-of-range
      // indexes fall through to the store, which rejects them.
      const now = new Date();
      const schedule = getMealSchedule(plan.expectedMeals);
      if (!schedule) return { ok: false, reason: 'scheduleUnavailable' };
      if (schedule[mealIndex] && !isMealOpen(schedule, mealIndex, now)) {
        return { ok: false, reason: 'mealNotOpenYet' };
      }

      return store.logMeal({ date: todayKey, mealIndex, level, plan, loggedAt: now.toISOString() });
    },
    [todayKey],
  );

  // Removes exactly the given entry from today's log (Undo after saving).
  const undoMeal = useCallback(
    (entry: MealEntry): boolean =>
      useDailyLogStore
        .getState()
        .removeMeal({ date: todayKey, mealIndex: entry.mealIndex, loggedAt: entry.loggedAt }),
    [todayKey],
  );

  return { logMeal, undoMeal };
}
