import { MealsPerDay } from './user';

// Local calendar date, 'YYYY-MM-DD'. Always built with lib/dates.ts toDateKey.
export type DateKey = string;

// Deliberately has no grams/score attached yet (unresolved product decision).
export type SugarLevel = 'low' | 'moderate' | 'high';

// The meal plan a day was logged against, fixed when its first meal is logged
// so later profile changes never rewrite that day.
export type MealPlanSnapshot = {
  mealsPerDay: MealsPerDay;
  expectedMeals: number;
};

export type MealEntry = {
  // 0-based position in the day's plan: Meal 1 is index 0.
  mealIndex: number;
  level: SugarLevel;
  // ISO timestamp of when the meal was logged.
  loggedAt: string;
};

export type DailyLog = {
  date: DateKey;
  plan: MealPlanSnapshot;
  // Sorted by mealIndex, at most one entry per index.
  entries: MealEntry[];
};

export type LogMealFailureReason =
  | 'incompleteProfile'
  | 'unsupportedMealPlan'
  | 'invalidMealIndex'
  | 'alreadyLogged'
  | 'dayChanged'
  // The meal's check-in time hasn't started yet.
  | 'mealNotOpenYet'
  // No check-in schedule exists for this meal count (currently 4 meals).
  | 'scheduleUnavailable';

// A successful save returns the entry so the caller can undo exactly that entry.
export type LogMealResult = { ok: true; entry: MealEntry } | { ok: false; reason: LogMealFailureReason };
