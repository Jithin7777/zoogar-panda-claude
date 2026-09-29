import { MealPlanSnapshot } from '../types/dailyLog';
import { MealsPerDay } from '../types/user';

// Typed as a full Record so adding a MealsPerDay value is a compile error
// until its count is decided here.
const EXPECTED_MEALS: Record<MealsPerDay, number | null> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  // Unresolved product decision: how 5+ meals are tracked. Do not guess a count.
  '5_plus': null,
};

export type MealPlanResolution =
  | { status: 'supported'; snapshot: MealPlanSnapshot }
  | { status: 'unsupported'; mealsPerDay: MealsPerDay }
  | { status: 'missing' };

// Missing (or, defensively, unrecognised) values are never defaulted to a count.
export function resolveMealPlan(mealsPerDay: MealsPerDay | undefined): MealPlanResolution {
  if (mealsPerDay === undefined) return { status: 'missing' };

  const expectedMeals: number | null | undefined = EXPECTED_MEALS[mealsPerDay];
  if (expectedMeals === undefined) return { status: 'missing' };
  if (expectedMeals === null) return { status: 'unsupported', mealsPerDay };

  return { status: 'supported', snapshot: { mealsPerDay, expectedMeals } };
}   
