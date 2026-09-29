import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import { formatTimeOfDay, getMealSchedule, getMealTiming, msUntilNextOpening } from '../lib/mealSchedule';
import { MealEntry } from '../types/dailyLog';
import { TodayLog, useTodayLog } from './useTodayLog';

// Fires slightly after a meal opens so a timer that runs a little early still
// sees the new state.
const OPENING_BUFFER_MS = 1000;

export type MealStatus = 'logged' | 'current' | 'missed' | 'upcoming';

export type CheckInMeal = {
  mealIndex: number;
  name: string;
  opensAtLabel: string;
  status: MealStatus;
  entry: MealEntry | null;
  // Open (current or missed) and not yet logged.
  canLog: boolean;
};

export type MealCheckIn =
  | { status: 'incompleteProfile' }
  | { status: 'unsupportedMealPlan' }
  // No check-in schedule for this meal count (currently 4 meals).
  | { status: 'scheduleUnavailable'; expectedMeals: number }
  | {
      status: 'active';
      meals: CheckInMeal[];
      // The current meal if it still needs logging, otherwise the earliest
      // missed meal, otherwise null (nothing to log right now).
      defaultFocusIndex: number | null;
      nextUpcoming: CheckInMeal | null;
      loggedCount: number;
      expectedMeals: number;
      isComplete: boolean;
    };

// Combines today's log with the meal schedule at a given moment. Pure, so the
// time rules can be checked without rendering.
export function getMealCheckIn(today: TodayLog, now: Date): MealCheckIn {
  if (today.status === 'incompleteProfile') return { status: 'incompleteProfile' };
  if (today.status === 'unsupportedMealPlan') return { status: 'unsupportedMealPlan' };

  const schedule = getMealSchedule(today.expectedMeals);
  if (!schedule) return { status: 'scheduleUnavailable', expectedMeals: today.expectedMeals };

  const meals = schedule.map((meal): CheckInMeal => {
    const entry = today.slots[meal.mealIndex]?.entry ?? null;
    const timing = getMealTiming(schedule, meal.mealIndex, now);

    let status: MealStatus;
    if (entry) status = 'logged';
    else if (timing === 'upcoming') status = 'upcoming';
    else if (timing === 'current') status = 'current';
    else status = 'missed';

    return {
      mealIndex: meal.mealIndex,
      name: meal.name,
      opensAtLabel: formatTimeOfDay(meal.opensAt),
      status,
      entry,
      canLog: status === 'current' || status === 'missed',
    };
  });

  const focusMeal = meals.find((meal) => meal.status === 'current') ?? meals.find((meal) => meal.status === 'missed');

  return {
    status: 'active',
    meals,
    defaultFocusIndex: focusMeal ? focusMeal.mealIndex : null,
    nextUpcoming: meals.find((meal) => meal.status === 'upcoming') ?? null,
    loggedCount: today.loggedCount,
    expectedMeals: today.expectedMeals,
    isComplete: today.isComplete,
  };
}

// Today's meal check-ins with each meal's time-based status. Re-evaluates when
// a meal opens, when the app resumes and when the day rolls over.
export function useMealCheckIn(): MealCheckIn {
  const today = useTodayLog();
  const [now, setNow] = useState(() => new Date());
  const expectedMeals = today.status === 'ready' ? today.expectedMeals : null;

  // New day (see useDayRollover): re-read the clock.
  useEffect(() => {
    setNow(new Date());
  }, [today.date]);

  // JS timers pause in the background, so re-read the clock on resume.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(new Date());
    });
    return () => subscription.remove();
  }, []);

  // Wake up when the next meal opens while the screen stays open.
  useEffect(() => {
    const schedule = expectedMeals === null ? null : getMealSchedule(expectedMeals);
    if (!schedule) return;
    const delay = msUntilNextOpening(schedule, now);
    if (delay === null) return;

    const timer = setTimeout(() => setNow(new Date()), delay + OPENING_BUFFER_MS);
    return () => clearTimeout(timer);
  }, [expectedMeals, now]);

  return useMemo(() => getMealCheckIn(today, now), [today, now]);
}
