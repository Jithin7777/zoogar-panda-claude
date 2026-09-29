import { useMemo } from 'react';
import { DaySummary, summarizeDay } from '../lib/dailyLog';
import { resolveMealPlan } from '../lib/meals';
import { useDailyLogStore } from '../stores/dailyLogStore';
import { useProfileStore } from '../stores/profileStore';
import { DailyLog, DateKey, MealPlanSnapshot } from '../types/dailyLog';
import { MealsPerDay } from '../types/user';

export type TodayLog =
  | ({
      status: 'ready';
      date: DateKey;
      plan: MealPlanSnapshot;
      // null until today's first meal is logged.
      log: DailyLog | null;
    } & DaySummary)
  // 5_plus tracking is an unresolved product decision.
  | { status: 'unsupportedMealPlan'; date: DateKey; mealsPerDay: MealsPerDay }
  // The profile has no meals-per-day value; never defaulted to a count.
  | { status: 'incompleteProfile'; date: DateKey };

// Today's meal log plus derived values (none of which are stored). Once today
// has a logged meal its saved plan wins; before that the current profile
// setting is used.
export function useTodayLog(): TodayLog {
  const todayKey = useDailyLogStore((state) => state.todayKey);
  const todayLog: DailyLog | undefined = useDailyLogStore((state) => state.logs[state.todayKey]);
  const mealsPerDay = useProfileStore((state) => state.profile.mealsPerDay);

  return useMemo((): TodayLog => {
    if (todayLog) {
      return {
        status: 'ready',
        date: todayKey,
        plan: todayLog.plan,
        log: todayLog,
        ...summarizeDay(todayLog.plan, todayLog.entries),
      };
    }

    const resolution = resolveMealPlan(mealsPerDay);
    switch (resolution.status) {
      case 'missing':
        return { status: 'incompleteProfile', date: todayKey };
      case 'unsupported':
        return { status: 'unsupportedMealPlan', date: todayKey, mealsPerDay: resolution.mealsPerDay };
      case 'supported':
        return {
          status: 'ready',
          date: todayKey,
          plan: resolution.snapshot,
          log: null,
          ...summarizeDay(resolution.snapshot, []),
        };
    }
  }, [todayKey, todayLog, mealsPerDay]);
}
