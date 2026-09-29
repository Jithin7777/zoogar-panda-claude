// Meal check-in times. This is the single source of meal names and opening
// times; user-configured times can later replace getMealSchedule's source
// without changing the hooks or UI.

type MealTemplate = { name: string; opensAt: number };

const at = (hours: number, minutes = 0) => hours * 60 + minutes;

// Keyed by the day's expected meal count. Times are minutes after local midnight.
const DEFAULT_MEAL_SCHEDULES: Partial<Record<number, MealTemplate[]>> = {
  1: [{ name: 'Main meal', opensAt: at(6) }],
  2: [
    { name: 'Breakfast', opensAt: at(6) },
    { name: 'Dinner', opensAt: at(14) },
  ],
  3: [
    { name: 'Breakfast', opensAt: at(6) },
    { name: 'Lunch', opensAt: at(11) },
    { name: 'Dinner', opensAt: at(18, 30) },
  ],
  // 4 meals: deliberately absent. Naming the fourth meal is an open product
  // decision (the product has no snacks), so 4-meal check-ins are unavailable.
};

export type ScheduledMeal = { mealIndex: number; name: string; opensAt: number };

// 'current' runs from a meal's opening until the next meal opens (the last
// meal until midnight); 'past' is after that. Based on the clock only.
export type MealTiming = 'upcoming' | 'current' | 'past';

export function getMealSchedule(expectedMeals: number): ScheduledMeal[] | null {
  const templates = DEFAULT_MEAL_SCHEDULES[expectedMeals];
  if (!templates) return null;
  return templates.map((template, mealIndex) => ({ mealIndex, ...template }));
}

// Minutes since local midnight, from local date parts (never UTC).
export function minutesSinceLocalMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function getMealTiming(schedule: ScheduledMeal[], mealIndex: number, now: Date): MealTiming {
  const minutes = minutesSinceLocalMidnight(now);
  const meal = schedule[mealIndex];
  const nextMeal = schedule[mealIndex + 1];

  if (minutes < meal.opensAt) return 'upcoming';
  if (nextMeal && minutes >= nextMeal.opensAt) return 'past';
  return 'current';
}

// A meal can be logged from its opening time until midnight.
export function isMealOpen(schedule: ScheduledMeal[], mealIndex: number, now: Date): boolean {
  return getMealTiming(schedule, mealIndex, now) !== 'upcoming';
}

// Time until the next meal opens today, or null if every meal has opened.
export function msUntilNextOpening(schedule: ScheduledMeal[], now: Date): number | null {
  const minutes = minutesSinceLocalMidnight(now);
  const next = schedule.find((meal) => meal.opensAt > minutes);
  if (!next) return null;

  const opening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, next.opensAt);
  return opening.getTime() - now.getTime();
}

// 390 → "6:30 AM". Formatted by hand so it doesn't depend on locale support.
export function formatTimeOfDay(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 < 12 ? 'AM' : 'PM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, '0')} ${period}`;
}
